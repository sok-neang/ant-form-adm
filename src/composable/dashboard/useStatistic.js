import {ref} from "vue";
import dashboardService from "@/services/dashboard.service";

export function useStatistic() {

    const loading = ref(false);
    const statsData = ref(null);

    const getStatsUser = async () => {
        try {
            loading.value = true;
            const response = await dashboardService.getStats();
            statsData.value = response.data.data;
        } catch (error) {
            console.error("Error fetching user statistics:", error);
        } finally {
            loading.value = false;
        }
    }

  return {
    loading,
    statsData,
    getStatsUser,
  };
}