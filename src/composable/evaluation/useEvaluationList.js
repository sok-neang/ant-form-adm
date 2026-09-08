import { ref, watch, computed } from "vue";
import submissionService from "@/services/submission.service";
import dashboardService from "@/services/dashboard.service";

export const useEvaluationList = () => {
  const students = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const search = ref("");

  const filters = ref({
    subject: "",
    skill: "",
    score: "",
    shift: "",
  });

  const pagination = ref({
    current_page: 1,
    per_page: 10,
    total: 0,
    totalPages: 1,
  });

  const summaryStats = ref({
    total: 0,
    evaluated: 0,
    pending: 0,
  });

  // Helper to map program subjects and evaluation statuses
  const mapSubjects = (program, evaluations = []) => {
    let required = [];
    if (program === "MOBILE_APP") {
      required = [
        { key: "CPP", name: "C++", color: "green" },
        { key: "DART", name: "Dart", color: "blue" },
      ];
    } else {
      // Default to Web Development subjects
      required = [
        { key: "CPP", name: "C++", color: "green" },
        { key: "HTML_CSS", name: "HTML & CSS", color: "orange" },
      ];
    }

    return required.map((req) => {
      const match = evaluations.find((e) => {
        const subKey = (e.subject || "").toUpperCase();
        if (subKey === req.key) return true;
        if (req.key === "CPP" && (subKey === "C++" || subKey.includes("CPP"))) return true;
        if (req.key === "DART" && subKey.includes("DART")) return true;
        if (req.key === "HTML_CSS" && (subKey.includes("HTML") || subKey.includes("CSS"))) return true;
        return false;
      });
      return {
        name: req.name,
        key: req.key,
        color: match ? req.color : "gray",
        evaluated: Boolean(match),
        score: match ? (match.averageScore ?? match.score ?? null) : null,
      };
    });
  };

  // Transform a single submission record into table row format
  const transformSubmission = (sub, index) => {
    const subjects = mapSubjects(sub.program, sub.evaluations || []);

    // Only if there are two evaluations or both subjects are evaluated -> Edit button
    // If only one evaluation/subject is evaluated or none -> Add button
    const evaluationCount = Array.isArray(sub.evaluations) ? sub.evaluations.length : 0;
    const evaluatedSubjectsCount = subjects.filter((s) => s.evaluated).length;
    const isBothEvaluated = evaluationCount >= 2 || evaluatedSubjectsCount >= 2;

    const genderText =
      sub.student?.gender === "FEMALE"
        ? "ស្រី"
        : sub.student?.gender === "MALE"
        ? "ប្រុស"
        : "N/A";

    const shiftText =
      sub.shift === "MORNING"
        ? "ព្រឹក"
        : sub.shift === "AFTERNOON"
        ? "រសៀល"
        : sub.shift || "N/A";

    const skillText =
      sub.program === "WEB_DEVELOPMENT" ? "Web Development" : "Mobile App";

    // Determine accurate numeric score:
    let numericScore = null;
    if (sub.overallAverageScore != null && Number(sub.overallAverageScore) > 0) {
      numericScore = Number(sub.overallAverageScore);
    } else if (Array.isArray(sub.evaluations) && sub.evaluations.length > 0) {
      const validEvals = sub.evaluations.filter(
        (e) =>
          (e.averageScore != null && Number(e.averageScore) > 0) ||
          e.technicalScore != null ||
          e.attendanceScore != null
      );
      if (validEvals.length > 0) {
        const sum = validEvals.reduce((acc, e) => {
          const avg =
            e.averageScore != null
              ? Number(e.averageScore)
              : (Number(e.technicalScore || 0) + Number(e.attendanceScore || 0)) / 2;
          return acc + avg;
        }, 0);
        numericScore = sum / validEvals.length;
      }
    }

    const totalScoreText =
      numericScore != null
        ? String(Math.round(numericScore))
        : "N/A";

    return {
      id: sub.id,
      submissionId: sub.id,
      studentId: sub.studentId,
      name: sub.student?.khName || sub.student?.enName || "N/A",
      gender: genderText,
      skill: skillText,
      study_shift: shiftText,
      subjects,
      scoreValue: numericScore,
      total_score: totalScoreText,
      is_evaluated: isBothEvaluated,
      raw: sub,
    };
  };

  const getEvaluations = async (page = 1) => {
    loading.value = true;
    error.value = null;
    try {
      const params = {
        page,
        limit: pagination.value.per_page || 10,
      };

      if (search.value.trim()) {
        params.search = search.value.trim();
      }
      if (filters.value.skill) {
        params.program = filters.value.skill;
        params.track = filters.value.skill;
      }
      if (filters.value.shift) {
        params.shift = filters.value.shift;
      }
      if (filters.value.subject) {
        params.subject = filters.value.subject;
      }
      if (filters.value.score) {
        const s = String(filters.value.score).toLowerCase();
        if (s === "high" || s === "highest") {
          params.scoreSort = "highest";
          params.score = "highest";
        } else if (s === "low" || s === "lowest") {
          params.scoreSort = "lowest";
          params.score = "lowest";
        }
      }

      let response;
      try {
        response = await submissionService.getShortlist(params);
        console.log("Shortlist submissions response:", response.data);
      } catch (reqErr) {
        console.warn("Shortlist query with params failed, trying fallback:", reqErr);
        // If remote backend rejected unknown params (e.g. subject or scoreSort), fallback to base query
        const fallbackParams = { page, limit: pagination.value.per_page || 10 };
        if (params.search) fallbackParams.search = params.search;
        if (params.program) {
          fallbackParams.program = params.program;
          fallbackParams.track = params.track;
        }
        if (params.shift) fallbackParams.shift = params.shift;
        if (params.scoreSort) fallbackParams.scoreSort = params.scoreSort;
        response = await submissionService.getShortlist(fallbackParams);
      }

      if (response.data?.success && response.data?.data) {
        const rawList = Array.isArray(response.data.data)
          ? response.data.data
          : (response.data.data.submissions || []);
        
        let mapped = rawList.map((item, idx) => transformSubmission(item, idx));

        // Client-side filtering fallback to ensure filters always take effect
        if (filters.value.skill) {
          mapped = mapped.filter((s) => {
            const prog = s.raw?.program || (s.skill === "Web Development" ? "WEB_DEVELOPMENT" : "MOBILE_APP");
            return prog === filters.value.skill;
          });
        }

        if (filters.value.shift) {
          mapped = mapped.filter((s) => {
            const sh = s.raw?.shift || (s.study_shift === "ព្រឹក" ? "MORNING" : "AFTERNOON");
            return sh === filters.value.shift;
          });
        }

        if (filters.value.subject) {
          const subKey = String(filters.value.subject).toUpperCase();
          mapped = mapped.filter((s) => {
            const matchesTrack =
              subKey === "CPP" ||
              (subKey === "HTML_CSS" && (s.raw?.program === "WEB_DEVELOPMENT" || s.skill === "Web Development")) ||
              (subKey === "DART" && (s.raw?.program === "MOBILE_APP" || s.skill === "Mobile App"));
            const hasEvaluatedSubject = (s.subjects || []).some((sub) => sub.key === subKey && sub.evaluated);
            return matchesTrack || hasEvaluatedSubject;
          });
        }

        if (filters.value.score) {
          const s = String(filters.value.score).toLowerCase();
          if (s === "high" || s === "highest") {
            mapped.sort((a, b) => {
              const valA = a.scoreValue != null ? a.scoreValue : -1;
              const valB = b.scoreValue != null ? b.scoreValue : -1;
              return valB - valA;
            });
          } else if (s === "low" || s === "lowest") {
            mapped.sort((a, b) => {
              const valA = a.scoreValue != null ? a.scoreValue : 9999;
              const valB = b.scoreValue != null ? b.scoreValue : 9999;
              return valA - valB;
            });
          }
        }

        students.value = mapped;

        if (response.data.data.pagination) {
          const p = response.data.data.pagination;
          pagination.value = {
            current_page: p.page || page,
            per_page: p.per_page || 10,
            total: p.total ?? p.totalSubmissions ?? mapped.length,
            totalPages: p.totalPages || Math.ceil((p.total || mapped.length) / (p.per_page || 10)) || 1,
          };
        } else {
          pagination.value = {
            current_page: page,
            per_page: 10,
            total: mapped.length,
            totalPages: Math.ceil(mapped.length / 10) || 1,
          };
        }

        // Update summary stats from shortlist & evaluation stats
        if (rawDashboardStats.value) {
          updateSummaryStats();
        } else {
          await fetchShortlistStats();
        }

        if (!rawDashboardStats.value) {
          const total = pagination.value.total ?? mapped.length;
          const evaluatedCount = students.value.filter((s) => s.is_evaluated).length;
          summaryStats.value = {
            total: total ?? 0,
            evaluated: evaluatedCount,
            pending: total ? Math.max(0, total - evaluatedCount) : 0,
          };
        }
      }
      return response.data;
    } catch (err) {
      console.error("Failed to fetch shortlist submissions:", err);
      error.value = err.response?.data?.message || "មិនអាចទាញយកបញ្ជីសិស្សបានទេ";
    } finally {
      loading.value = false;
    }
  };

  const rawDashboardStats = ref(null);

  const fetchShortlistStats = async () => {
    try {
      const response = await dashboardService.getStats();
      if (response.data?.success && response.data?.data) {
        rawDashboardStats.value = response.data.data;
        updateSummaryStats();
      }
    } catch (err) {
      console.warn("Could not load global shortlist stats, using table fallback:", err);
    }
  };

  const updateSummaryStats = () => {
    if (!rawDashboardStats.value) return;

    const d = rawDashboardStats.value;
    const shortlist = d.shortlist?.passed || {};
    const evalPassed = d.evaluation?.passed || {};
    const evalFailed = d.evaluation?.failed || {};

    let total = shortlist.total ?? 0;
    let evaluated = (evalPassed.total ?? 0) + (evalFailed.total ?? 0);

    // If filtered by skill / program
    if (filters.value.skill === "WEB_DEVELOPMENT") {
      total = shortlist.web ?? 0;
      evaluated = (evalPassed.web ?? 0) + (evalFailed.web ?? 0);
    } else if (filters.value.skill === "MOBILE_APP") {
      total = shortlist.mobile ?? 0;
      evaluated = (evalPassed.mobile ?? 0) + (evalFailed.mobile ?? 0);
    }

    // If filtered by shift
    if (filters.value.shift) {
      const shiftKey = filters.value.shift;
      const shShortlist = (shortlist.byShift || []).find((s) => s.shift === shiftKey);
      const shPassed = (evalPassed.byShift || []).find((s) => s.shift === shiftKey);
      const shFailed = (evalFailed.byShift || []).find((s) => s.shift === shiftKey);

      if (filters.value.skill === "WEB_DEVELOPMENT") {
        total = shShortlist?.web ?? 0;
        evaluated = (shPassed?.web ?? 0) + (shFailed?.web ?? 0);
      } else if (filters.value.skill === "MOBILE_APP") {
        total = shShortlist?.mobile ?? 0;
        evaluated = (shPassed?.mobile ?? 0) + (shFailed?.mobile ?? 0);
      } else {
        total = shShortlist?.total ?? 0;
        evaluated = (shPassed?.total ?? 0) + (shFailed?.total ?? 0);
      }
    }

    const pending = Math.max(0, total - evaluated);

    summaryStats.value = {
      total,
      evaluated,
      pending,
    };
  };

  const cards = computed(() => [
    {
      title: "សិស្សសរុប",
      value: summaryStats.value.total ?? pagination.value.total ?? 0,
      icon: "bi bi-people",
      color: "primary",
    },
    {
      title: "បានវាយតម្លៃ",
      value: summaryStats.value.evaluated ?? 0,
      icon: "bi bi-check-circle",
      color: "success",
    },
    {
      title: "មិនទាន់បានវាយតម្លៃ",
      value: summaryStats.value.pending ?? 0,
      icon: "bi bi-hourglass-split",
      color: "warning",
    },
  ]);

  let searchDebounce;
  watch(search, () => {
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(() => {
      getEvaluations(1);
    }, 400);
  });

  watch(
    filters,
    () => {
      getEvaluations(1);
    },
    { deep: true }
  );

  watch(
    [
      () => filters.value.subject,
      () => filters.value.skill,
      () => filters.value.score,
      () => filters.value.shift,
    ],
    () => {
      getEvaluations(1);
    }
  );

  return {
    students,
    loading,
    error,
    search,
    filters,
    pagination,
    cards,
    getEvaluations,
    fetchShortlistStats,
  };
};
