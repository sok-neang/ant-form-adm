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
      <!-- Search Box -->
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
           v-model="selectedShift"
            :options="shiftOptions"
            option-label="label"
            option-value="value"
            placeholder="ជ្រើសរើសពេល"
            :clearable="true"
            style="width: 150px"
            />
          <BaseSelect
           v-model="selectedTrack"
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
            custom-class="text-primary border-2 border-primary bg-transparent"
            @click="loadSubmissions(1)"
          >
            <template #icon>
              <i class="bi bi-arrow-clockwise"></i>
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
    <template #actions="{ row }">
      <div class="d-flex justify-content-start align-items-center gap-2">
        <!-- VIEW -->
        <button 
          type="button"
          class="btn btn-action-outline action-btn action-view"
          title="មើលលម្អិត"
          @click="reviewAplication(row)"
        >
          <i class="bi bi-eye"></i>
        </button>

        <!-- 3-DOT ACTION DROPDOWN -->
        <div class="dropdown">
          <button
            type="button"
            class="btn btn-action-outline action-btn"
            data-bs-toggle="dropdown"
            data-bs-boundary="viewport"
            aria-expanded="false"
            title="សកម្មភាពបន្ថែម"
          >
            <i class="bi bi-three-dots-vertical"></i>
          </button>
          <ul class="dropdown-menu dropdown-menu-end shadow-sm border-0 py-2">
            <!-- Change Group (Only for SHORTLIST status) -->
            <li v-if="row.raw?.status === 'SHORTLIST' || row.rawStatus === 'SHORTLIST'">
              <button
                type="button"
                class="dropdown-item d-flex align-items-center gap-2 py-2"
                @click="openChangeGroupModal(row)"
              >
                <i class="bi bi-people text-primary fs-6"></i>
                <span class="small fw-medium">ប្ដូរក្រុម (Change Group)</span>
              </button>
            </li>

            <!-- Edit: Shift & Program -->
            <li>
              <button
                type="button"
                class="dropdown-item d-flex align-items-center gap-2 py-2"
                @click="openEditModal(row)"
              >
                <i class="bi bi-pencil-square text-primary fs-6"></i>
                <span class="small fw-medium">កែប្រែ (Shift & Program)</span>
              </button>
            </li>

            <!-- Add to Contact List (Only for SUBMIT status and not yet contacted) -->
            <li v-if="(row.raw?.status === 'SUBMIT' || row.status === 'SUBMIT') && !row.raw?.isContacted && !row.isContacted">
              <button
                type="button"
                class="dropdown-item d-flex align-items-center gap-2 py-2"
                @click="openAddContactModal(row)"
              >
                <i class="bi bi-person-lines-fill text-primary fs-6"></i>
                <span class="small fw-medium">បន្ថែមទៅបញ្ជីទំនាក់ទំនង</span>
              </button>
            </li>

            <li>
              <hr class="dropdown-divider my-1" />
            </li>

            <!-- Delete: Student -->
            <li>
              <button
                type="button"
                class="dropdown-item d-flex align-items-center gap-2 text-danger py-2"
                @click="openDeleteModal(row)"
              >
                <i class="bi bi-trash3-fill fs-6"></i>
                <span class="small fw-medium">លុបសិស្ស (Delete)</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </template>
    </BaseTable>

    <!-- Edit Modal (Shift & Program) -->
    <BaseModal
      :show="showEditModal"
      size="md"
      :showClose="!isSubmittingEdit"
      @close="showEditModal = false"
    >
      <template #header>
        <div class="d-flex align-items-center gap-3">
          <div
            class="bg-primary-subtle text-primary rounded-3 d-flex align-items-center justify-content-center"
            style="width: 44px; height: 44px;"
          >
            <i class="bi bi-pencil-square fs-5"></i>
          </div>
          <div>
            <h5 class="fw-bold text-dark mb-0">កែប្រែវេន និងមុខជំនាញ</h5>
            <span class="text-muted small">សិស្ស ៖ {{ editingStudent?.name }}</span>
          </div>
        </div>
      </template>

      <div class="py-2">
        <div class="mb-3">
          <label class="form-label fw-semibold text-dark small mb-1">
            មុខជំនាញ (Program) <span class="text-danger">*</span>
          </label>
          <BaseSelect
            v-model="editForm.program"
            :options="editProgramOptions"
            option-label="label"
            option-value="value"
            placeholder="ជ្រើសរើសមុខជំនាញ"
            :clearable="false"
            style="width: 100%"
          />
        </div>

        <div class="mb-2">
          <label class="form-label fw-semibold text-dark small mb-1">
            វេនសិក្សា (Shift) <span class="text-danger">*</span>
          </label>
          <BaseSelect
            v-model="editForm.shift"
            :options="editShiftOptions"
            option-label="label"
            option-value="value"
            placeholder="ជ្រើសរើសវេនសិក្សា"
            :clearable="false"
            style="width: 100%"
          />
        </div>
      </div>

      <template #footer>
        <div class="d-flex justify-content-end gap-2 w-100">
          <button
            type="button"
            class="btn btn-light px-4 border"
            :disabled="isSubmittingEdit"
            @click="showEditModal = false"
          >
            បោះបង់
          </button>
          <button
            type="button"
            class="btn btn-primary px-4 fw-semibold shadow-sm d-inline-flex align-items-center gap-2"
            :disabled="isSubmittingEdit || !editForm.program || !editForm.shift"
            @click="handleSaveEdit"
          >
            <span
              v-if="isSubmittingEdit"
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
            <span>{{ isSubmittingEdit ? 'កំពុងរក្សាទុក...' : 'រក្សាទុក' }}</span>
          </button>
        </div>
      </template>
    </BaseModal>

    <!-- Delete Confirmation Modal -->
    <BaseModal
      :show="showDeleteModal"
      size="md"
      :showClose="!isDeleting"
      @close="showDeleteModal = false"
    >
      <template #header>
        <div class="d-flex align-items-center gap-3">
          <div
            class="bg-danger-subtle text-danger rounded-3 d-flex align-items-center justify-content-center"
            style="width: 44px; height: 44px;"
          >
            <i class="bi bi-exclamation-triangle-fill fs-5"></i>
          </div>
          <div>
            <h5 class="fw-bold text-dark mb-0">បញ្ជាក់ការលុបសិស្ស</h5>
            <span class="text-muted small">សកម្មភាពនេះមិនអាចត្រឡប់ក្រោយវិញបានឡើយ</span>
          </div>
        </div>
      </template>

      <div class="py-2">
        <p class="text-secondary mb-0 fs-6 lh-base">
          តើអ្នកពិតជាចង់លុបទិន្នន័យពាក្យស្នើសុំរបស់សិស្ស <strong class="text-dark">«{{ deletingStudent?.name }}»</strong> មែនទេ?
        </p>
      </div>

      <template #footer>
        <div class="d-flex justify-content-end gap-2 w-100">
          <button
            type="button"
            class="btn btn-light px-4 border"
            :disabled="isDeleting"
            @click="showDeleteModal = false"
          >
            បោះបង់
          </button>
          <button
            type="button"
            class="btn btn-danger px-4 fw-semibold shadow-sm d-inline-flex align-items-center gap-2"
            :disabled="isDeleting"
            @click="handleConfirmDelete"
          >
            <span
              v-if="isDeleting"
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
            <span>{{ isDeleting ? 'កំពុងលុប...' : 'យល់ព្រមលុប' }}</span>
          </button>
        </div>
      </template>
    </BaseModal>

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
            <span class="fw-bold text-dark fs-6">{{ selectedStudentForGroup?.name || 'N/A' }}</span>
            <span
              v-if="selectedStudentForGroup?.raw?.groupNumber || selectedStudentForGroup?.raw?.submissionGroup?.groupNumber"
              class="badge rounded-pill px-3 py-1 fw-semibold"
              style="color: var(--bs-primary, #2662d9); background-color: rgba(38, 98, 217, 0.12);"
            >
              ក្រុម {{ selectedStudentForGroup?.raw?.groupNumber || selectedStudentForGroup?.raw?.submissionGroup?.groupNumber }}
            </span>
            <span v-else class="badge bg-secondary-subtle text-secondary rounded-pill px-2.5 py-1 small">
              មិនទាន់មានក្រុម
            </span>
          </div>
          <div class="d-flex align-items-center gap-3 text-muted small">
            <span><i class="bi bi-laptop me-1"></i>{{ selectedStudentForGroup?.skill || '—' }}</span>
            <span><i class="bi bi-clock me-1"></i>{{ selectedStudentForGroup?.study_shift || '—' }}</span>
            <span><i class="bi bi-person me-1"></i>{{ selectedStudentForGroup?.gender || '—' }}</span>
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
          v-if="newGroupNumber"
          class="alert alert-primary py-2 px-3 small d-flex align-items-center gap-2 mb-0"
        >
          <i class="bi bi-arrow-left-right text-primary"></i>
          <span>
            កំណត់ទៅកាន់ <strong>ក្រុម {{ newGroupNumber }}</strong>
          </span>
        </div>
      </div>

      <template #footer>
        <div class="d-flex justify-content-end gap-2 w-100">
          <button
            type="button"
            class="btn btn-light px-4 border"
            :disabled="isSubmittingGroup"
            @click="closeGroupModal"
          >
            បោះបង់
          </button>
          <button
            type="button"
            class="btn btn-primary px-4 d-inline-flex align-items-center gap-2"
            :disabled="isSubmittingGroup || !newGroupNumber"
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

    <!-- Add to Contact Modal -->
    <BaseModal
      :show="showAddContactModal"
      size="md"
      :showClose="!isSubmittingContact"
      @close="showAddContactModal = false"
    >
      <template #header>
        <div class="d-flex align-items-center gap-3">
          <div
            class="bg-primary-subtle text-primary rounded-3 d-flex align-items-center justify-content-center"
            style="width: 44px; height: 44px;"
          >
            <i class="bi bi-person-lines-fill fs-5"></i>
          </div>
          <div>
            <h5 class="fw-bold text-dark mb-0">បន្ថែមទៅបញ្ជីទំនាក់ទំនង</h5>
            <span class="text-muted small">សិស្ស ៖ {{ contactingStudent?.name }}</span>
          </div>
        </div>
      </template>

      <div class="py-2">
        <div class="mb-3">
          <label class="form-label fw-semibold text-dark small mb-1">
            កំណត់ចំណាំ (Contact Note) <span class="text-danger">*</span>
          </label>
          <textarea
            v-model="contactNoteInput"
            rows="3"
            class="form-control"
            placeholder="បញ្ចូលកំណត់ចំណាំ (ឧ. check transcript)..."
          ></textarea>
        </div>
      </div>

      <template #footer>
        <div class="d-flex justify-content-end gap-2 w-100">
          <button
            type="button"
            class="btn btn-light px-4 border"
            :disabled="isSubmittingContact"
            @click="showAddContactModal = false"
          >
            បោះបង់
          </button>
          <button
            type="button"
            class="btn btn-primary px-4 d-inline-flex align-items-center gap-2"
            :disabled="isSubmittingContact || !contactNoteInput.trim()"
            @click="confirmAddContact"
          >
            <span
              v-if="isSubmittingContact"
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
            <i v-else class="bi bi-check2-circle"></i>
            <span>{{ isSubmittingContact ? 'កំពុងបន្ថែម...' : 'បន្ថែម' }}</span>
          </button>
        </div>
      </template>
    </BaseModal>
  </div>
