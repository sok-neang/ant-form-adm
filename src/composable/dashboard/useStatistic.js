import {ref} from "vue";
import dashboardService from "@/services/dashboard.service";

export function useStatistic() {

    const loading = ref(false);
    const statsData = ref(null);

    const getStatsUser = async () => {
        try {
            loading.value = true;
            const response = await dashboardService.getStats();
            if (response.data?.success) {
                statsData.value = response.data.data;
            }
            console.log(response);
            
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