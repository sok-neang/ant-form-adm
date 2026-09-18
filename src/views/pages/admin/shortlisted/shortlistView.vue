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
        <!-- search  -->
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
                v-model="selectedGroup"
                :options="groupSelectOptions"
                option-label="label"
                option-value="value"
                placeholder="ជ្រើសរើសក្រុម"
                :clearable="false"
                style="width: 140px"
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
    <!-- Group Column -->
    <template #cell-group="{ row }">
      <span
        v-if="row.group_number"
        class="badge rounded-pill px-3 py-1 fw-semibold"
        style="color: var(--bs-primary, #2662d9); background-color: rgba(38, 98, 217, 0.12);"
      >
        {{ row.group }}
      </span>
      <span v-else class="text-muted">
        —
      </span>
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
    <!-- Technology Score -->
     
    <template #cell-score_technology="{ row }">
    <span
        class="badge rounded-pill px-3 py-2"
        :class="
        row.score_technology < 50
            ? 'score-fail'
            : row.score_technology < 70
            ? 'score-medium'
            : 'score-good'
        "
    >
        {{ row.score_technology }}
    </span>
    </template>

    <!-- Attendance Score -->
    <template #cell-score_attendance="{ row }">

    <span
        class="badge rounded-pill px-3 py-2"
        :class="
        row.score_attendance < 50
            ? 'score-fail'
            : row.score_attendance < 70
            ? 'score-medium'
            : 'score-good'
        "
    >
        {{ row.score_attendance }}
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

        <!-- 3-DOT ACTION DROPDOWN -->
        <div class="dropdown">
          <button
            type="button"
            class="btn btn-action-outline action-btn"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            title="សកម្មភាពបន្ថែម"
          >
            <i class="bi bi-three-dots-vertical"></i>
          </button>
          <ul class="dropdown-menu dropdown-menu-end shadow-sm border-0 py-2">
            <!-- Change Group -->
            <li>
              <button
                type="button"
                class="dropdown-item d-flex align-items-center gap-2 py-2"
                @click="openChangeGroupModal(row)"
              >
                <i class="bi bi-people text-primary fs-6"></i>
                <span class="small fw-medium">ប្ដូរក្រុម (Change Group)</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </template>
    </BaseTable>

    <!-- Change Group Modal -->
    <BaseModal
      :show="showGroupModal"
      size="md"
      :showClose="!isSubmittingGroup"
      @close="closeGroupModal"
    >
      <template #header>
        <div class="d-flex align-items-center gap-3">
          <div
            class="bg-primary-subtle text-primary rounded-3 d-flex align-items-center justify-content-center"
            style="width: 44px; height: 44px;"
          >
            <i class="bi bi-people fs-5"></i>
          </div>
          <div>
            <h5 class="fw-bold mb-0 text-dark">ប្ដូរក្រុមសិស្ស</h5>
            <span class="text-muted small">ជ្រើសរើសក្រុមថ្មីសម្រាប់បេក្ខជន</span>
          </div>
        </div>
      </template>

      <div class="py-2">
        <!-- Student Info Card -->
        <div class="p-3 rounded-3 bg-light border mb-3">
          <div class="d-flex align-items-center justify-content-between mb-2">
            <span class="fw-bold text-dark fs-6">{{ selectedStudent?.name || 'N/A' }}</span>
            <span
              v-if="selectedStudent?.group_number"
              class="badge rounded-pill px-3 py-1 fw-semibold"
              style="color: var(--bs-primary, #2662d9); background-color: rgba(38, 98, 217, 0.12);"
            >
              {{ selectedStudent?.group }}
            </span>
            <span v-else class="badge bg-secondary-subtle text-secondary rounded-pill px-2.5 py-1 small">
              មិនទាន់មានក្រុម
            </span>
          </div>
          <div class="d-flex align-items-center gap-3 text-muted small">
            <span><i class="bi bi-laptop me-1"></i>{{ selectedStudent?.skill || '—' }}</span>
            <span><i class="bi bi-clock me-1"></i>{{ selectedStudent?.study_shift || '—' }}</span>
            <span><i class="bi bi-person me-1"></i>{{ selectedStudent?.gender || '—' }}</span>
          </div>
        </div>

        <!-- Group Selector -->
        <div class="mb-3">
          <label class="form-label small fw-semibold text-dark mb-1">
            ជ្រើសរើសក្រុមថ្មី (New Group) <span class="text-danger">*</span>
          </label>
          <BaseSelect
            v-model="newGroupNumber"
            :options="groupModalOptions"
            option-label="label"
            option-value="value"
            placeholder="ជ្រើសរើសក្រុម"
            :clearable="false"
            :searchable="false"
          />
        </div>

        <!-- Preview comparison -->
        <div
          v-if="newGroupNumber && newGroupNumber !== String(selectedStudent?.group_number)"
          class="alert alert-primary py-2 px-3 small d-flex align-items-center gap-2 mb-0"
        >
          <i class="bi bi-arrow-left-right text-primary"></i>
          <span>
            ប្ដូរពី <strong>{{ selectedStudent?.group || 'គ្មានក្រុម' }}</strong> ទៅកាន់ <strong>ក្រុម {{ newGroupNumber }}</strong>
          </span>
        </div>
      </div>

      <template #footer>
        <div class="d-flex justify-content-end gap-2 w-100">
          <button
            type="button"
            class="btn btn-light px-4"
            :disabled="isSubmittingGroup"
            @click="closeGroupModal"
          >
            បោះបង់
          </button>
          <button
            type="button"
            class="btn btn-primary px-4 d-inline-flex align-items-center gap-2"
            :disabled="isSubmittingGroup || !newGroupNumber || newGroupNumber === String(selectedStudent?.group_number)"
            @click="handleConfirmChangeGroup"
          >
            <span
              v-if="isSubmittingGroup"
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
            <span>{{ isSubmittingGroup ? 'កំពុងរក្សាទុក...' : 'យល់ព្រមប្ដូរ' }}</span>
          </button>
        </div>
      </template>
    </BaseModal>

    <!-- Export Modal -->
    <ExportModal
      v-model:is-open="isExportModalOpen"
      export-type="shortlist"
      :initial-program="selectedSpecialization"
      :initial-shift="selectedShift"
      :initial-group="selectedGroup"
      initial-status="shortlist"
      :total-count="totalSubmissions || 0"
    />
  </div>
