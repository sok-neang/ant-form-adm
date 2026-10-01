import { ref, watch, onMounted, isRef } from "vue";
import { useRoute, useRouter, onBeforeRouteLeave } from "vue-router";

// Predefined detail routes matching each table storage key
const DETAIL_ROUTES_MAP = {
  all_application: ["/application-review", "application-review"],
  passed_application: ["/application-review", "application-review"],
  failed_application: ["/application-review", "application-review"],
  contacted_application: ["/application-review", "application-review"],
  shortlist_all: ["/shortlist-detail", "shortlist-detail"],
  shortlist_passed: ["/shortlist-detail", "shortlist-detail"],
  shortlist_failed: ["/shortlist-detail", "shortlist-detail"],
  final_results_all: ["/final-result-detail", "final-result-detail"],
  final_results_passed: ["/final-result-detail", "final-result-detail"],
  final_results_reserved: ["/final-result-detail", "final-result-detail"],
  blacklist: ["/blacklist-detail", "blacklist-detail"],
  dropout: ["/dropout-detail", "dropout-detail"],
  teacher_student_list: [
    "/student-lists/detail",
    "/student-lists/evaluation",
    "student-detail",
    "student-evaluation",
  ],
};

const isDetailTarget = (target, storageKey, customDetailRoutes) => {
  if (!target) return false;

  const targetPath =
    typeof target === "string" ? target : target.path || "";
  const targetName =
    typeof target === "object" ? String(target.name || "") : "";

  if (!targetPath && !targetName) return false;

  // 1. Custom detail routes passed via options
  if (customDetailRoutes) {
    if (typeof customDetailRoutes === "function") {
      return customDetailRoutes(target);
    }
    const routes = Array.isArray(customDetailRoutes)
      ? customDetailRoutes
      : [customDetailRoutes];
    if (routes.some((r) => targetPath.startsWith(r) || targetName === r)) {
      return true;
    }
  }

  // 2. Predefined routes from map
  const mapped = DETAIL_ROUTES_MAP[storageKey];
  if (mapped && mapped.some((r) => targetPath.startsWith(r) || targetName === r)) {
    return true;
  }

  // 3. Fallback heuristic: check if target is a detail/review/evaluation view
  const lowerPath = targetPath.toLowerCase();
  const lowerName = targetName.toLowerCase();
  return (
    lowerPath.includes("detail") ||
    lowerPath.includes("review") ||
    lowerPath.includes("evaluation") ||
    lowerName.includes("detail") ||
    lowerName.includes("review") ||
    lowerName.includes("evaluation")
  );
};

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
  // Navigation Source Tracking
  // --------------------------------------------------

  const getPreviousRoute = () => {
    try {
      const fromPath = sessionStorage.getItem("last_nav_path");
      const fromName = sessionStorage.getItem("last_nav_name");
      return { path: fromPath || "", name: fromName || "" };
    } catch {
      return null;
    }
  };

  const isComingFromDetail = () => {
    const prevRoute = getPreviousRoute();
    if (!prevRoute || !prevRoute.path) return true;
    // Same page reload / query change
    if (prevRoute.path === route.path) return true;

    return isDetailTarget(prevRoute, storageKey, options.detailRoutes);
  };

  const isFromDetail = isComingFromDetail();

  // --------------------------------------------------
  // Session Storage
  // --------------------------------------------------

  const getSavedFilters = () => {
    if (!isFromDetail) {
      try {
        sessionStorage.removeItem(sessionKey);
      } catch {}
      return {};
    }

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
  // Route Leave Guard: Clear when navigating to other page
  // --------------------------------------------------

  try {
    onBeforeRouteLeave((to) => {
      const isGoingToDetail = isDetailTarget(
        to,
        storageKey,
        options.detailRoutes
      );
      if (!isGoingToDetail) {
        try {
          sessionStorage.removeItem(sessionKey);
        } catch {}
      }
    });
  } catch (err) {
    // Safe fallback if called outside route component context
  }

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
    if (!isFromDetail) {
      return 1;
    }

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

      if (!isFromDetail) {
        if (key === "scoreLevel" || key === "resultStatus") {
          filterRef.value = "all";
        } else {
          filterRef.value = "";
        }
        return;
      }

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