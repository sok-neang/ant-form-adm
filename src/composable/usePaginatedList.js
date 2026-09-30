import { ref } from "vue";
import { usePagination } from "@/composable/usePagination";

/**
 * Filter out empty, 'all', null, and undefined values from query params
 */
export function cleanQueryParams(params = {}, ignore = ["", "all", null, undefined]) {
  const query = {};
  for (const [key, val] of Object.entries(params)) {
    if (!ignore.includes(val)) {
      query[key] = val;
    }
  }
  return query;
}

/**
 * Higher-level composable to encapsulate standard paginated API list fetches.
 *
 * @param {Object} options
 * @param {(params: Object) => Promise<any>} options.fetchService 
 * @param {(rawItem: any, seqNum: number) => any} [options.transformItem] 
 * @param {Object} [options.defaultParams] 
 * @param {number} [options.defaultPerPage] 
 */
export function usePaginatedList({
  fetchService,
  transformItem,
  defaultParams = {},
  defaultPerPage = 10,
}) {
  const items = ref([]);
  const loading = ref(false);
  const total = ref(0);
  const { pagination, updatePagination, resetPagination } = usePagination(defaultPerPage);

  const fetchList = async (params = {}) => {
    loading.value = true;
    try {
      const mergedParams = cleanQueryParams({
        ...defaultParams,
        ...params,
      });

      const response = await fetchService(mergedParams);
      if (response?.data?.success) {
        const data = response.data.data;
        const meta = data?.pagination || data?.meta || {};
        const rawList = Array.isArray(data)
          ? data
          : Array.isArray(data?.submissions)
          ? data.submissions
          : Array.isArray(data?.data)
          ? data.data
          : [];

        if (!meta.total && !meta.totalSubmissions && rawList.length) {
          meta.total = rawList.length;
        }

        const startNumber = updatePagination(meta);
        total.value = pagination.value.total;

        const limit = pagination.value.per_page;
        const page = pagination.value.current_page;
        const itemsToDisplay =
          !data?.pagination && !data?.meta && rawList.length > limit
            ? rawList.slice((page - 1) * limit, page * limit)
            : rawList;

        items.value = transformItem
          ? itemsToDisplay.map((item, index) => transformItem(item, startNumber + index))
          : itemsToDisplay;

        return response;
      }
    } catch (error) {
      console.error("usePaginatedList fetch error:", error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  return {
    items,
    students: items, 
    loading,
    total,
    totalSubmissions: total, 
    pagination,
    updatePagination,
    resetPagination,
    fetchList,
    fetchSubmissions: fetchList, 
  };
}
