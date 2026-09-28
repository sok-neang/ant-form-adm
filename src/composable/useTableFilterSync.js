import { ref, watch, onMounted, isRef } from "vue";
import { useRoute, useRouter } from "vue-router";
export function useTableFilterSync(
  storageKey,
  filterRefs = {},
  options = {}
) {
  const route = useRoute();
  const router = useRouter();

  const sessionKey = `tbl_filter_${storageKey}`;

  const ignoreDefaults = options.ignoreDefaults ?? [
    "",
    "all",
    null,
    undefined,
  ];

  // --------------------------------------------------
  // Session Storage
  // --------------------------------------------------

  const getSavedFilters = () => {
    try {
      const saved = sessionStorage.getItem(sessionKey);

      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  };

  const saveFilters = (data) => {
    try {
      if (!data || Object.keys(data).length === 0) {
        sessionStorage.removeItem(sessionKey);
        return;
      }

      sessionStorage.setItem(
        sessionKey,
        JSON.stringify(data)
      );
    } catch (error) {
      console.warn(
        "Could not save table filters:",
        error
      );
    }
  };

  // --------------------------------------------------
  // Helpers
  // --------------------------------------------------

  const isValidRef = (value) => isRef(value);

  const isSearchFilter = (key) =>
    key === "search" ||
    key.toLowerCase().includes("search");

  const isDefaultValue = (value) =>
    ignoreDefaults.includes(value);

  const getInitialPage = () => {
    const routePage = Number(route.query.page);
    const savedPage = Number(savedFilters.page);

    return routePage || savedPage || 1;
  };

  const savedFilters = getSavedFilters();
  const currentPage = ref(getInitialPage());

  // --------------------------------------------------
  // Restore Filters
  // --------------------------------------------------

  const restoreFilters = () => {
    Object.entries(filterRefs).forEach(([key, filterRef]) => {
      if (!isValidRef(filterRef)) return;

      const queryValue = route.query[key];
      const savedValue = savedFilters[key];

      if (queryValue !== undefined) {
        filterRef.value = queryValue;
      } else if (savedValue !== undefined) {
        filterRef.value = savedValue;
      }
    });
  };

  restoreFilters();

  // --------------------------------------------------
  // Build Query & Storage Data
  // --------------------------------------------------

  const buildFilterState = () => {
    const query = { ...route.query };
    const filtersToSave = {};

    Object.entries(filterRefs).forEach(([key, filterRef]) => {
      if (!isValidRef(filterRef)) return;

      const value = filterRef.value;

      if (isDefaultValue(value)) {
        delete query[key];
        return;
      }

      query[key] = String(value);
      filtersToSave[key] = value;
    });

    return {
      query,
      filtersToSave,
    };
  };

  // --------------------------------------------------
  // Check Query Changes
  // --------------------------------------------------

  const hasQueryChanged = (newQuery) => {
    const currentKeys = Object.keys(route.query).sort();
    const newKeys = Object.keys(newQuery).sort();

    if (currentKeys.length !== newKeys.length) {
      return true;
    }

    return currentKeys.some(
      (key) =>
        String(route.query[key]) !==
        String(newQuery[key])
    );
  };

  // --------------------------------------------------
  // Sync Filters & Pagination
  // --------------------------------------------------

  const updateSync = (page = null) => {
    if (page !== null) {
      currentPage.value = Number(page) || 1;
    }

    const { query, filtersToSave } = buildFilterState();

    // Add pagination to query/storage
    if (currentPage.value > 1) {
      query.page = String(currentPage.value);
      filtersToSave.page = currentPage.value;
    } else {
      delete query.page;
    }

    saveFilters(filtersToSave);

    if (hasQueryChanged(query)) {
      router.replace({ query }).catch(() => {});
    }
  };

  // --------------------------------------------------
  // Pagination
  // --------------------------------------------------

  const syncPage = (page) => {
    updateSync(page);
  };

  // --------------------------------------------------
  // Reset Filters
  // --------------------------------------------------

  const resetFilters = () => {
    Object.entries(filterRefs).forEach(([key, filterRef]) => {
      if (!isValidRef(filterRef)) return;

      if (
        key === "scoreLevel" ||
        key === "resultStatus"
      ) {
        filterRef.value = "all";
      } else {
        filterRef.value = "";
      }
    });

    updateSync(1);
  };

  // --------------------------------------------------
  // Watch Filters
  // --------------------------------------------------

  let searchTimeout = null;

  Object.entries(filterRefs).forEach(([key, filterRef]) => {
    if (!isValidRef(filterRef)) return;

    watch(filterRef, () => {
      // Search → debounce
      if (isSearchFilter(key)) {
        clearTimeout(searchTimeout);

        searchTimeout = setTimeout(() => {
          updateSync(1);
        }, 300);

        return;
      }

      // Other filters → update immediately
      updateSync(1);
    });
  });

  // --------------------------------------------------
  // Initial Sync
  // --------------------------------------------------

  onMounted(() => {
    updateSync();
  });

  return {
    getInitialPage: () => currentPage.value,
    syncPage,
    updateSync,
    resetFilters,
  };
}