</template>
<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import BaseTable from "@/components/ui/base/BaseTable.vue";
import BaseInput from "@/components/ui/base/BaseInput.vue";
import BaseSelect from "@/components/ui/base/BaseSelect.vue";
import BaseButton from "@/components/ui/base/BaseButton.vue";
import BaseModal from "@/components/ui/base/BaseModal.vue";
import { useStatistic } from "@/composable/dashboard/useStatistic.js";
import { useAppToast } from "@/composable/useAppToast.js";
import { shiftOptions, specializationOptions, groupOptions } from "@/constants/options";
import { useApplicationList } from "@/composable/application/all submission/useapplicationList";
import contactService from "@/services/contact.service";
import groupService from "@/services/group.service";
import submissionService from "@/services/submission.service";

const router = useRouter();
const toast = useAppToast();
const selectedShift = ref("");
const selectedTrack = ref("");
const searchQuery = ref("");
const statistic = useStatistic();
const total_student = ref(0);

// Change Group State
const showGroupModal = ref(false);
const isSubmittingGroup = ref(false);
const selectedStudentForGroup = ref(null);
const newGroupNumber = ref("");
const groupSelectOptions = ref([...groupOptions]);

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

const groupModalOptions = computed(() => {
  return groupSelectOptions.value.filter((opt) => opt.value !== "");
});

