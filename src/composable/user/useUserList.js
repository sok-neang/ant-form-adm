import { ref, watch } from "vue";
import userService from "@/services/user.service";

export const useUserList = () => {
  const users = ref([]);
  const summaries = ref([]);
  const pagination = ref({});
  const loading = ref(false);
  const isUserStatsLoading = ref(false);
  const error = ref(null);
  const search = ref("");

  const filter = ref({
    role: "",
    status: "",
  });
  
  const getUserSummaries = async () => {
    isUserStatsLoading.value = true;
    error.value = null;
    try {
      const response = await userService.getSummaries();  
      if (response.data?.success) {
        summaries.value = response.data.data; 
      }
      return response.data;
    } catch (err) {
      throw err;
    } finally {
      isUserStatsLoading.value = false;
    }
  };
  const getUsers = async (page = 1) => {
    loading.value = true;
    error.value = null;
    try {
      const params = {
        page,
      };
      if (search.value.trim() !== "") {
        params.search = search.value.trim();
      }
      if (filter.value.role) {
        params.role = filter.value.role;
      }
      if (filter.value.status) {
        params.status = filter.value.status;
      }
      const response = await userService.getAll(params);
      if (response.data?.success) {
        users.value = response.data.data.users;
        // pagination.value = response.data.data.meta;
        
      }
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || "មិនអាចទាញយកទិន្នន័យអ្នកប្រើប្រាស់បានទេ";
      throw err;
    } finally {
      loading.value = false;
    }
  };
  const resetPassword = async (userId) => {
    try {
      const response = await userService.resetPassword(userId);
      return response.data;
    } catch (err) {
      console.error("Reset password error:", err); error.value = err.response?.data?.message || "មិនអាចកំណត់ពាក្យសម្ងាត់ឡើងវិញបានទេ";
      throw err;
    }
  };
 const updateUser = async (id, data) => {
  try {
    const response = await userService.update(id, data);

    return response.data;
  } catch (err) {
    console.error("Update user error:", err);
    error.value =
      err.response?.data?.message ||
      "មិនអាចកែប្រែព័ត៌មានអ្នកប្រើប្រាស់បានទេ";
    throw err;
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
    users,
    summaries,
    pagination,
    loading,
    error,
    search,
    filter,
    getUserSummaries,
    resetPassword,
    updateUser,
    getUsers,
  };
};