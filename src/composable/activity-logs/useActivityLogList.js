import { reactive, ref } from "vue";
import activityLogService from "@/services/activity-log.service";

export const useActivityLogList = () => {
  const tabs = reactive({
    audit: {
      data: [],
      pagination: {},
      loading: false,
      search: "",
      filters: {
        status: "",
      },
    },

    login: {
      data: [],
      pagination: {},
      loading: false,
      search: "",
      filters: {
        status: "",
      },
    },

    restore: {
      data: [],
      pagination: {},
      loading: false,
      search: "",
      filters: {
        status: "",
      },
    },
  });

  const error = ref(null);

  const services = {
    audit: activityLogService.auditLog,
    login: activityLogService.loginHistory,
    restore: activityLogService.auditLogRestore,
  };

const getData = async (type, page = 1) => {
  const tab = tabs[type];
  tab.loading = true;

  try {
    const params = {
      page,
    };

    // Search for current tab
    if (tab.search?.trim()) {
      params.search = tab.search.trim();
    }

    // Status filter
    if (tab.filters.status) {
      params.status = tab.filters.status;
    }

    const response = await services[type](params);

    if (response.data?.success) {
      if (type === "audit") {
        tab.data = response.data.data || [];
        tab.pagination = response.data.meta || {};
      }

      if (type === "login") {
        tab.data = response.data.data?.records || [];
        tab.pagination = response.data.data?.meta || {};
      }

      if (type === "restore") {
        tab.data = response.data.data || [];
        tab.pagination = response.data.meta || {};
      }
    }

    return response.data;
  } finally {
    tab.loading = false;
  }
};

  return {
    tabs,
    error,
    getData,
  };
};