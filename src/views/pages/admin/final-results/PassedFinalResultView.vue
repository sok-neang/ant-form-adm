<template>
  <div class="container-fluid">
    <BaseTable
    :columns="columns"
    :rows="students"
    :pagination="pagination"
    :total-student="total_student"
    :loading="loading"
    :show-actions="true"
    @page-change="handlePageChange"
    >
    <template #search-filter>
        <div class="position-relative search-box">
          <BaseInput 
            v-model="searchQuery" 
            type="text" 
            placeholder="ស្វែងរកតាមឈ្មោះ, អ៊ីម៉ែល..." 
            input-class="p-0"
          >
            <i class="bi bi-search search-icon"></i>
          </BaseInput>
        </div>
        <!-- Filters / Dropdown -->
        <div class="d-flex align-items-center gap-2">
            <BaseSelect
                v-model="selectedScoreLevel"
                :options="scoreLevelOptions"
                option-label="label"
                option-value="value"
                placeholder="ជ្រើសរើសកម្រិតពិន្ទុ"
                :clearable="false"
                style="width: 220px"
            />
           <BaseSelect
                v-model="selectedShift"
                :options="shiftOptions"
                option-label="label"
                option-value="value"
                placeholder="ជ្រើសរើសពេល"
                :clearable="false"
                style="width: 150px"
            />
          <BaseSelect
                v-model="selectedSpecialization"
                :options="specializationOptions"
                option-label="label"
                option-value="value"
                placeholder="ជ្រើសរើសមុខជំនាញ"
                :clearable="false"
                style="width: 190px"
            />
          <BaseButton
            type="button"
            variant=""
            custom-class="bg-primary text-light"
            @click="isExportModalOpen = true"
          >
            ទាញយក
            <template #icon>
              <i class="bi bi-download"></i>            
            </template>
          </BaseButton>
        </div>
    </template>
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

    <!-- Total score  -->
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
    <template #actions="{ row }">
    <div class="d-flex justify-content-start align-items-center gap-2">
        <!-- VIEW -->
          <button
            type="button"
            class="btn btn-action-outline action-btn action-view"
            title="មើលលម្អិត"
            @click="handleView(row)"
          >
            <i class="bi bi-eye"></i>
          </button>
    </div>
    </template>
    </BaseTable>

    <!-- Export Modal -->
    <ExportModal
      v-model:is-open="isExportModalOpen"
      export-type="final"
      :initial-program="selectedSpecialization"
      :initial-shift="selectedShift"
      initial-status="final"
      :total-count="totalSubmissions || 0"
    />
  </div>
</template>
<script setup>
import { ref, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import BaseTable from "@/components/ui/base/BaseTable.vue";
import BaseInput from "@/components/ui/base/BaseInput.vue";
import BaseSelect from "@/components/ui/base/BaseSelect.vue";
import BaseButton from "@/components/ui/base/BaseButton.vue";
import ExportModal from "@/components/ui/ExportModal.vue";
import {shiftOptions, specializationOptions, scoreLevelOptions} from "@/constants/options"
import { usePassedFinalResult } from "@/composable/application/final result/usePassedFinalResult";
import { useStatistic } from "@/composable/dashboard/useStatistic";
const router = useRouter();
const statistic = useStatistic();
const total_student = ref(0);
onMounted(async() => {
  await statistic.getStatsUser();
  total_student.value = (statistic.statsData.value.evaluation.passed.total + statistic.statsData.value.reserved.total);
})
const selectedScoreLevel = ref("all");
const selectedShift = ref("");
const selectedSpecialization = ref("");
const searchQuery = ref("");
const showCreateModal = ref(false);
const isExportModalOpen = ref(false);

const {
  loading,
  students,
  totalSubmissions,
  pagination,
  fetchSubmissions,
} = usePassedFinalResult();

const handleView = (row) => {
  router.push({ path: `/final-result-detail/${row.id}`, query: { from: "passed" } });
};

const columns = [
  { key: "seq_num", label: "#" },
  { key: "name", label: "ឈ្មោះសិស្ស" },
  { key: "gender", label: "ភេទ" },
  { key: "year", label: "និស្សិតឆ្នាំ" },
  { key: "skill", label: "ជំនាញ" },
  { key: "study_shift", label: "វេនសិក្សា" },
  { key: "score_intro", label: "INTRO" },
  { key: "score_specialized", label: "C++/HTML" },
  { key: "score_cyber", label: "CYBER" },
  { key: "total_score", label: "ពិន្ទុមធ្យម" },
];

const loadSubmissions = async (page = 1) => {
  const params = {
    page,
    limit: pagination.value.per_page,
  };
  
  if (selectedShift.value) params.shift = selectedShift.value;
  if (selectedSpecialization.value) params.program = selectedSpecialization.value;
  if (selectedScoreLevel.value && selectedScoreLevel.value !== "all") {
    const val = selectedScoreLevel.value;
    if (val === "highest" || val === "HIGH") {
      params.scoreSort = "highest";
    } else if (val === "lowest" || val === "LOW") {
      params.scoreSort = "lowest";
    } else if (val === "highestCPP" || val === "cpp_highest") {
      params.cpp = "highest";
    } else if (val === "lowestCPP" || val === "cpp_lowest") {
      params.cpp = "lowest";
    } else if (val === "highestHTML_CSS" || val === "html_css_highest") {
      params.html_css = "highest";
    } else if (val === "lowestHTML_CSS" || val === "html_css_lowest") {
      params.html_css = "lowest";
    } else if (val === "highestINTRO_WEB" || val === "intro_web_highest") {
      params.intro_web = "highest";
    } else if (val === "lowestINTRO_WEB" || val === "intro_web_lowest") {
      params.intro_web = "lowest";
    } else if (val === "highestINTRO_MOBILE" || val === "intro_mobile_highest") {
      params.intro_mobile = "highest";
    } else if (val === "lowestINTRO_MOBILE" || val === "intro_mobile_lowest") {
      params.intro_mobile = "lowest";
    } else if (val === "highestINTRO_CYBER" || val === "intro_cyber_highest" || val === "highestCYBER") {
      params.intro_cyber = "highest";
    } else if (val === "lowestINTRO_CYBER" || val === "intro_cyber_lowest" || val === "lowestCYBER") {
      params.intro_cyber = "lowest";
    }
  }
  if (searchQuery.value) params.search = searchQuery.value;

  await fetchSubmissions(params);
};

const handlePageChange = (page) => {
  loadSubmissions(page);
};

let searchTimeout;
watch(searchQuery, () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    loadSubmissions(1);
  }, 500);
});

watch([selectedShift, selectedSpecialization, selectedScoreLevel], () => {
  loadSubmissions(1);
});

onMounted(() => {
  loadSubmissions();
});
</script>
<style scoped>
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
}</style>
