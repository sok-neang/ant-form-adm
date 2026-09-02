<template>
  <div v-if="pagination && pagination.totalPages > 1"
    class="base-pagination d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
    <!-- Result information -->
    <div class="base-pagination__info text-muted fs-6">
      បង្ហាញពី
      <strong>{{ startItem }}</strong>
      ដល់
      <strong>{{ endItem }}</strong>
      នៃ
      <strong>{{ pagination.total }}</strong>
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
 * Total pages
 *
 * Backend:
 * totalPages
 */
const totalPages = computed(() => {
  return Number(props.pagination.totalPages || 1);
});

/**
 * First item number
 */
const startItem = computed(() => {
  if (!props.pagination.total) {
    return 0;
  }

  return (currentPage.value - 1) * props.pagination.per_page + 1;
});

/**
 * Last item number
 */
const endItem = computed(() => {
  const end =
    currentPage.value * props.pagination.per_page;

  return Math.min(end, props.pagination.total);
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