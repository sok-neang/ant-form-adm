<template>
  <div class="container-fluid student-list-container pt-0 px-0">
    <!-- TOP SUMMARY CARDS (3 CARDS) -->
    <div class="row g-3 mb-4">
      <div v-for="card in cards" :key="card.title" class="col-md-4">
        <div class="stat-card py-3 px-4 rounded-4 bg-white d-flex align-items-center gap-3 shadow-sm h-100">
          <div class="stat-icon-box rounded-4 d-flex align-items-center justify-content-center"
            :class="`stat-icon-${card.color}`">
            <i :class="card.icon" class="fs-4"></i>
          </div>
          <div class="d-flex flex-column">
            <h2 class="stat-value fw-bold mb-1" :class="`text-${card.color}`">
              {{ card.value }}
            </h2>
            <span class="stat-title text-muted fw-semibold">{{ card.title }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- SEARCH & FILTER ROW (SINGLE ROW) -->
    <div class="filter-row d-flex align-items-center justify-content-between gap-3 mb-4 position-relative">
      <!-- Search Input -->
      <div class="search-pill-box d-flex align-items-center px-3 py-2 rounded-pill bg-white flex-shrink-0">
        <i class="bi bi-search text-muted me-2"></i>
        <input v-model="search" type="text" class="form-control border-0 bg-transparent shadow-none p-0"
          placeholder="Search" />
      </div>

      <!-- BaseSelect Filters (Strictly 1 Row) -->
      <div class="filter-selects-container d-flex align-items-center gap-2 flex-nowrap flex-shrink-0">
        <!-- Subject Filter -->
        <BaseSelect v-model="filters.subject" :options="subjectOptions" option-label="label" option-value="value"
          placeholder="ជ្រើសរើសមុខវិជ្ជា" :clearable="false" style="width: 140px;" @change="() => getEvaluations(1)" />

        <!-- Specialization Filter -->
        <BaseSelect v-model="filters.skill" :options="specializationOptions" option-label="label" option-value="value"
          placeholder="ជ្រើសរើសជំនាញ" :clearable="false" style="width: 175px;" @change="() => getEvaluations(1)" />

        <!-- Score Filter -->
        <BaseSelect v-model="filters.score" :options="scoreLevelOptions" option-label="label" option-value="value"
          placeholder="ជ្រើសរើសពិន្ទុ" :clearable="false" style="width: 155px;" @change="() => getEvaluations(1)" />

        <!-- Shift Filter -->
        <BaseSelect v-model="filters.shift" :options="shiftOptions" option-label="label" option-value="value"
          placeholder="ជ្រើសរើសវេន" :clearable="false" style="width: 140px;" @change="() => getEvaluations(1)" />
      </div>
    </div>

    <!-- TABLE CONTAINER -->
    <div class="card border-0 rounded-4 shadow-sm overflow-hidden mb-4 position-relative" style="z-index: 1;">
      <div class="table-responsive">
        <table class="table align-middle custom-student-table mb-0">
          <thead>
            <tr>
              <th class="text-center" style="width: 60px;">#</th>
              <th>ឈ្មោះសិស្ស</th>
              <th>ភេទ</th>
              <th>ជំនាញ</th>
              <th>វេនសិក្សា</th>
              <th>ស្ថានភាពមុខវិជ្ជា</th>
              <th class="text-center">ពិន្ទុសរុប</th>
              <th class="text-center" style="width: 110px;">ការកំណត់</th>
            </tr>
          </thead>

          <tbody v-if="loading">
            <tr v-for="n in 6" :key="n">
              <td colspan="8" class="p-3">
                <BaseSkeleton width="100%" height="24px" radius="6px" />
              </td>
            </tr>
          </tbody>

          <tbody v-else-if="students.length === 0">
            <tr>
              <td colspan="8" class="text-center py-5 text-muted">
                <i class="bi bi-inbox fs-1 d-block mb-2"></i>
                មិនមានទិន្នន័យសិស្សទេ
              </td>
            </tr>
          </tbody>

          <tbody v-else>
            <tr v-for="(student, index) in students" :key="student.id">
              <!-- ID -->
              <td class="text-center fw-semibold text-muted">
                {{ ((pagination.current_page - 1) * pagination.per_page) + index + 1 }}
              </td>

              <!-- Name -->
              <td class="fw-semibold text-dark">
                {{ student.name }}
              </td>

              <!-- Gender -->
              <td class="text-secondary">
                {{ student.gender }}
              </td>

              <!-- Specialization -->
              <td>
                <span class="badge-pill px-3 py-1 rounded-pill fw-medium"
                  :class="student.skill === 'Web Development' ? 'badge-web' : 'badge-mobile'">
                  {{ student.skill }}
                </span>
              </td>

              <!-- Study Shift -->
              <td class="text-secondary">
                {{ student.study_shift }}
              </td>

              <!-- Subject Status Badges -->
              <td>
                <div class="d-flex align-items-center gap-2 flex-wrap">
                  <span v-for="sub in student.subjects" :key="sub.name"
                    class="subject-badge px-3 py-1 rounded-pill d-inline-flex align-items-center gap-1"
                    :class="sub.evaluated ? `subject-badge-${sub.color}` : 'subject-badge-pending'">
                    <!-- Evaluated Checkmark -->
                    <span v-if="sub.evaluated" class="badge-icon">✓</span>
                    <!-- Pending Circle -->
                    <span v-else class="badge-icon badge-icon-circle">○</span>
                    <span>{{ sub.name }}</span>
                  </span>
                </div>
              </td>

              <!-- Total Score -->
              <td class="text-center fw-bold" :class="student.total_score === 'N/A' ? 'text-muted' : 'text-score'">
                {{ student.total_score }}
              </td>

              <!-- Actions -->
              <td class="text-center">
                <div class="d-flex align-items-center justify-content-center gap-2">
                  <!-- View Button -->
                  <button type="button" class="btn btn-action-outline" title="មើលលម្អិត" @click="handleView(student)">
                    <i class="bi bi-eye"></i>
                  </button>

                  <!-- Edit / Evaluate Button -->
                  <button v-if="student.is_evaluated" type="button" class="btn btn-action-outline"
                    title="កែប្រែការវាយតម្លៃ" @click="handleEdit(student)">
                    <i class="bi bi-pencil-square"></i>
                  </button>

                  <!-- Add / Pending Button -->
                  <button v-else type="button" class="btn btn-action-outline" title="វាយតម្លៃសិស្ស"
                    @click="handleAdd(student)">
                    <i class="bi bi-plus-lg"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- PAGINATION (CENTER ALIGNED) -->
    <div v-if="pagination.totalPages > 1" class="d-flex justify-content-center align-items-center gap-2 mt-4">
      <button type="button" class="pagination-btn pagination-arrow" :disabled="pagination.current_page === 1"
        @click="handlePageChange(pagination.current_page - 1)">
        <i class="bi bi-chevron-left"></i>
      </button>

      <button v-for="page in visiblePages" :key="page" type="button" class="pagination-btn"
        :class="{ active: pagination.current_page === page }" @click="handlePageChange(page)">
        {{ page }}
      </button>

      <button type="button" class="pagination-btn pagination-arrow"
        :disabled="pagination.current_page === pagination.totalPages"
        @click="handlePageChange(pagination.current_page + 1)">
        <i class="bi bi-chevron-right"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import BaseSkeleton from "@/components/ui/base/BaseSkeleton.vue";
import BaseSelect from "@/components/ui/base/BaseSelect.vue";
import {
  subjectOptions,
  specializationOptions,
  scoreLevelOptions,
  shiftOptions,
} from "@/constants/options";
import { useEvaluationList } from "@/composable/evaluation/useEvaluationList";

const router = useRouter();
const { students, loading, search, filters, pagination, cards, getEvaluations, fetchShortlistStats } = useEvaluationList();

const visiblePages = computed(() => {
  const current = pagination.value.current_page || 1;
  const total = pagination.value.totalPages || 1;
  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, current - Math.floor(maxVisible / 2));
  let end = Math.min(total, start + maxVisible - 1);
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});

