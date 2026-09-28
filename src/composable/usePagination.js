import { ref } from "vue";

/**
 * Reusable composable for standard table pagination
 * @param {number} defaultPerPage
 */
export function usePagination(defaultPerPage = 10) {
  const pagination = ref({
    current_page: 1,
    per_page: defaultPerPage,
    total: 0,
    last_page: 1,
    totalPages: 1,
    from: 0,
    to: 0,
    on_first_page: true,
    has_more_pages: false,
  });

  /**
   * Updates pagination from backend response meta
   * @param {Object} meta
   * @returns {number} Starting sequence number for this page
   */
  const updatePagination = (meta = {}) => {
    const page = Number(
      meta.page ?? meta.current_page ?? 1
    );

    const limit = Number(
      meta.limit ??
      meta.per_page ??
      pagination.value.per_page ??
      defaultPerPage
    );

    const total = Number(
      meta.totalSubmissions ??
      meta.total ??
      meta.totalItems ??
      meta.count ??
      0
    );

    const calculatedTotalPages =
      limit > 0 ? Math.ceil(total / limit) : 1;

    const totalPages = Number(
      meta.totalPages ??
      meta.total_pages ??
      meta.last_page ??
      calculatedTotalPages
    ) || 1;

    const from = total > 0
      ? (page - 1) * limit + 1
      : 0;

    const to = total > 0
      ? Math.min(page * limit, total)
      : 0;

    pagination.value = {
      current_page: page,
      per_page: limit,
      total,
      last_page: totalPages,
      totalPages,
      from,
      to,
      on_first_page: page === 1,
      has_more_pages: page < totalPages,
    };

    return from;
  };

  const resetPagination = () => {
    pagination.value = {
      current_page: 1,
      per_page: defaultPerPage,
      total: 0,
      last_page: 1,
      totalPages: 1,
      from: 0,
      to: 0,
      on_first_page: true,
      has_more_pages: false,
    };
  };

  return {
    pagination,
    updatePagination,
    resetPagination,
  };
}