const openChangeGroupModal = (row) => {
  selectedStudentForGroup.value = row;
  const currentNum =
    row.raw?.groupNumber ||
    row.raw?.submissionGroup?.groupNumber ||
    "";
  newGroupNumber.value = currentNum ? String(currentNum) : "";
  showGroupModal.value = true;
};

const closeGroupModal = () => {
  if (isSubmittingGroup.value) return;
  showGroupModal.value = false;
  selectedStudentForGroup.value = null;
  newGroupNumber.value = "";
};

const handleConfirmChangeGroup = async () => {
  if (!selectedStudentForGroup.value || !newGroupNumber.value) {
    toast.warning("សូមជ្រើសរើសក្រុមថ្មី");
    return;
  }

  isSubmittingGroup.value = true;
  try {
    const res = await submissionService.updateStudentGroup(
      selectedStudentForGroup.value.id,
      Number(newGroupNumber.value)
    );

    if (res.data?.success !== false) {
      toast.success("បានផ្លាស់ប្ដូរក្រុមសិស្សដោយជោគជ័យ" || res.data?.message);
      showGroupModal.value = false;
      selectedStudentForGroup.value = null;
      newGroupNumber.value = "";
      await loadSubmissions(pagination.value.current_page || 1);
    } else {
      toast.error("បរាជ័យក្នុងការប្ដូរក្រុម" || res.data?.message);
    }
  } catch (err) {
    console.error("Error updating group in all submissions:", err);
    const msg = "មិនអាចប្ដូរក្រុមបានទេ" || err.response?.data?.message || err.message;
    toast.error(msg);
  } finally {
    isSubmittingGroup.value = false;
  }
};

