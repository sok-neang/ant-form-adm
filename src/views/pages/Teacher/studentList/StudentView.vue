<template>
  <div class="container-fluid student-list-container pt-0 px-0">
    <!-- TOP SUMMARY CARDS (3 CARDS) -->
    <div class="row g-3 mb-4">
      <div v-for="card in cards" :key="card.title" class="col-md-4">
        <div class="stat-card py-3 px-4 rounded-4 bg-white d-flex align-items-center gap-3 h-100">
          <div class="stat-icon-box rounded-4 d-flex align-items-center justify-content-center"
            :class="`stat-icon-${card.color}`">
            <i :class="card.icon" class="fs-4"></i>
          </div>
          <div class="d-flex flex-column">
            <BaseSkeleton v-if="statsLoading" width="60px" height="32px" class="mb-1" />
            <h2 v-else class="stat-value fw-bold mb-1" :class="`text-${card.color}`">
              {{ card.value }}
            </h2>
            <span class="stat-title text-muted fw-semibold">{{ card.title }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- BASE TABLE LIKE SHORTLIST -->
    <BaseTable
      :columns="columns"
      :rows="students"
      :pagination="pagination"
      :loading="loading"
      :show-actions="true"
      @page-change="handlePageChange"
    >
      <template #search-filter>
        <!-- Search Input -->
        <div class="position-relative search-box">
          <BaseInput 
            v-model="searchQuery" 
            type="text" 
            placeholder="ស្វែងរក..." 
            input-class="p-0"
          >
            <i class="bi bi-search search-icon"></i>
          </BaseInput>
        </div>

        <!-- Filters / Dropdown -->
        <div class="d-flex align-items-center gap-2 flex-wrap">
          <BaseSelect
            v-model="selectedEvaluationStatus"
            :options="evaluationStatusOptions"
            option-label="label"
            option-value="value"
            placeholder="ជ្រើសរើសស្ថានភាព"
            :clearable="false"
            style="width: 175px;"
          />
          <BaseSelect
            v-model="selectedScoreLevel"
            :options="scoreLevelOptions"
            option-label="label"
            option-value="value"
            placeholder="ជ្រើសរើសកម្រិតពិន្ទុ"
            :clearable="false"
            style="width: 200px;"
          />
          <BaseSelect
            v-model="selectedShift"
            :options="shiftOptions"
            option-label="label"
            option-value="value"
            placeholder="ជ្រើសរើសពេល"
            :clearable="false"
            style="width: 140px;"
          />
          <BaseSelect
            v-model="selectedSpecialization"
            :options="specializationOptions"
            option-label="label"
            option-value="value"
            placeholder="ជ្រើសរើសមុខជំនាញ"
            :clearable="false"
            style="width: 175px;"
          />
        </div>
      </template>

      <!-- Skill Column -->
      <template #cell-skill="{ row }">
        <span
          class="badge rounded-pill px-3 py-2"
          :style="{
            color: row.skill === 'Web Development' ? '#0d6efd' : '#f59e0b',
            backgroundColor:
              row.skill === 'Web Development'
                ? 'rgba(13, 110, 253, 0.12)'
                : 'rgba(245, 158, 11, 0.12)',
          }"
        >
          {{ row.skill }}
        </span>
      </template>

      <!-- INTRODUCTION Score Column -->
      <template #cell-score_intro="{ row }">
        <span
          class="badge rounded-pill px-3 py-2"
          :class="
            row.score_intro < 50
              ? 'score-fail'
              : row.score_intro < 70
              ? 'score-medium'
              : 'score-good'
          "
        >
          {{ row.score_intro }}
        </span>
      </template>

      <!-- C++/HTML Score Column -->
      <template #cell-score_specialized="{ row }">
        <span
          class="badge rounded-pill px-3 py-2"
          :class="
            row.score_specialized < 50
              ? 'score-fail'
              : row.score_specialized < 70
              ? 'score-medium'
              : 'score-good'
          "
        >
          {{ row.score_specialized }}
        </span>
      </template>

      <!-- CYBER Score Column -->
      <template #cell-score_cyber="{ row }">
        <span
          class="badge rounded-pill px-3 py-2"
          :class="
            row.score_cyber < 50
              ? 'score-fail'
              : row.score_cyber < 70
              ? 'score-medium'
              : 'score-good'
          "
        >
          {{ row.score_cyber }}
        </span>
      </template>

      <!-- Total Score Column -->
      <template #cell-total_score="{ row }">
        <span
          class="badge rounded-pill px-3 py-2 fw-bold"
          :class="
            row.total_score < 50
              ? 'score-fail'
              : row.total_score < 70
              ? 'score-medium'
              : 'score-good'
          "
        >
          {{ row.total_score }}
        </span>
      </template>

      <!-- Actions Column -->
      <template #actions="{ row }">
        <div class="d-flex justify-content-start align-items-center gap-2">
          <!-- View Button -->
          <button
            type="button"
            class="btn btn-action-outline action-btn action-view"
            title="មើលលម្អិត"
            @click="handleView(row)"
          >
            <i class="bi bi-eye"></i>
          </button>

          <!-- Evaluate Button -->
          <button
            type="button"
            class="btn btn-action-outline action-btn"
            :title="row.is_evaluated ? 'កែប្រែការវាយតម្លៃ' : 'វាយតម្លៃសិស្ស'"
            @click="handleEvaluate(row)"
          >
            <i :class="row.is_evaluated ? 'bi bi-pencil-square text-primary' : 'bi bi-plus-lg text-primary'"></i>
          </button>
        </div>
      </template>
    </BaseTable>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import BaseTable from "@/components/ui/base/BaseTable.vue";
