<template>
  <div v-if="shouldShowPagination"
    class="base-pagination d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
    <!-- Result information -->
    <div class="base-pagination__info text-muted fs-6">
      បង្ហាញពី
      <strong>{{ startItem }}</strong>
      ដល់
      <strong>{{ endItem }}</strong>
      នៃ
      <strong>{{ total }}</strong>
      ទិន្នន័យ
    </div>

    <!-- Pagination -->
    <nav aria-label="Pagination">
      <ul class="pagination mb-0">

        <!-- Previous -->
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <button type="button" class="page-link pagination-button" :disabled="currentPage === 1" aria-label="Previous"
            @click="goToPage(currentPage - 1)">
            <i class="bi bi-chevron-left"></i>
          </button>
        </li>

        <!-- Pages -->
        <li v-for="page in pages" :key="page.key" class="page-item" :class="{
          active: !page.isEllipsis && page.number === currentPage,
          disabled: page.isEllipsis,
        }">
          <!-- Normal page -->
          <button v-if="!page.isEllipsis" type="button" class="page-link pagination-button"
            @click="goToPage(page.number)">
            {{ page.number }}
          </button>

          <!-- Ellipsis -->
          <span v-else class="page-link pagination-button pagination-ellipsis">
            ...
          </span>
        </li>

        <!-- Next -->
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <button type="button" class="page-link pagination-button" :disabled="currentPage === totalPages"
            aria-label="Next" @click="goToPage(currentPage + 1)">
            <i class="bi bi-chevron-right"></i>
          </button>
        </li>

      </ul>
    </nav>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  pagination: {
    type: Object,
    required: true,
  },
});

const currentPage = defineModel("page", {
  type: Number,
  default: 1,
});

/**
 * Total records
 */
const total = computed(() => {
  const val = props.pagination?.total ?? props.pagination?.totalItems ?? props.pagination?.count;
  return val != null && !isNaN(Number(val)) ? Number(val) : 0;
});

/**
 * Items per page
 */
const perPage = computed(() => {
  const val = props.pagination?.per_page ?? props.pagination?.limit ?? props.pagination?.pageSize;
  return val && !isNaN(Number(val)) && Number(val) > 0 ? Number(val) : 10;
});

/**
 * Total pages
 */
const totalPages = computed(() => {
  const val = props.pagination?.totalPages ?? props.pagination?.total_pages ?? props.pagination?.last_page;
  if (val != null && !isNaN(Number(val)) && Number(val) > 0) {
    return Number(val);
  }
  if (total.value > 0 && perPage.value > 0) {
    return Math.max(1, Math.ceil(total.value / perPage.value));
  }
  return 1;
});

/**
 * Whether pagination should be displayed
 */
const shouldShowPagination = computed(() => {
  if (!props.pagination) return false;
  return totalPages.value > 1 || total.value > 0;
});

/**
 * First item number
 */
const startItem = computed(() => {
  if (total.value === 0) {
    return 0;
  }

  return (currentPage.value - 1) * perPage.value + 1;
});

/**
 * Last item number
 */
const endItem = computed(() => {
  const end = currentPage.value * perPage.value;

  return Math.min(end, total.value);
});

/**
 * Go to page
 */
const goToPage = (page) => {
  if (
    page < 1 ||
    page > totalPages.value ||
    page === currentPage.value
  ) {
    return;
  }

  currentPage.value = page;
};

/**
 * Generate pagination pages
 */
const pages = computed(() => {
  const total = totalPages.value;
  const current = currentPage.value;

  const result = [];

  // 1 - 7 pages
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      result.push({
        key: `page-${i}`,
        number: i,
      });
    }

    return result;
  }

  // Near beginning
  if (current <= 4) {
    for (let i = 1; i <= 5; i++) {
      result.push({
        key: `page-${i}`,
        number: i,
      });
    }

    result.push({
      key: "ellipsis-right",
      isEllipsis: true,
    });

    result.push({
      key: `page-${total}`,
      number: total,
    });

    return result;
  }

  // Near end
  if (current >= total - 3) {
    result.push({
      key: "page-1",
      number: 1,
    });

    result.push({
      key: "ellipsis-left",
      isEllipsis: true,
    });

    for (let i = total - 4; i <= total; i++) {
      result.push({
        key: `page-${i}`,
        number: i,
      });
    }

    return result;
  }

  // Middle
  result.push({
    key: "page-1",
    number: 1,
  });

  result.push({
    key: "ellipsis-left",
    isEllipsis: true,
  });

  for (let i = current - 1; i <= current + 1; i++) {
    result.push({
      key: `page-${i}`,
      number: i,
    });
  }

  result.push({
    key: "ellipsis-right",
    isEllipsis: true,
  });

  result.push({
    key: `page-${total}`,
    number: total,
  });

  return result;
});
</script>

<style scoped>
.base-pagination {
  width: 100%;
}

/* Result information */
.base-pagination__info {
  white-space: nowrap;
}

.base-pagination__info strong {
  color: #343a40;
  font-weight: 600;
}

/* Pagination */
.base-pagination .pagination {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* Page button */
.pagination-button {
  width: 36px;
  height: 36px;

  padding: 0 !important;

  display: flex !important;
  align-items: center;
  justify-content: center;

  border-radius: 6px !important;

  border: 1px solid #dee2e6;

  background-color: #fff;

  color: #495057;

  font-size: 14px;
  font-weight: 500;

  box-shadow: none !important;

  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease;
}

/* Hover */
.base-pagination .page-item:not(.active):not(.disabled) .pagination-button:hover {
  background-color: #f1f5f9;
  border-color: #ced4da;
  color: var(--bs-primary);
}

/* Active */
.base-pagination .page-item.active .pagination-button {
  background-color: var(--bs-primary);
  border-color: var(--bs-primary);
  color: #fff;
}

/* Disabled */
.base-pagination .page-item.disabled .pagination-button {
  background-color: #f8f9fa;
  border-color: #e9ecef;
  color: #adb5bd;

  cursor: not-allowed;
}

/* Ellipsis */
.pagination-ellipsis {
  border-color: transparent !important;
  background-color: transparent !important;
  color: #6c757d !important;

  cursor: default;
}

/* Previous / Next icon */
.pagination-button i {
  font-size: 11px;
}

/* Mobile */
@media (max-width: 767.98px) {
  .base-pagination__info {
    white-space: normal;
    text-align: center;
  }

  .base-pagination .pagination {
    justify-content: center;
  }
}
</style>