const handlePageChange = (page) => {
  if (page >= 1 && page <= pagination.value.totalPages) {
    getEvaluations(page);
  }
};

const handleView = (student) => {
  const id = student.submissionId || student.id;
  router.push({ name: "student-detail", params: { submissionId: id } });
};

const handleEdit = (student) => {
  const id = student.submissionId || student.id;
  router.push({ name: "student-evaluation", params: { submissionId: id } });
};

const handleAdd = (student) => {
  const id = student.submissionId || student.id;
  router.push({ name: "student-evaluation", params: { submissionId: id } });
};

onMounted(() => {
  getEvaluations();
  fetchShortlistStats();
});
</script>

<style scoped>
.student-list-container {
  margin-top: -12px;
}

/* TOP STAT CARDS */
.stat-card {
  border: 1px solid #f1f5f9;
  transition: all 0.2s ease;
}

.stat-icon-box {
  width: 52px;
  height: 52px;
}

.stat-icon-primary {
  background-color: #e0f2fe;
  color: #0284c7;
}

.stat-icon-success {
  background-color: #dcfce7;
  color: #16a34a;
}

.stat-icon-warning {
  background-color: #fef3c7;
  color: #d97706;
}

.stat-value {
  font-size: 1.85rem;
  line-height: 1;
}

.stat-title {
  font-size: 0.95rem;
}

/* SEARCH & FILTER */
.filter-row {
  position: relative;
  z-index: 30;
  overflow: visible !important;
}

.filter-selects-container {
  overflow: visible !important;
}

