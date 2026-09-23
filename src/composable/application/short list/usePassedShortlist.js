import { ref } from "vue";
import submissionService from "@/services/submission.service";

export function usePassedShortlist() {
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
      MORNING: "ព្រឹក",
      AFTERNOON: "រសៀល",
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
    let introScore = null;
    let cyberScore = null;

    if (Array.isArray(sub.evaluations)) {
      sub.evaluations.forEach((ev) => {
        const subj = (ev.subject || "").toUpperCase();
        const score = parseScore(ev.averageScore) ?? (
          ev.technicalScore != null && ev.attendanceScore != null
            ? (Number(ev.technicalScore) + Number(ev.attendanceScore)) / 2
            : parseScore(ev.technicalScore) ?? parseScore(ev.attendanceScore)
        );

        if (subj.includes("CYBER")) {
          cyberScore = score;
        } else if (subj.includes("INTRO")) {
          introScore = score;
        } else if (subj === "CPP" || subj === "C++" || subj.includes("CPP")) {
          score_technology = score ?? 0;
          cppScore = score;
        } else if (subj === "DART") {
          score_attendance = score ?? 0;
          dartScore = score;
        } else if (subj.includes("HTML") || subj.includes("CSS")) {
          score_attendance = score ?? 0;
          htmlCssScore = score;
        }
      });
    }

    // Specialized subject: C++ for Mobile App, HTML & CSS for Web Dev
    const specializedScore =
      (sub.program === "MOBILE_APP" ? cppScore : htmlCssScore) ??
      cppScore ??
      htmlCssScore ??
      dartScore;

    let overallScore = parseScore(sub.overallAverageScore);
    if (overallScore == null) {
      const activeScores = [introScore, specializedScore, cyberScore].filter((s) => s != null);
      if (activeScores.length > 0) {
        overallScore = activeScores.reduce((acc, v) => acc + v, 0) / activeScores.length;
      }
    }

    const submittedTime = sub.submittedAt ? new Date(sub.submittedAt).getTime() : 0;
    const groupNum = sub.submissionGroup?.groupNumber ?? sub.groupNumber ?? sub.group ?? null;
    const groupText = groupNum ? `ក្រុម ${groupNum}` : "—";

    return {
      id: sub.id,
      name:
        sub.student?.khName ||
        sub.student?.enName ||
        sub.student?.email ||
        "N/A",
      gender: genderMap[sub.student?.gender] || sub.student?.gender || "N/A",
      year: yearMap[sub.yearOfStudy] || sub.yearOfStudy || "N/A",
      group: groupText,
      group_number: groupNum,
      skill: programMap[sub.program] || sub.program || "N/A",
      study_shift: shiftMap[sub.shift] || sub.shift || "N/A",
      score_intro: introScore != null ? parseFloat(introScore).toFixed(2) : "0.00",
      score_specialized: specializedScore != null ? parseFloat(specializedScore).toFixed(2) : "0.00",
      score_cyber: cyberScore != null ? parseFloat(cyberScore).toFixed(2) : "0.00",
      score_technology: score_technology ? parseFloat(score_technology).toFixed(2) : "0.00",
      score_attendance: score_attendance ? parseFloat(score_attendance).toFixed(2) : "0.00",
      total_score: overallScore != null ? overallScore.toFixed(2) : "0.00",
      created_at: sub.submittedAt ? new Date(sub.submittedAt).toLocaleDateString("km-KH") : "N/A",
      _cppScore: cppScore,
      _dartScore: dartScore,
      _htmlCssScore: htmlCssScore,
      _introScore: introScore,
      _specializedScore: specializedScore,
      _cyberScore: cyberScore,
      _totalScore: overallScore,
      _submittedAt: submittedTime,
      raw: sub,
    };
  };

  const sortSubmissions = (items, params) => {
    let list = [...items];

    if (params.group) {
      list = list.filter((item) => {
        return item.group_number ? String(item.group_number) === String(params.group) : true;
      });
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

    // Introduction sorting
    if (params.intro === "lowest" || params.scoreSort === "lowestINTRO" || params.scoreSort === "lowestINTRODUCTION") {
      list.sort((a, b) => {
        if (a._introScore != null && b._introScore != null) return a._introScore - b._introScore;
        if (a._introScore != null) return -1;
        if (b._introScore != null) return 1;
        return 0;
      });
      return list;
    }
    if (params.intro === "highest" || params.scoreSort === "highestINTRO" || params.scoreSort === "highestINTRODUCTION") {
      list.sort((a, b) => {
        if (a._introScore != null && b._introScore != null) return b._introScore - a._introScore;
        if (a._introScore != null) return -1;
        if (b._introScore != null) return 1;
        return 0;
      });
      return list;
    }

    // Cyber sorting
    if (params.cyber === "lowest" || params.scoreSort === "lowestCYBER") {
      list.sort((a, b) => {
        if (a._cyberScore != null && b._cyberScore != null) return a._cyberScore - b._cyberScore;
        if (a._cyberScore != null) return -1;
        if (b._cyberScore != null) return 1;
        return 0;
      });
      return list;
    }
    if (params.cyber === "highest" || params.scoreSort === "highestCYBER") {
      list.sort((a, b) => {
        if (a._cyberScore != null && b._cyberScore != null) return b._cyberScore - a._cyberScore;
        if (a._cyberScore != null) return -1;
        if (b._cyberScore != null) return 1;
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

      const queryParams = {
        page: targetPage,
        limit: perPage,
      };
      if (params.shift) queryParams.shift = params.shift;
      if (params.program) queryParams.program = params.program;
      if (params.group) queryParams.group = params.group;
      if (params.search) queryParams.search = params.search;
      if (params.cpp) queryParams.cpp = params.cpp;
      if (params.html_css) queryParams.html_css = params.html_css;
      if (params.intro_web) queryParams.intro_web = params.intro_web;
      if (params.intro_mobile) queryParams.intro_mobile = params.intro_mobile;
      if (params.intro_cyber) queryParams.intro_cyber = params.intro_cyber;
      if (params.scoreSort && params.scoreSort !== "all") queryParams.scoreSort = params.scoreSort;
      if (params.submittedAt) queryParams.submittedAt = params.submittedAt;

      const response = await submissionService.getPassShortlist(queryParams);
      if (response.data?.success && response.data?.data) {
        const data = response.data.data;
        const rawList = Array.isArray(data)
          ? data
          : Array.isArray(data.submissions)
          ? data.submissions
          : Array.isArray(data.data)
          ? data.data
          : [];
        const meta = data.pagination || data.meta || {};
        const page = meta.page || meta.current_page || targetPage;
        const limit = meta.limit || meta.per_page || perPage;
        const total = meta.total ?? meta.totalSubmissions ?? (Array.isArray(data) ? data.length : rawList.length);
        const totalPages = meta.totalPages || meta.last_page || Math.ceil(total / limit) || 1;
        const startNumber = (page - 1) * limit + 1;

        totalSubmissions.value = total;
        pagination.value = {
          current_page: page,
          per_page: limit,
          total: total,
          last_page: totalPages,
          totalPages: totalPages,
          from: total === 0 ? 0 : startNumber,
          to: Math.min(page * limit, total),
          on_first_page: page === 1,
          has_more_pages: page < totalPages,
        };

        const itemsToDisplay = (!data.pagination && !data.meta && rawList.length > limit)
          ? rawList.slice((page - 1) * limit, page * limit)
          : rawList;

        students.value = itemsToDisplay.map((item, index) => ({
          seq_num: startNumber + index,
          ...transformCandidate(item),
        }));
      }
    } catch (error) {
      console.error("Error fetching passed shortlist submissions:", error);
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
