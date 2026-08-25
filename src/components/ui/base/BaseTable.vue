<template>
    <!-- BLOCK 1: SEARCH + FILTER -->
<div class="card-header border-0 py-4">
 <div class="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
    <slot name="search-filter"></slot>
 </div>
</div>
  <div class="card shadow-sm rounded-3 overflow-hidden">
      <div class="table-responsive ">
        <table class="table  align-middle">
          <!-- TABLE HEADER -->
          <thead class="bg-primary">
            <tr>
              <!-- Dynamic Columns -->
              <th
                v-for="column in columns"
                :key="column.key"
                :class="column.class"
              >
                {{ column.label }}
              </th>
              <!-- Actions -->
              <th
                v-if="showActions"
                class="text-start"
              >
                សកម្មភាព
              </th>

            </tr>
          </thead>
          <!-- LOADING -->
          <tbody v-if="loading">
            <tr
              v-for="n in skeletonRows"
              :key="n"
            >
              <td v-if="isSelectable">
                <div class="skeleton skeleton-checkbox"></div>
              </td>

              <td
                v-for="column in columns"
                :key="column.key"
              >
                <div class="skeleton skeleton-text"></div>
              </td>

              <td v-if="showActions">
                <div class="skeleton skeleton-action"></div>
              </td>

            </tr>

          </tbody>


          <!-- EMPTY -->
          <tbody v-else-if="rows.length === 0">

            <tr>
              <td
                :colspan="columnSpan"
                class="empty-state"
              >

                <div class="py-10 text-center">

                  <div class="empty-icon mb-4">
                    <i class="bi bi-search"></i>
                  </div>

                  <h5 class="fw-bold mb-2">
                    មិនមានទិន្នន័យ
                  </h5>

                  <p class="text-muted mb-0">
                    មិនអាចរកឃើញទិន្នន័យដែលអ្នកកំពុងស្វែងរកទេ។
                  </p>

                </div>

              </td>
            </tr>

          </tbody>


          <!-- DATA -->
          <tbody v-else>

            <tr
              v-for="row in rows"
              :key="row[rowKey]"
            >

              <!-- Dynamic Columns -->
               <!-- {{ columns }} -->
              <td
                v-for="column in columns"
                :key="column.key"
              >
                <slot
                  :name="`cell-${column.key}`"
                  :row="row"
                >
                  {{ row[column.key] }}
                </slot>
              </td>
              <!-- Actions -->
              <td class="text-start" v-if="showActions">
                <slot name="actions" :row="row"></slot>
              </td>

            </tr>

          </tbody>

        </table>


    </div>


    <!-- =====================================================
         BLOCK 3: PAGINATION
    ====================================================== -->
    <div class="card-footer border-0 py-3">
      
      <!-- Pagination -->
      <BasePagination
      v-if="pagination"
      v-model:page="currentPage"
      :pagination="pagination"
    />

    </div>

  </div>
</template>
<script setup>
import { computed, ref, watch } from "vue";
import BasePagination from "./BasePagination.vue";
const props = defineProps({
  rows: {
    type: Array,
    default: () => [],
  },

  columns: {
    type: Array,
    default: () => [],
  },

  rowKey: {
    type: String,
    default: "id",
  },

  isSelectable: {
    type: Boolean,
    default: false,
  },

  showActions: {
    type: Boolean,
    default: true,
  },

  loading: {
    type: Boolean,
    default: false,
  },

  skeletonRows: {
    type: Number,
    default: 10,
  },
  pagination: {
    type: Object,
    default: null,
  },
});

const search = ref("");
const selectedFilter = ref("");

const columnSpan = computed(() => {
  return (
    props.columns.length +
    (props.isSelectable ? 1 : 0) +
    (props.showActions ? 1 : 0)
  );
});
const emit = defineEmits([
  "page-change",
]);

const currentPage = ref(
  props.pagination?.current_page ?? 1
);

/**
 * When parent changes pagination
 * after API request, update current page.
 */
watch(
  () => props.pagination?.current_page,
  (page) => {
    if (page) {
      currentPage.value = page;
    }
  }
);

/**
 * When user clicks another page
 */
watch(
  currentPage,
  (page, oldPage) => {
    if (page === oldPage) return;

    emit("page-change", page);
  }
);
</script>



<style scoped>

/* =========================================================
   SEARCH
========================================================= */



.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--bs-gray-500);
  z-index: 2;
}

.form-control-solid,
.form-select-solid {
  background-color: #f8f9fa;
  border-color: #f8f9fa;
}

.form-control-solid:focus,
.form-select-solid:focus {
  background-color: #ffffff;
  border-color: var(--bs-primary);
  box-shadow: none;
}


/* =========================================================
   TABLE
========================================================= */

.table {
  margin-bottom: 0;
}

.table thead th {
  color: var(--bs-gray-600);
  font-size: 16px;
  font-weight: 700;
  white-space: nowrap;
  padding: 14px 16px;
  border-bottom: 1px solid #e9ecef;
}

.table tbody td {
  color: var(--bs-gray-700);
  font-size: 16px;
  font-weight: 500;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.table tbody tr:last-child td {
  border-bottom: 0;
}
.table thead.bg-primary {
  background-color: var(--bs-primary) !important;
}

.table thead.bg-primary th {
  background-color: var(--bs-primary) !important;
  color: #fff !important;
}


/* =========================================================
   EMPTY
========================================================= */

.empty-state {
  border: 0 !important;
}

.empty-icon {
  width: 65px;
  height: 65px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;

  background: rgba(var(--bs-primary-rgb), 0.08);
  color: var(--bs-primary);

  border-radius: 50%;
  font-size: 25px;
}


/* =========================================================
   SKELETON
========================================================= */

.skeleton {
  background: #e9ecef;
  border-radius: 6px;
  animation: skeleton-loading 1.2s infinite ease-in-out;
}

.skeleton-text {
  width: 80%;
  height: 18px;
}

.skeleton-checkbox {
  width: 18px;
  height: 18px;
}

.skeleton-action {
  width: 45px;
  height: 30px;
  margin-left: auto;
}

@keyframes skeleton-loading {
  0% {
    opacity: 0.5;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0.5;
  }
}


/* =========================================================
   PAGINATION
========================================================= */

.page-link {
  border: 0;
  color: var(--bs-gray-600);
  min-width: 36px;
  height: 36px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 7px !important;
  margin: 0 2px;
}

.page-link:hover {
  color: var(--bs-primary);
  background: rgba(var(--bs-primary-rgb), 0.08);
}

.page-item.active .page-link {
  background: var(--bs-primary);
  color: #ffffff;
}

.page-item.disabled .page-link {
  background: #f8f9fa;
  color: var(--bs-gray-400);
}


/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 767.98px) {

  .search-box {
    width: 100%;
  }

  .card-header {
    padding: 16px !important;
  }

  .card-body {
    padding: 10px !important;
  }

  .card-footer {
    padding: 16px !important;
  }

}
</style>