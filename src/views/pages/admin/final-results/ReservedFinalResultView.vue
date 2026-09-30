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
                :clearable="true"
                style="width: 220px"
            />
           <BaseSelect
                v-model="selectedShift"
                :options="shiftOptions"
                option-label="label"
                option-value="value"
                placeholder="ជ្រើសរើសពេល"
                :clearable="true"
                style="width: 150px"
            />
          <BaseSelect
                v-model="selectedSpecialization"
                :options="specializationOptions"
                option-label="label"
                option-value="value"
                placeholder="ជ្រើសរើសមុខជំនាញ"
                :clearable="true"
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

          <!-- MOVE TO SHORTLIST -->
          <button
            type="button"
            class="btn btn-action-outline action-btn"
            title="ប្ដូរទៅបញ្ជីសម្រាំង (Move to Shortlist)"
            @click="openMoveToShortlistModal(row)"
          >
            <i class="bi bi-person-check text-primary"></i>
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

    <!-- Move to Shortlist Confirmation Modal -->
    <BaseModal
      :show="showMoveModal"
      size="md"
      :showClose="!isSubmittingMove"
      @close="closeMoveModal"
    >
      <template #header>
        <div class="d-flex align-items-center gap-3">
          <div
            class="bg-primary-subtle text-primary rounded-3 d-flex align-items-center justify-content-center"
            style="width: 44px; height: 44px;"
          >
            <i class="bi bi-person-check fs-5"></i>
          </div>
          <div>
            <h5 class="fw-bold text-dark mb-0">ប្ដូរទៅបញ្ជីសម្រាំង</h5>
            <span class="text-muted small">Move to Shortlist</span>
          </div>
        </div>
      </template>

      <div class="py-2">
        <p class="text-secondary mb-3 fs-6 lh-base">
          តើអ្នកពិតជាចង់ផ្លាស់ប្តូរបេក្ខជនបម្រុង <strong class="text-dark">{{ selectedStudent?.name }}</strong> ទៅកាន់ «បញ្ជីសម្រាំង (SHORTLIST)» វិញមែនទេ?
        </p>
        <div v-if="selectedStudent" class="p-3 bg-light rounded-3 border">
          <div class="d-flex justify-content-between mb-2 small">
            <span class="text-muted">ជំនាញ ៖</span>
            <span class="fw-medium text-dark">{{ selectedStudent?.skill || '—' }}</span>
          </div>
          <div class="d-flex justify-content-between mb-2 small">
            <span class="text-muted">វេនសិក្សា ៖</span>
            <span class="fw-medium text-dark">{{ selectedStudent?.study_shift || '—' }}</span>
          </div>
          <div class="d-flex justify-content-between small">
            <span class="text-muted">ពិន្ទុមធ្យម ៖</span>
            <span class="fw-bold text-primary">{{ selectedStudent?.total_score ?? '—' }}</span>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="d-flex justify-content-end gap-2 w-100">
          <BaseButton
            type="button"
            variant="outline"
            :disabled="isSubmittingMove"
            @click="closeMoveModal"
          >
            បោះបង់
          </BaseButton>
          <BaseButton
            type="button"
            custom-class="btn-primary text-white px-4"
            :disabled="isSubmittingMove"
            :loading="isSubmittingMove"
            @click="confirmMoveToShortlist"
          >
            <template #icon>
              <i class="bi bi-check2"></i>
            </template>
            យល់ព្រម
          </BaseButton>
        </div>
      </template>
    </BaseModal>
  </div>
</template>
<script setup>
import { ref, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import BaseTable from "@/components/ui/base/BaseTable.vue";
import BaseInput from "@/components/ui/base/BaseInput.vue";
import BaseSelect from "@/components/ui/base/BaseSelect.vue";
import BaseButton from "@/components/ui/base/BaseButton.vue";
import BaseModal from "@/components/ui/base/BaseModal.vue";
import ExportModal from "@/components/ui/ExportModal.vue";
import submissionService from "@/services/submission.service";
import { useAppToast } from "@/composable/useAppToast";
import {shiftOptions, specializationOptions, scoreLevelOptions} from "@/constants/options"
import { useReservedFinalResult } from "@/composable/application/final result/useFinalResult";
import { useStatistic } from "@/composable/dashboard/useStatistic";
import { useTableFilterSync } from "@/composable/useTableFilterSync";
const router = useRouter();
const statistic = useStatistic();
const total_student = ref(0);
onMounted(async() => {
  await statistic.getStatsUser();
  total_student.value = (statistic.statsData.value.evaluation.passed.total + statistic.statsData.value.reserved.total);
})
const isExportModalOpen = ref(false);
const selectedScoreLevel = ref("all");
const selectedShift = ref("");
const selectedSpecialization = ref("");
const searchQuery = ref("");
const showCreateModal = ref(false);

const { getInitialPage, syncPage } = useTableFilterSync("final_results_reserved", {
  shift: selectedShift,
  program: selectedSpecialization,
  scoreLevel: selectedScoreLevel,
  search: searchQuery,
});

const {
  loading,
  students,
  totalSubmissions,
  pagination,
  fetchSubmissions,
} = useReservedFinalResult();

const handleView = (row) => {
  router.push({ path: `/final-result-detail/${row.id}`, query: { from: "reserve" } });
};

const toast = useAppToast();
const showMoveModal = ref(false);
const selectedStudent = ref(null);
const isSubmittingMove = ref(false);

const openMoveToShortlistModal = (row) => {
  selectedStudent.value = row;
  showMoveModal.value = true;
};

const closeMoveModal = () => {
  if (isSubmittingMove.value) return;
  showMoveModal.value = false;
  selectedStudent.value = null;
};

const confirmMoveToShortlist = async () => {
  if (!selectedStudent.value?.id) return;
  isSubmittingMove.value = true;
  try {
    let response;
    try {
      response = await submissionService.promoteStatus(selectedStudent.value.id, { status: "SHORTLIST" });
    } catch (err) {
      if (err?.response?.status === 400 || err?.response?.status === 422) {
        response = await submissionService.promoteStatus(selectedStudent.value.id, { status: "SHORTLISTED" });
      } else {
        throw err;
      }
    }

    if (response?.data?.success || response?.status === 200) {
      toast.success("បានផ្លាស់ប្តូរបេក្ខជនទៅកាន់បញ្ជីសម្រាំងដោយជោគជ័យ");
      showMoveModal.value = false;
      selectedStudent.value = null;
      await loadSubmissions(pagination.value?.current_page || 1);
      await statistic.getStatsUser();
      total_student.value =
        (statistic.statsData.value?.evaluation?.passed?.total || 0) +
        (statistic.statsData.value?.reserved?.total || 0);
    }
  } catch (error) {
    console.error("Error moving student to shortlist:", error);
    toast.error(error?.response?.data?.message || "មានបញ្ហាក្នុងការផ្លាស់ប្តូរទៅបញ្ជីសម្រាំង");
  } finally {
    isSubmittingMove.value = false;
  }
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
  syncPage(page);
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
  loadSubmissions(getInitialPage());
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
