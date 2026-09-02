import { ref, watch } from "vue";
import activityLogService from "@/services/activity-log.service";

export const useActivityLogList = () => {
  const auditLog = ref([]);
  const loginHistory= ref([]);
  const auditLogRestore = ref([]);
  const pagination = ref({});
  const loading = ref(false);
  const error = ref(null);
  const search = ref("");

  const filter = ref({
    role: "",
    status: "",
  });

  const getAuditLog = async (page = 1) => {
    loading.value = true;
    error.value = null;
    try {
      const params = {
        page,
      };
      const response = await activityLogService.auditLog(params);
      if (response.data?.success) {
        auditLog.value = response.data.data;
        pagination.value = response.data.data.meta;
        
      }
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || "មិនអាចទាញយកទិន្នន័យបានទេ";
      throw err;
    } finally {
      loading.value = false;
    }
  };
  const getLoginHistory = async (page = 1) => {
    loading.value = true;
    error.value = null;
    try {
      const params = {
        page,
      };
      const response = await activityLogService.loginHistory(params);
      if (response.data?.success) {
        loginHistory.value = response.data.data.records;
        pagination.value = response.data.data.meta;
        console.log(pagination.value);
        
      }
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || "មិនអាចទាញយកទិន្នន័យបានទេ";
      throw err;
    } finally {
      loading.value = false;
    }
  };
    const getAuditLogRestore = async (page = 1) => {
    loading.value = true;
    error.value = null;
    try {
      const params = {
        page,
      };
      const response = await activityLogService.auditLogRestore(params);
      if (response.data?.success) {
        auditLogRestore.value = response.data.data;
        console.log(response.data.data);
        // pagination.value = response.data.data.meta;
        
      }
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || "មិនអាចទាញយកទិន្នន័យបានទេ";
      throw err;
    } finally {
      loading.value = false;
    }
  };


  let searchTimeout;
  watch(search, () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      getUsers(1);
    }, 500);
  });
  watch(
    () => [filter.value.role, filter.value.status],
    () => {
      getUsers(1);
    }
  );

  return {
    auditLog,
    loginHistory,
    auditLogRestore,
    pagination,
    loading,
    error,
    search,
    filter,

    getAuditLog,
    getLoginHistory,
    getAuditLogRestore
  };
};