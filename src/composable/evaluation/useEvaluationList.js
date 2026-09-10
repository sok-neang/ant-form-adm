import { ref, watch, computed } from "vue";
import submissionService from "@/services/submission.service";
import dashboardService from "@/services/dashboard.service";

export const useEvaluationList = () => {
  const students = ref([]);
  const allSubmissions = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const search = ref("");

  const filters = ref({
    evaluationStatus: "",
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

  const rawDashboardStats = ref(null);

  const fetchShortlistStats = async () => {
    try {
      const response = await dashboardService.getStats();
      if (response.data?.success && response.data?.data) {
        rawDashboardStats.value = response.data.data;
      }
    } catch (err) {
      console.warn("Could not fetch dashboard stats:", err);
    }
  };

  const summaryStats = ref({
    total: 0,
    evaluated: 0,
    pending: 0,
  });

  const mapSubjects = (program, evaluations = []) => {
    let required = [];
    if (program === "MOBILE_APP") {
      required = [
        { key: "CPP", name: "C++", color: "green" },
        { key: "DART", name: "Dart", color: "blue" },
      ];
    } else {
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

  const transformSubmission = (sub, index) => {
    const subjects = mapSubjects(sub.program, sub.evaluations || []);
    const evaluationCount = Array.isArray(sub.evaluations) ? sub.evaluations.length : 0;
    const evaluatedSubjectsCount = subjects.filter((s) => s.evaluated).length;
    const isBothEvaluated = Boolean(sub.isEvaluated) || evaluationCount >= 2 || evaluatedSubjectsCount >= 2;

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

  // Fetch all shortlist candidates (handles backend pagination if > 100)
  const fetchAllShortlistCandidates = async () => {
    const params = {
      page: 1,
      limit: 100,
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

    const response = await submissionService.getShortlist(params);
    let rawList = [];
    let totalItems = 0;

    if (response.data?.success && response.data?.data) {
      rawList = Array.isArray(response.data.data)
        ? [...response.data.data]
        : [...(response.data.data.submissions || [])];
      const p = response.data.data.pagination;
      totalItems = p?.total ?? p?.totalSubmissions ?? rawList.length;

      // If more than 100 items, fetch subsequent pages
      if (totalItems > 100) {
        const totalPages = Math.ceil(totalItems / 100);
        const additionalPromises = [];
        for (let pageNum = 2; pageNum <= totalPages; pageNum++) {
          additionalPromises.push(
            submissionService.getShortlist({ ...params, page: pageNum, limit: 100 })
          );
        }
        const extraResponses = await Promise.all(additionalPromises);
        for (const res of extraResponses) {
          if (res.data?.success && res.data?.data) {
            const extraList = Array.isArray(res.data.data)
              ? res.data.data
              : (res.data.data.submissions || []);
            rawList.push(...extraList);
          }
        }
      }
    }

    return rawList.map((item, idx) => transformSubmission(item, idx));
  };

  // Apply filters, score sorting, and client pagination
  const applyFiltersAndPagination = (page = 1) => {
    let items = [...allSubmissions.value];

    // Client-side fallback filter for skill & shift in case backend ignored
    if (filters.value.skill) {
      items = items.filter((s) => {
        const prog = s.raw?.program || (s.skill === "Web Development" ? "WEB_DEVELOPMENT" : "MOBILE_APP");
        return prog === filters.value.skill;
      });
    }
    if (filters.value.shift) {
      items = items.filter((s) => {
        const sh = s.raw?.shift || (s.study_shift === "ព្រឹក" ? "MORNING" : "AFTERNOON");
        return sh === filters.value.shift;
      });
    }

    // Top Cards Stats: based on backend shortlistEvaluation or matching candidates
    const hasSkillFilter = Boolean(filters.value.skill);
    const hasShiftFilter = Boolean(filters.value.shift);
    const hasSearch = Boolean(search.value.trim());

    if (rawDashboardStats.value?.shortlistEvaluation && !hasSearch && !(hasSkillFilter && hasShiftFilter)) {
      const sEval = rawDashboardStats.value.shortlistEvaluation;
      let total = sEval.total ?? 0;
      let evaluated = sEval.evaluated ?? 0;
      let pending = sEval.pending ?? 0;

      if (hasSkillFilter) {
        const progKey = filters.value.skill === "WEB_DEVELOPMENT" ? "web" : "mobile";
        total = sEval.byProgram?.[progKey]?.total ?? total;
        evaluated = sEval.byProgram?.[progKey]?.evaluated ?? evaluated;
        pending = sEval.byProgram?.[progKey]?.pending ?? pending;
      } else if (hasShiftFilter) {
        const shiftKey = filters.value.shift === "MORNING" ? "morning" : "afternoon";
        total = sEval.byShift?.[shiftKey]?.total ?? total;
        evaluated = sEval.byShift?.[shiftKey]?.evaluated ?? evaluated;
        pending = sEval.byShift?.[shiftKey]?.pending ?? pending;
      }

      summaryStats.value = {
        total,
        evaluated,
        pending,
      };
    } else {
      const totalCount = items.length;
      const evaluatedCount = items.filter((s) => s.is_evaluated).length;
      const pendingCount = Math.max(0, totalCount - evaluatedCount);

      summaryStats.value = {
        total: totalCount,
        evaluated: evaluatedCount,
        pending: pendingCount,
      };
    }

    // Filter by Evaluation Status (បានវាយតម្លៃ vs មិនទាន់បានវាយតម្លៃ)
    if (filters.value.evaluationStatus === "EVALUATED") {
      items = items.filter((s) => s.is_evaluated);
    } else if (filters.value.evaluationStatus === "NOT_EVALUATED") {
      items = items.filter((s) => !s.is_evaluated);
    }

    // Sort by score
    if (filters.value.score) {
      const s = String(filters.value.score).toLowerCase();
      if (s === "high" || s === "highest") {
        items.sort((a, b) => {
          const valA = a.scoreValue != null ? a.scoreValue : -1;
          const valB = b.scoreValue != null ? b.scoreValue : -1;
          return valB - valA;
        });
      } else if (s === "low" || s === "lowest") {
        items.sort((a, b) => {
          const valA = a.scoreValue != null ? a.scoreValue : 9999;
          const valB = b.scoreValue != null ? b.scoreValue : 9999;
          return valA - valB;
        });
      }
    }

    // Pagination
    const perPage = pagination.value.per_page || 10;
    const totalFiltered = items.length;
    const totalPages = Math.ceil(totalFiltered / perPage) || 1;
    const safePage = Math.min(Math.max(1, page), totalPages);

    pagination.value = {
      current_page: safePage,
      per_page: perPage,
      total: totalFiltered,
      totalPages: totalPages,
    };

    students.value = items.slice((safePage - 1) * perPage, safePage * perPage);
  };

  const getEvaluations = async (page = 1, forceRefresh = false) => {
    loading.value = true;
    error.value = null;
    try {
      if (forceRefresh || allSubmissions.value.length === 0) {
        const [candidates] = await Promise.all([
          fetchAllShortlistCandidates(),
          fetchShortlistStats(),
        ]);
        allSubmissions.value = candidates;
      } else if (!rawDashboardStats.value) {
        await fetchShortlistStats();
      }
      applyFiltersAndPagination(page);
    } catch (err) {
      console.error("Failed to fetch shortlist submissions:", err);
      error.value = err.response?.data?.message || "មិនអាចទាញយកបញ្ជីសិស្សបានទេ";
    } finally {
      loading.value = false;
    }
  };

  const cards = computed(() => [
    {
      title: "សិស្សសរុប",
      value: summaryStats.value.total ?? 0,
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
      getEvaluations(1, true);
    }, 400);
  });

  watch(
    [() => filters.value.skill, () => filters.value.shift],
    () => {
      getEvaluations(1, true);
    }
  );

  watch(
    [() => filters.value.evaluationStatus, () => filters.value.score],
    () => {
      applyFiltersAndPagination(1);
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
    applyFiltersAndPagination,
    fetchShortlistStats,
  };
};
