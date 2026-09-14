import { ref } from "vue";
import submissionService from "@/services/submission.service";

export function useFinalResult() {
  const students = ref([]);
  const loading = ref(false);
  const totalSubmissions = ref(0);
  const pagination = ref({
    current_page: 1,
    first_item: 1,
    last_item: 10,
    from: 1,
    to: 10,
    per_page: 10,
    total: 0,
    last_page: 1,
    totalPages: 1,
    on_first_page: true,
    has_more_pages: false,
  });

  // Cached all transformed candidates for client-side pagination & global sorting
  let cachedSubmissions = [];
  let lastFilterKey = null;

  const parseScore = (val) => {
    if (val === null || val === undefined || val === "") return null;
    const num = parseFloat(val);
    return isNaN(num) ? null : num;
  };

  const transformCandidate = (sub) => {
    const programMap = {
      WEB_DEVELOPMENT: "Web Development",
      MOBILE_APP: "Mobile App",
    };
    const shiftMap = {
      MORNING: "វេនព្រឹក",
      AFTERNOON: "វេនរសៀល",
    };
    const genderMap = {
      MALE: "ប្រុស",
      FEMALE: "ស្រី",
    };
    const yearMap = {
      YEAR_1: "ឆ្នាំទី 1",
      YEAR_2: "ឆ្នាំទី 2",
      YEAR_3: "ឆ្នាំទី 3",
      YEAR_4: "ឆ្នាំទី 4",
      YEAR_5: "ឆ្នាំទី 5",
    };

    let score_technology = 0; // C++
    let score_attendance = 0; // HTML / Dart
    let cppScore = null;
    let dartScore = null;
    let htmlCssScore = null;

    if (Array.isArray(sub.evaluations)) {
      sub.evaluations.forEach((ev) => {
        const subj = (ev.subject || "").toUpperCase();
        const score = parseScore(ev.averageScore);
        if (subj === "CPP" || subj === "C++") {
          score_technology = score ?? 0;
          cppScore = score;
        }
        if (subj === "DART") {
          score_attendance = score ?? 0;
          dartScore = score;
        }
        if (subj === "HTML_CSS" || subj === "HTML" || subj === "HTML&CSS" || subj === "HTML_AND_CSS") {
          score_attendance = score ?? 0;
          htmlCssScore = score;
        }
      });
    }

    const overallScore = parseScore(sub.overallAverageScore);
    const submittedTime = sub.submittedAt ? new Date(sub.submittedAt).getTime() : 0;

    return {
      id: sub.id,
      name:
        sub.student?.khName ||
        sub.student?.enName ||
        sub.student?.email ||
        "N/A",
      gender: genderMap[sub.student?.gender] || sub.student?.gender || "N/A",
      year: yearMap[sub.yearOfStudy] || sub.yearOfStudy || "N/A",
      skill: programMap[sub.program] || sub.program || "N/A",
      study_shift: shiftMap[sub.shift] || sub.shift || "N/A",
      status: sub.status,
      score_technology: score_technology ? parseFloat(score_technology).toFixed(2) : "0.00",
      score_attendance: score_attendance ? parseFloat(score_attendance).toFixed(2) : "0.00",
      total_score: overallScore != null ? overallScore.toFixed(2) : "0.00",
      created_at: sub.submittedAt ? new Date(sub.submittedAt).toLocaleDateString("km-KH") : "N/A",
      is_evaluated: Boolean(sub.isEvaluated) || (Array.isArray(sub.evaluations) && sub.evaluations.length >= 2),
      _cppScore: cppScore,
      _dartScore: dartScore,
      _htmlCssScore: htmlCssScore,
      _totalScore: overallScore,
      _submittedAt: submittedTime,
      raw: sub,
    };
  };

  const sortSubmissions = (items, params) => {
    let list = [...items];

    // Status filtering
    if (params.status && params.status !== "all") {
      const targetStatus = params.status.toUpperCase();
      list = list.filter((item) => (item.status || item.raw?.status || "").toUpperCase() === targetStatus);
    }

    // Client search filtering if needed
    if (params.search) {
      const q = params.search.toLowerCase().trim();
      list = list.filter(
        (item) =>
          (item.name && item.name.toLowerCase().includes(q)) ||
          (item.skill && item.skill.toLowerCase().includes(q)) ||
          (item.study_shift && item.study_shift.toLowerCase().includes(q))
      );
    }

    // Dart sorting
    if (params.dart === "lowest" || params.scoreSort === "lowestDART") {
      list.sort((a, b) => {
        if (a._dartScore != null && b._dartScore != null) return a._dartScore - b._dartScore;
        if (a._dartScore != null) return -1;
        if (b._dartScore != null) return 1;
        return 0;
      });
      return list;
    }
    if (params.dart === "highest" || params.scoreSort === "highestDART") {
      list.sort((a, b) => {
        if (a._dartScore != null && b._dartScore != null) return b._dartScore - a._dartScore;
        if (a._dartScore != null) return -1;
        if (b._dartScore != null) return 1;
        return 0;
      });
      return list;
    }

    // C++ sorting
    if (params.cpp === "lowest" || params.scoreSort === "lowestCPP") {
      list.sort((a, b) => {
        if (a._cppScore != null && b._cppScore != null) return a._cppScore - b._cppScore;
        if (a._cppScore != null) return -1;
        if (b._cppScore != null) return 1;
        return 0;
      });
      return list;
    }
    if (params.cpp === "highest" || params.scoreSort === "highestCPP") {
      list.sort((a, b) => {
        if (a._cppScore != null && b._cppScore != null) return b._cppScore - a._cppScore;
        if (a._cppScore != null) return -1;
        if (b._cppScore != null) return 1;
        return 0;
      });
      return list;
    }

    // HTML & CSS sorting
    if (params.html_css === "lowest" || params.scoreSort === "lowestHTML_CSS") {
      list.sort((a, b) => {
        if (a._htmlCssScore != null && b._htmlCssScore != null) return a._htmlCssScore - b._htmlCssScore;
        if (a._htmlCssScore != null) return -1;
        if (b._htmlCssScore != null) return 1;
        return 0;
      });
      return list;
    }
    if (params.html_css === "highest" || params.scoreSort === "highestHTML_CSS") {
      list.sort((a, b) => {
        if (a._htmlCssScore != null && b._htmlCssScore != null) return b._htmlCssScore - a._htmlCssScore;
        if (a._htmlCssScore != null) return -1;
        if (b._htmlCssScore != null) return 1;
        return 0;
      });
      return list;
    }

    // Overall score sorting
    if (params.scoreSort === "lowest" || params.scoreSort === "LOW") {
      list.sort((a, b) => {
        if (a._totalScore != null && b._totalScore != null) return a._totalScore - b._totalScore;
        if (a._totalScore != null) return -1;
        if (b._totalScore != null) return 1;
        return 0;
      });
      return list;
    }
    if (params.scoreSort === "highest" || params.scoreSort === "HIGH") {
      list.sort((a, b) => {
        if (a._totalScore != null && b._totalScore != null) return b._totalScore - a._totalScore;
        if (a._totalScore != null) return -1;
        if (b._totalScore != null) return 1;
        return 0;
      });
      return list;
    }

    // Date sorting
    if (params.submittedAt === "oldest") {
      list.sort((a, b) => (a._submittedAt || 0) - (b._submittedAt || 0));
      return list;
    }
    if (params.submittedAt === "newest") {
      list.sort((a, b) => (b._submittedAt || 0) - (a._submittedAt || 0));
      return list;
    }

    return list;
  };

  const applyPagination = (sortedList, targetPage, perPage) => {
    const totalCount = sortedList.length;
    const totalPages = Math.ceil(totalCount / perPage) || 1;
    const safePage = Math.min(Math.max(1, targetPage), totalPages);
    const from = totalCount === 0 ? 0 : (safePage - 1) * perPage + 1;
    const to = Math.min(safePage * perPage, totalCount);

    totalSubmissions.value = totalCount;
    pagination.value = {
      current_page: safePage,
      per_page: perPage,
      total: totalCount,
      last_page: totalPages,
      totalPages: totalPages,
      from: from,
      to: to,
      first_item: from,
      last_item: to,
      on_first_page: safePage === 1,
      has_more_pages: safePage < totalPages,
    };

    const slice = sortedList.slice((safePage - 1) * perPage, safePage * perPage);
    students.value = slice.map((item, index) => ({
      ...item,
      seq_num: (safePage - 1) * perPage + index + 1,
    }));
  };

  const fetchSubmissions = async (params = {}) => {
    loading.value = true;
    try {
      const targetPage = Number(params.page) || 1;
      const perPage = Number(params.limit) || 10;

      // Unique key for the active filters and sorting
      const filterKey = JSON.stringify({
        shift: params.shift || "",
        program: params.program || "",
        status: params.status || "",
        search: (params.search || "").trim(),
        scoreSort: params.scoreSort || "",
        dart: params.dart || "",
        cpp: params.cpp || "",
        html_css: params.html_css || "",
        submittedAt: params.submittedAt || "",
      });

      // If filters haven't changed and cached data is available, slice directly
      if (filterKey === lastFilterKey && cachedSubmissions.length > 0 && !params.forceRefresh) {
        applyPagination(cachedSubmissions, targetPage, perPage);
        return;
      }

      // Fetch all candidate records for current filter to sort globally across all data
      const queryParams = {
        page: 1,
        limit: 100,
      };
      if (params.shift) queryParams.shift = params.shift;
      if (params.program) queryParams.program = params.program;
      if (params.status && params.status !== "all") queryParams.status = params.status;
      if (params.search) queryParams.search = params.search;

      const response = await submissionService.getAllFinalResult(queryParams);
      let rawList = [];
      let totalItems = 0;

      if (response.data?.success && response.data?.data) {
        const data = response.data.data;
        rawList = Array.isArray(data)
          ? [...data]
          : [...(data.submissions || data.data || [])];
        const meta = data.pagination;
        totalItems = meta?.total ?? meta?.totalSubmissions ?? rawList.length;

        // If more than 100 items, fetch subsequent pages to ensure all records are present
        if (totalItems > 100) {
          const totalPages = Math.ceil(totalItems / 100);
          const extraPromises = [];
          for (let p = 2; p <= totalPages; p++) {
            extraPromises.push(
              submissionService.getAllFinalResult({ ...queryParams, page: p, limit: 100 })
            );
          }
          const extraResponses = await Promise.all(extraPromises);
          for (const res of extraResponses) {
            if (res.data?.success && res.data?.data) {
              const extraData = res.data.data;
              const extraList = Array.isArray(extraData)
                ? extraData
                : (extraData.submissions || extraData.data || []);
              rawList.push(...extraList);
            }
          }
        }
      }

      // Deduplicate by ID
      const seen = new Set();
      const uniqueRaw = [];
      for (const item of rawList) {
        if (!item?.id || !seen.has(item.id)) {
          if (item?.id) seen.add(item.id);
          uniqueRaw.push(item);
        }
      }

      // Transform all items
      const transformed = uniqueRaw.map(transformCandidate);

      // Apply global sorting across ALL data
      const sorted = sortSubmissions(transformed, params);

      // Cache and paginate
      cachedSubmissions = sorted;
      lastFilterKey = filterKey;

      applyPagination(sorted, targetPage, perPage);
    } catch (error) {
      console.error("Error fetching final results:", error);
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    students,
    totalSubmissions,
    pagination,
    fetchSubmissions,
  };
}
