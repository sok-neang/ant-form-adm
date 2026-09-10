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
    on_first_page: true,
    has_more_pages: false,
  });

  const fetchSubmissions = async (params = {}) => {
    loading.value = true;
    try {
      const response = await submissionService.getPassShortlist(params);
      if (response.data?.success) {
        const data = response.data.data;

        // Update Pagination first to calculate sequence numbers
        const meta = data.pagination || {};
        const page = meta.page || 1;
        const limit = meta.limit || meta.per_page || 10;
        const startNumber = (page - 1) * limit + 1;

        if (data.pagination) {
          totalSubmissions.value = meta.totalSubmissions || meta.total || 0;
          pagination.value = {
            current_page: meta.page,
            per_page: limit,
            total: meta.total,
            last_page: meta.totalPages,
            totalPages: meta.totalPages,
            from: (meta.page - 1) * limit + 1,
            to: Math.min(meta.page * limit, meta.total),
            on_first_page: meta.page === 1,
            has_more_pages: meta.page < meta.totalPages,
          };
        }

        // Map API data to table rows
        students.value = (data.submissions || data.data || []).map((sub, index) => {
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

          if (Array.isArray(sub.evaluations)) {
            sub.evaluations.forEach((ev) => {
              if (ev.subject === "CPP") {
                score_technology = ev.averageScore || 0;
              }
              if (ev.subject === "DART" || ev.subject === "HTML_CSS") {
                score_attendance = ev.averageScore || 0;
              }
            });
          }

          return {
            seq_num: startNumber + index,
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
            score_technology: score_technology ? parseFloat(score_technology).toFixed(2) : "0.00",
            score_attendance: score_attendance ? parseFloat(score_attendance).toFixed(2) : "0.00",
            total_score: sub.overallAverageScore ? parseFloat(sub.overallAverageScore).toFixed(2) : "0.00",
            created_at: new Date(sub.createdAt).toLocaleDateString("km-KH"),
          };
        });
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
