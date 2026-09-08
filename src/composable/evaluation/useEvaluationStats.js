import { ref, computed } from "vue";
import dashboardService from "@/services/dashboard.service";

export const useEvaluationStats = () => {
  const stats = ref({
    totalStudents: 0,
    mobileApp: 0,
    webDevelopment: 0,
    specialization: {
      webCount: 0,
      webPercent: 50,
      mobileCount: 0,
      mobilePercent: 50,
    },
    shift: {
      web: { morning: 0, afternoon: 0 },
      mobile: { morning: 0, afternoon: 0 },
    },
  });

  const isStatsLoading = ref(false);
  const statsError = ref(null);

  const getEvaluationStats = async () => {
    isStatsLoading.value = true;
    statsError.value = null;
    try {
      const response = await dashboardService.getStats();
      if (response.data?.success && response.data?.data) {
        const d = response.data.data;
        
        // Show all submissions stats on dashboard
        const source = d.submissions || {};
        const total = source.total ?? d.students?.total ?? 0;
        const web = source.web ?? 0;
        const mobile = source.mobile ?? 0;

        const webPercent = total > 0 ? Math.round((web / total) * 100) : 50;
        const mobilePercent = total > 0 ? 100 - webPercent : 50;

        // Shift data
        const shifts = source.byShift || [];
        const morning = shifts.find((s) => s.shift === "MORNING") || { web: 0, mobile: 0 };
        const afternoon = shifts.find((s) => s.shift === "AFTERNOON") || { web: 0, mobile: 0 };

        stats.value = {
          totalStudents: total,
          mobileApp: mobile,
          webDevelopment: web,
          specialization: {
            webCount: web,
            webPercent,
            mobileCount: mobile,
            mobilePercent,
          },
          shift: {
            web: { morning: morning.web || 0, afternoon: afternoon.web || 0 },
            mobile: { morning: morning.mobile || 0, afternoon: afternoon.mobile || 0 },
          },
        };
      }
      return response.data;
    } catch (err) {
      console.error("Failed to fetch evaluation stats:", err);
      statsError.value =
        err.response?.data?.message || "មិនអាចទាញយកទិន្នន័យស្ថិតិបានទេ";
    } finally {
      isStatsLoading.value = false;
    }
  };

  const dashboardCards = computed(() => [
    {
      kh_title: "សិស្សទាំងអស់",
      en_title: "Total Students",
      value: stats.value.totalStudents,
      icon: "bi bi-people-fill",
      color: "primary",
    },
    {
      kh_title: "កម្មវិធីទូរស័ព្ទ",
      en_title: "Mobile App",
      value: stats.value.mobileApp,
      icon: "bi bi-phone-fill",
      color: "success",
    },
    {
      kh_title: "អភិវឌ្ឍន៍គេហទំព័រ",
      en_title: "Web Development",
      value: stats.value.webDevelopment,
      icon: "bi bi-code-slash",
      color: "warning",
    },
  ]);

  return {
    stats,
    isStatsLoading,
    statsError,
    dashboardCards,
    getEvaluationStats,
  };
};
