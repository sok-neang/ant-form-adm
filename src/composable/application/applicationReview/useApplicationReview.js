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

  const fetchApplication = async (customId = null) => {
    const id = customId || route.params.id || route.params.submissionId;
    if (!id) return;
    
    loading.value = true;
    try {
      const response = await submissionService.getById(id);
      let appData = response.data?.success
        ? (response.data.data || response.data.submission)
        : (response.data?.data || response.data);

      if (appData && appData.files && Array.isArray(appData.files)) {
        appData.files = appData.files.map((file) => {
          let fileUrl = file.fileUrl;
          if (!fileUrl && file.filePath) {
            fileUrl = file.filePath.startsWith("http")
              ? file.filePath
              : `https://ant-form-backend.g2.ant.com.kh/${file.filePath.replace(/^\/+/, "")}`;
          }
          return {
            ...file,
            fileUrl: fileUrl || file.filePath || "",
          };
        });
      }

      if (appData) {
        const rawStatus = String(appData.status || "").toUpperCase();
        const isBlacklist = ["BLACKLIST", "BLACKLISTED"].includes(rawStatus) || Boolean(appData.blacklistReason || appData.blacklistedAt || appData.blacklist);
        const isDropout = ["DROPOUT", "DROP_OUT"].includes(rawStatus) || Boolean(appData.dropoutReason || appData.droppedOutAt || appData.dropout);

        if (isBlacklist || isDropout) {
          application.value = null;
          return;
        }
      }

      application.value = appData;
    } catch (error) {
      console.error("Error fetching application details:", error);
      application.value = null;
    } finally {
      loading.value = false;
    }
  };

  const promoteStatus = async (status, payload = {}) => {
    const id = route.params.id || route.params.submissionId;
    if (!id) return;

    isUpdating.value = true;
    try {
      const response = await submissionService.promoteStatus(id, { status, ...payload });
      if (response.data?.success || response.status === 200) {
        toast.success("ស្ថានភាពត្រូវបានកែប្រែដោយជោគជ័យ");
        router.back();
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(error.response?.data?.message);
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
