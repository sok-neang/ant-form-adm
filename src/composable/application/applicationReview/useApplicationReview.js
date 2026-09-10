import { ref } from "vue";
import submissionService from "@/services/submission.service";
import { useRoute, useRouter } from "vue-router";
import { useAppToast } from "@/composable/useAppToast";

export function useApplicationReview() {
  const route = useRoute();
  const router = useRouter();
  const toast = useAppToast();
  const application = ref(null);
  const loading = ref(true);
  const isUpdating = ref(false);

  const fetchApplication = async () => {
    const id = route.params.id;
    if (!id) return;
    
    loading.value = true;
    try {
      const response = await submissionService.getById(id);
      console.log("Submission API response:", response.data);
      if (response.data?.success) {
        application.value = response.data.data || response.data.submission;
      } else {
        application.value = response.data;
      }
      console.log("Mapped application data:", application.value);
    } catch (error) {
      console.error("Error fetching application details:", error);
    } finally {
      loading.value = false;
    }
  };

  const promoteStatus = async (status, payload = {}) => {
    const id = route.params.id;
    if (!id) return;

    isUpdating.value = true;
    try {
      const response = await submissionService.promoteStatus(id, { status, ...payload });
      if (response.data?.success) {
        toast.success("ស្ថានភាពត្រូវបានកែប្រែដោយជោគជ័យ");
        router.back();
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(error.response?.data?.message || "មានបញ្ហាក្នុងការកែប្រែស្ថានភាព");
    } finally {
      isUpdating.value = false;
    }
  };

  return {
    application,
    loading,
    isUpdating,
    fetchApplication,
    promoteStatus,
  };
}