</template>
<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import BaseTable from "@/components/ui/base/BaseTable.vue";
import BaseInput from "@/components/ui/base/BaseInput.vue";
import BaseSelect from "@/components/ui/base/BaseSelect.vue";
import BaseButton from "@/components/ui/base/BaseButton.vue";
import BaseModal from "@/components/ui/base/BaseModal.vue";
import ExportModal from "@/components/ui/ExportModal.vue";
import { shiftOptions, specializationOptions, scoreLevelOptions, groupOptions } from "@/constants/options";
import { useShortlist } from "@/composable/application/short list/useShortlist";
import groupService from "@/services/group.service";
import submissionService from "@/services/submission.service";
import { useStatistic } from "@/composable/dashboard/useStatistic";
import { useAppToast } from "@/composable/useAppToast";

const router = useRouter();
const toast = useAppToast();
const statistic = useStatistic();
const total_student = ref(0);

// Change Group Modal State
const showGroupModal = ref(false);
const isSubmittingGroup = ref(false);
const selectedStudent = ref(null);
const newGroupNumber = ref("");

onMounted(async() => {
  await statistic.getStatsUser();
  total_student.value = statistic.statsData.value?.shortlist?.passed?.total || 0;
});

// Filters
const selectedScoreLevel = ref("all");
const selectedGroup = ref("");
const groupSelectOptions = ref([...groupOptions]);
const selectedShift = ref("");
const selectedSpecialization = ref("");
const searchQuery = ref("");
const showCreateModal = ref(false);
const isExportModalOpen = ref(false);

const fetchGroupOptions = async () => {
  try {
    const res = await groupService.getGroupSettings();
    if (res.data?.success && res.data?.data) {
      const groups = res.data.data.groups;
      const numGroups = res.data.data.setting?.numberOfGroups;
      if (Array.isArray(groups) && groups.length > 0) {
        groupSelectOptions.value = [
          { value: "", label: "ក្រុមទាំងអស់" },
          ...groups.map((g) => ({
            value: String(g.group),
            label: `ក្រុម ${g.group}`,
          })),
        ];
      } else if (numGroups && Number(numGroups) > 0) {
        const count = Number(numGroups);
        const dynamicList = [{ value: "", label: "ក្រុមទាំងអស់" }];
        for (let i = 1; i <= count; i++) {
          dynamicList.push({ value: String(i), label: `ក្រុម ${i}` });
        }
        groupSelectOptions.value = dynamicList;
      }
    }
  } catch (err) {
    console.error("Error fetching group options:", err);
  }
};