import BaseInput from "@/components/ui/base/BaseInput.vue";
import BaseSelect from "@/components/ui/base/BaseSelect.vue";
import BaseButton from "@/components/ui/base/BaseButton.vue";
import BaseSkeleton from "@/components/ui/base/BaseSkeleton.vue";
import {
  shiftOptions,
  specializationOptions,
  scoreLevelOptions,
  evaluationStatusOptions,
} from "@/constants/options";
import { useShortlist } from "@/composable/application/short list/useShortlist";
import dashboardService from "@/services/dashboard.service";

const router = useRouter();

// Filters
const selectedScoreLevel = ref("all");
const selectedShift = ref("");
const selectedSpecialization = ref("");
const selectedEvaluationStatus = ref("");
const searchQuery = ref("");

// Stats State for Top Cards
const statsLoading = ref(true);
const summaryStats = ref({ total: 0, evaluated: 0, pending: 0 });

const cards = computed(() => [
  {
    title: "សិស្សសរុប",
    value: summaryStats.value.total ?? 0,
    icon: "bi bi-people",
    color: "primary",
  },
  {
    title: "បានវាយតម្លៃ",
    value: summaryStats.value.evaluated ?? 0,
    icon: "bi bi-check-circle",
    color: "success",
  },
  {
    title: "មិនទាន់បានវាយតម្លៃ",
    value: summaryStats.value.pending ?? 0,
    icon: "bi bi-hourglass-split",
    color: "warning",
  },
]);

const fetchStats = async () => {
  statsLoading.value = true;
  try {
    const res = await dashboardService.getStats();
    if (res.data?.success && res.data?.data?.shortlistEvaluation) {
      const s = res.data.data.shortlistEvaluation;
      summaryStats.value = {
        total: s.total ?? 0,
        evaluated: s.evaluated ?? 0,
        pending: s.pending ?? 0,
      };
    }
  } catch (err) {
    console.warn("Could not fetch shortlist evaluation stats:", err);
  } finally {
    statsLoading.value = false;
  }
};

const {
  loading,
  students,
  pagination,
  fetchSubmissions,
} = useShortlist();

