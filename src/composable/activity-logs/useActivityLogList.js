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

    if (!tab || !services[type]) {
      return;
    }

    tab.loading = true;
    error.value = null;

    try {
      const params = {
        page,
      };

      // Search
      if (tab.search?.trim()) {
        params.search = tab.search.trim();
      }

      // Status filter
      if (tab.filters.status) {
        params.status = tab.filters.status;

        // Audit uses action instead of status
        if (type === "audit") {
          params.action = tab.filters.status;
        }
      }

      const response = await services[type](params);

      if (response.data?.success) {
        const rawData = response.data.data;
        let rawMeta = null;

        if (type === "audit") {
          tab.data = Array.isArray(rawData) ? rawData : (rawData?.records || rawData?.logs || rawData?.data || []);
          rawMeta = response.data.meta || response.data.pagination || (rawData && !Array.isArray(rawData) ? (rawData.meta || rawData.pagination) : null) || {};
        } else if (type === "login") {
          tab.data = rawData?.records || (Array.isArray(rawData) ? rawData : []);
          rawMeta = rawData?.meta || response.data.meta || response.data.pagination || {};
        } else if (type === "restore") {
          tab.data = Array.isArray(rawData) ? rawData : (rawData?.records || rawData?.logs || rawData?.data || []);
          rawMeta = response.data.meta || response.data.pagination || (rawData && !Array.isArray(rawData) ? (rawData.meta || rawData.pagination) : null) || {};
        }

        const limit = Number(rawMeta.limit || rawMeta.per_page || 10);
        const pageNum = Number(rawMeta.page || rawMeta.current_page || params.page || 1);
        const total = Number(rawMeta.total ?? rawMeta.totalItems ?? rawMeta.count ?? (Array.isArray(tab.data) ? tab.data.length : 0));
        const totalPages = Number(rawMeta.totalPages || rawMeta.total_pages || rawMeta.last_page || Math.max(1, Math.ceil(total / limit)));

        tab.pagination = {
          ...rawMeta,
          current_page: pageNum,
          page: pageNum,
          per_page: limit,
          limit: limit,
          total: total,
          totalItems: total,
          totalPages: totalPages,
          last_page: totalPages,
          from: total === 0 ? 0 : (pageNum - 1) * limit + 1,
          to: Math.min(pageNum * limit, total),
        };
      }

      return response.data;
    } catch (err) {
      error.value = err;
      console.error("Failed to get activity logs:", err);
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