// Options for change group modal (excludes the "All Groups" empty option)
const groupModalOptions = computed(() => {
  return groupSelectOptions.value.filter((opt) => opt.value !== "");
});

const openChangeGroupModal = (row) => {
  selectedStudent.value = row;
  newGroupNumber.value = row.group_number ? String(row.group_number) : "";
  showGroupModal.value = true;
};

const closeGroupModal = () => {
  if (isSubmittingGroup.value) return;
  showGroupModal.value = false;
  selectedStudent.value = null;
  newGroupNumber.value = "";
};

const handleConfirmChangeGroup = async () => {
  if (!selectedStudent.value || !newGroupNumber.value) {
    toast.warning("សូមជ្រើសរើសក្រុមថ្មី");
    return;
  }

  isSubmittingGroup.value = true;
  try {
    const res = await submissionService.updateStudentGroup(
      selectedStudent.value.id,
      Number(newGroupNumber.value)
    );

    if (res.data?.success !== false) {
      toast.success(res.data?.message || "បានផ្លាស់ប្ដូរក្រុមសិស្សដោយជោគជ័យ");

      // Update local row immediately for snappy feedback
      if (selectedStudent.value) {
        selectedStudent.value.group_number = Number(newGroupNumber.value);
        selectedStudent.value.group = `ក្រុម ${newGroupNumber.value}`;
      }

      showGroupModal.value = false;
      selectedStudent.value = null;
      newGroupNumber.value = "";
      // Reload current page to maintain sync
      await loadSubmissions(pagination.value.current_page || 1);
    } else {
      toast.error(res.data?.message || "បរាជ័យក្នុងការប្ដូរក្រុម");
    }
  } catch (err) {
    console.error("Error updating student group:", err);
    const msg = err.response?.data?.message || err.message || "មិនអាចប្ដូរក្រុមបានទេ";
    toast.error(msg);
  } finally {
    isSubmittingGroup.value = false;
  }
};

const {
  loading,
  students,
  pagination,
  fetchSubmissions,
} = useShortlist();

const handleView = (row) => {
  router.push({ path: `/shortlist-detail/${row.id}`, query: { from: "all" } });
};

const columns = [
  { key: "seq_num", label: "#" },
  { key: "name", label: "ឈ្មោះសិស្ស" },
  { key: "gender", label: "ភេទ" },
  { key: "group", label: "ក្រុម" },
  { key: "skill", label: "ជំនាញ" },
  { key: "study_shift", label: "វេនសិក្សា" },
  { key: "score_technology", label: "C++" },
  { key: "score_attendance", label: "HTML / Dart" },
  { key: "total_score", label: "ពិន្ទុមធ្យម" },
];

const loadSubmissions = async (page = 1) => {
  const params = {
    page,
    limit: pagination.value.per_page,
  };
  
  if (selectedGroup.value) params.group = selectedGroup.value;
  if (selectedShift.value) params.shift = selectedShift.value;
  if (selectedSpecialization.value) params.program = selectedSpecialization.value;
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

let searchTimeout;
watch(searchQuery, () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    loadSubmissions(1);
  }, 500);
});

watch([selectedGroup, selectedShift, selectedSpecialization, selectedScoreLevel], () => {
  loadSubmissions(1);
});

onMounted(() => {
  fetchGroupOptions();
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
}

.action-btn {
  width: 34px;
  height: 34px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}

.btn-action-outline {
  border: 1px solid #e2e8f0;
  color: #64748b;
  background-color: #ffffff;
  transition: all 0.2s ease;
}

.btn-action-outline:hover,
.btn-action-outline:focus {
  background-color: #f8fafc;
  color: var(--bs-primary, #2662d9);
  border-color: var(--bs-primary, #2662d9);
}

.dropdown-menu {
  min-width: 190px;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  z-index: 1050;
}

.dropdown-item {
  font-size: 0.875rem;
  padding: 8px 16px;
  transition: all 0.15s ease;
}

.dropdown-item:hover {
  background-color: #f1f5f9;
}
</style>