const columns = [
  { key: "seq_num", label: "#" },
  { key: "name", label: "ឈ្មោះសិស្ស" },
  { key: "gender", label: "ភេទ" },
  { key: "year", label: "និស្សិតឆ្នាំ" },
  { key: "skill", label: "ជំនាញ" },
  { key: "study_shift", label: "វេនសិក្សា" },
  { key: "score_intro", label: "INTRODUCTION" },
  { key: "score_specialized", label: "C++/HTML" },
  { key: "score_cyber", label: "CYBER" },
  { key: "total_score", label: "ពិន្ទុមធ្យម" },
];

const loadSubmissions = async (page = 1) => {
  const params = {
    page,
    limit: pagination.value.per_page || 10,
  };

  if (selectedShift.value) params.shift = selectedShift.value;
  if (selectedSpecialization.value) params.program = selectedSpecialization.value;
  if (selectedEvaluationStatus.value) params.evaluationStatus = selectedEvaluationStatus.value;

  if (selectedScoreLevel.value) {
    const val = selectedScoreLevel.value;
    if (val === "highest" || val === "HIGH") {
      params.scoreSort = "highest";
    } else if (val === "lowest" || val === "LOW") {
      params.scoreSort = "lowest";
    } else if (val === "highestCPP") {
      params.cpp = "highest";
      params.scoreSort = "highestCPP";
    } else if (val === "lowestCPP") {
      params.cpp = "lowest";
      params.scoreSort = "lowestCPP";
    } else if (val === "highestDART") {
      params.dart = "highest";
      params.scoreSort = "highestDART";
    } else if (val === "lowestDART") {
      params.dart = "lowest";
      params.scoreSort = "lowestDART";
    } else if (val === "highestHTML_CSS") {
      params.html_css = "highest";
      params.scoreSort = "highestHTML_CSS";
    } else if (val === "lowestHTML_CSS") {
      params.html_css = "lowest";
      params.scoreSort = "lowestHTML_CSS";
    } else if (val === "all" || val === "ALL") {
      params.scoreSort = "all";
    } else {
      params.scoreSort = val;
    }
  }

  if (searchQuery.value) params.search = searchQuery.value;

  await fetchSubmissions(params);
};

const handlePageChange = (page) => {
  loadSubmissions(page);
};

const handleView = (row) => {
  router.push({ name: "student-detail", params: { submissionId: row.id } });
};

const handleEvaluate = (row) => {
  router.push({ name: "student-evaluation", params: { submissionId: row.id } });
};

let searchTimeout;
watch(searchQuery, () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    loadSubmissions(1);
  }, 500);
});

watch([selectedShift, selectedSpecialization, selectedScoreLevel, selectedEvaluationStatus], () => {
  loadSubmissions(1);
});

onMounted(() => {
  loadSubmissions();
  fetchStats();
});
</script>

<style scoped>
.student-list-container {
  margin-top: -12px;
}

/* TOP STAT CARDS */
.stat-card {
  border: 1px solid var(--bs-primary);
  transition: all 0.2s ease;
}

.stat-icon-box {
  width: 54px;
  height: 54px;
  flex-shrink: 0;
}

.stat-icon-primary {
  background-color: rgba(38, 98, 217, 0.12);
  color: var(--bs-primary, #2662d9);
}

.stat-icon-success {
  background-color: rgba(25, 135, 84, 0.12);
  color: #198754;
}

.stat-icon-warning {
  background-color: rgba(255, 179, 31, 0.12);
  color: #ffb31f;
}

.stat-value {
  font-size: 1.75rem;
  line-height: 1.2;
}

/* SCORE BADGES */
.score-fail {
  color: #e53e3e !important;
  background-color: rgba(229, 62, 62, 0.12) !important;
}

.score-medium {
  color: #ffb31f !important;
  background-color: rgba(255, 179, 31, 0.12) !important;
}

.score-good {
  color: var(--bs-primary, #2662d9) !important;
  background-color: rgba(38, 98, 217, 0.12) !important;
}

/* ACTION BUTTONS */
.action-btn {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e2e8f0;
  background-color: #fff;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background-color: #f8fafc;
  border-color: #cbd5e1;
}

.action-view {
  color: #3b82f6;
}
</style>