onMounted(async() => {
  fetchGroupOptions();
  await statistic.getStatsUser();
  total_student.value = statistic.statsData.value?.submissions?.total || 0;
});

const {
  loading,
  students,
  pagination,
  fetchSubmissions,
  deleteSubmission,
  updateShiftOrProgram,
} = useApplicationList();

// Edit Modal State
const showEditModal = ref(false);
const isSubmittingEdit = ref(false);
const editingStudent = ref(null);
const editForm = ref({
  program: "",
  shift: "",
});

const editProgramOptions = specializationOptions.filter((opt) => opt.value);
const editShiftOptions = shiftOptions.filter((opt) => opt.value);

const openEditModal = (row) => {
  editingStudent.value = row;
  const prog =
    row.rawProgram ||
    (row.skill === "Web Development"
      ? "WEB_DEVELOPMENT"
      : row.skill === "Mobile App"
      ? "MOBILE_APP"
      : "");
  const shft =
    row.rawShift ||
    (row.study_shift === "វេនព្រឹក"
      ? "MORNING"
      : row.study_shift === "វេនរសៀល"
      ? "AFTERNOON"
      : "");

  editForm.value = {
    program: prog || "WEB_DEVELOPMENT",
    shift: shft || "MORNING",
  };
  showEditModal.value = true;
};

const handleSaveEdit = async () => {
  if (!editingStudent.value?.id) return;
  if (!editForm.value.program || !editForm.value.shift) {
    toast.warning("សូមជ្រើសរើសមុខជំនាញ និងវេនសិក្សា");
    return;
  }
  isSubmittingEdit.value = true;
  try {
    const res = await updateShiftOrProgram(editingStudent.value.id, {
      program: editForm.value.program,
      shift: editForm.value.shift,
    });
    toast.success("បានកែប្រែវេន និងមុខជំនាញដោយជោគជ័យ");
    showEditModal.value = false;
    await loadSubmissions(pagination.value.current_page);
  } catch (error) {
    toast.error("បរាជ័យក្នុងការកែប្រែ" || error.response?.data?.message);
  } finally {
    isSubmittingEdit.value = false;
  }
};