/* GREEN FILTER DROPDOWNS */
.filter-selects-container :deep(.base-select) {
  --bs-border: #2e7d6b;
  --bs-focus: #2e7d6b;
  --bs-focus-ring: rgba(46, 125, 107, 0.15);
  --bs-icon: #2e7d6b;
  --bs-radius: 10px;
}

.filter-selects-container :deep(.base-select__group) {
  border: 1.5px solid #2e7d6b !important;
  border-radius: 10px !important;
  background-color: #ffffff;
  height: 42px;
  transition: all 0.2s ease;
}

.filter-selects-container :deep(.base-select__chevron) {
  color: #2e7d6b !important;
}

.filter-selects-container :deep(.base-select__chevron svg) {
  stroke-width: 2.2;
}

.filter-selects-container :deep(.ts-control) {
  min-height: 40px !important;
  height: 40px !important;
  padding: 0 28px 0 12px !important;
  color: #1f2430;
  font-size: 0.9rem;
  font-weight: 500;
}

.filter-selects-container :deep(.base-select.is-focused .base-select__group),
.filter-selects-container :deep(.base-select.is-open .base-select__group) {
  border-color: #2e7d6b !important;
  box-shadow: 0 0 0 3px rgba(46, 125, 107, 0.15) !important;
}

.filter-selects-container :deep(.base-select.has-value .base-select__group) {
  background-color: #e8f5f1 !important;
  border-color: #2e7d6b !important;
}

.filter-selects-container :deep(.base-select.has-value .ts-control .item) {
  color: #2e7d6b !important;
  font-weight: 600;
}

.filter-selects-container :deep(.ts-dropdown) {
  border: 1.5px solid #2e7d6b !important;
  border-radius: 10px !important;
  box-shadow: 0 10px 25px rgba(46, 125, 107, 0.12) !important;
}

.filter-selects-container :deep(.ts-dropdown .option.active),
.filter-selects-container :deep(.ts-dropdown .option:hover) {
  background-color: #e8f5f1 !important;
  color: #2e7d6b !important;
  font-weight: 600;
}

.search-pill-box {
  border: 1.5px solid #2e7d6b;
  min-width: 260px;
  max-width: 320px;
  height: 42px;
}

/* TABLE STYLING */
.custom-student-table {
  border-collapse: separate;
  border-spacing: 0;
}

.custom-student-table thead {
  background-color: #2e7d6b !important;
}

.custom-student-table thead th {
  background-color: #2e7d6b !important;
  color: #ffffff !important;
  font-weight: 600;
  font-size: 0.95rem;
  padding: 14px 16px;
  border: none;
  white-space: nowrap;
}

.custom-student-table tbody td {
  padding: 14px 16px;
  border-bottom: 1px solid #f1f5f9;
  font-size: 0.95rem;
}

.custom-student-table tbody tr:hover td {
  background-color: #f8fafc;
}

/* SPECIALIZATION BADGES */
.badge-pill {
  font-size: 0.85rem;
  display: inline-block;
}

.badge-web {
  background-color: #ecfdf5;
  color: #059669;
}

.badge-mobile {
  background-color: #fff7ed;
  color: #d97706;
}

/* SUBJECT STATUS BADGES */
.subject-badge {
  font-size: 0.8rem;
  font-weight: 500;
  border: 1px solid transparent;
  background-color: #f8fafc;
}

.subject-badge-green {
  border-color: #bbf7d0;
  background-color: #f0fdf4;
  color: #16a34a;
}

.subject-badge-blue {
  border-color: #bfdbfe;
  background-color: #eff6ff;
  color: #2563eb;
}

.subject-badge-orange {
  border-color: #fed7aa;
  background-color: #fff7ed;
  color: #d97706;
}

.subject-badge-pending {
  border-color: #e2e8f0;
  background-color: #f8fafc;
  color: #94a3b8;
}

.badge-icon {
  font-size: 0.8rem;
  font-weight: bold;
}

.badge-icon-circle {
  font-size: 0.75rem;
}

.text-score {
  color: #d97706;
  font-size: 1.05rem;
}

/* ACTION BUTTONS */
.btn-action-outline {
  width: 34px;
  height: 34px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid #2e7d6b;
  border-radius: 8px;
  background-color: #ffffff;
  color: #2e7d6b;
  font-size: 0.95rem;
  transition: all 0.2s ease;
}

.btn-action-outline:hover {
  border-color: #2e7d6b;
  color: #2e7d6b;
  background-color: #e8f5f1;
  transform: translateY(-1px);
}

/* PAGINATION */
.pagination-btn {
  min-width: 36px;
  height: 36px;
  padding: 0 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 8px;
  background-color: #f1f5f9;
  color: #475569;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.pagination-btn.active {
  background-color: #2e7d6b;
  color: #ffffff;
}

.pagination-btn:hover:not(.active):not(:disabled) {
  background-color: #e2e8f0;
}

.pagination-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.pagination-arrow {
  background-color: transparent;
  color: #64748b;
}
</style>