// Delete Modal State
const showDeleteModal = ref(false);
const isDeleting = ref(false);
const deletingStudent = ref(null);

const openDeleteModal = (row) => {
  deletingStudent.value = row;
  showDeleteModal.value = true;
};

const handleConfirmDelete = async () => {
  if (!deletingStudent.value?.id) return;
  isDeleting.value = true;
  try {
    const res = await deleteSubmission(deletingStudent.value.id);
    toast.success("បានលុបទិន្នន័យសិស្សដោយជោគជ័យ");
    showDeleteModal.value = false;
    await Promise.all([
      loadSubmissions(pagination.value.current_page),
      statistic.getStatsUser().then(() => {
        if (statistic.statsData.value?.submissions?.total != null) {
          total_student.value = statistic.statsData.value.submissions.total;
        }
      }),
    ]);
  } catch (error) {
    toast.error("បរាជ័យក្នុងការលុបសិស្ស" || error.response?.data?.message);
  } finally {
    isDeleting.value = false;
  }
};

// Add to Contact List State & Actions
const showAddContactModal = ref(false);
const isSubmittingContact = ref(false);
const contactingStudent = ref(null);
const contactNoteInput = ref("");

const openAddContactModal = (row) => {
  const status = row.raw?.status || row.status;
  if (status && status !== "SUBMIT") {
    toast.warning("មានតែសិស្សដែលមានស្ថានភាព SUBMIT ប៉ុណ្ណោះដែលអាចបន្ថែមទៅបញ្ជីទំនាក់ទំនង");
    return;
  }
  contactingStudent.value = row;
  contactNoteInput.value = "";
  showAddContactModal.value = true;
};

const confirmAddContact = async () => {
  if (!contactingStudent.value?.id) return;
  isSubmittingContact.value = true;
  try {
    const res = await contactService.addContact(contactingStudent.value.id, {
      contactNote: contactNoteInput.value.trim(),
    });
    if (res.data?.success) {
      toast.success("បានបន្ថែមទៅបញ្ជីទំនាក់ទំនងដោយជោគជ័យ");
      showAddContactModal.value = false;
      if (contactingStudent.value) {
        contactingStudent.value.isContacted = true;
        if (contactingStudent.value.raw) {
          contactingStudent.value.raw.isContacted = true;
        }
      }
    }
  } catch (error) {
    toast.error("បរាជ័យក្នុងការបន្ថែមទៅបញ្ជីទំនាក់ទំនង" || error.response?.data?.message);
  } finally {
    isSubmittingContact.value = false;
  }
};

const reviewAplication = (row) => {
  router.push({ path: `/application-review/${row.id}`, query: { from: "all" } });
};

const columns = [
  { key: "seq_num", label: "#" },
  { key: "name", label: "ឈ្មោះសិស្ស" },
  { key: "gender", label: "ភេទ" },
  { key: "year", label: "និស្សិតឆ្នាំ" },
  { key: "skill", label: "ជំនាញ" },
  { key: "study_shift", label: "វេនសិក្សា" },
  { key: "created_at", label: "បរិច្ឆេទ បញ្ជូន" },
];

const loadSubmissions = async (page = 1) => {
  const params = {
    page,
    limit: pagination.value.per_page,
    submittedAt: "newest",
  };
  
  // Add filters if selected
  if (selectedShift.value) params.shift = selectedShift.value;
  if (selectedTrack.value) params.program = selectedTrack.value;
  if (searchQuery.value) params.search = searchQuery.value;

  await fetchSubmissions(params);
};

const handlePageChange = (page) => {
  loadSubmissions(page);
};

// Refetch when filters change
let searchTimeout;
watch(searchQuery, () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    loadSubmissions(1);
  }, 500); // 500ms debounce
});

watch([selectedShift, selectedTrack], () => {
  loadSubmissions(1);
});

onMounted(() => {
  loadSubmissions();
});
</script>

<style scoped>
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
  min-width: 210px;
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
.dropdown-item.text-danger:hover {
  background-color: #fee2e2;
  color: #dc2626 !important;
}
</style>