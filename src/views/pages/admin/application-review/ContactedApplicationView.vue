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
        <div class="d-flex align-items-center gap-2 flex-wrap">
          <!-- Status Filter (Contacted / Not Contacted) -->
          <BaseSelect
            v-model="selectedStatus"
            :options="contactStatusOptions"
            option-label="label"
            option-value="value"
            placeholder="ស្ថានភាពទំនាក់ទំនង"
            :clearable="true"
            style="width: 175px"
          />

          <!-- Shift Filter -->
          <BaseSelect
            v-model="selectedShift"
            :options="shiftOptions"
            option-label="label"
            option-value="value"
            placeholder="ជ្រើសរើសពេល"
            :clearable="true"
            style="width: 140px"
          />

          <!-- Specialization / Track Filter -->
          <BaseSelect
            v-model="selectedTrack"
            :options="specializationOptions"
            option-label="label"
            option-value="value"
            placeholder="ជ្រើសរើសមុខជំនាញ"
            :clearable="true"
            style="width: 180px"
          />

          <!-- Refresh Button -->
          <BaseButton
            type="button"
            variant=""
            :disabled="loading"
            custom-class="text-primary border-2 border-primary bg-transparent"
            title="ទាញយកទិន្នន័យឡើងវិញ"
            @click="loadContacts(1)"
          >
            <template #icon>
              <i class="bi bi-arrow-clockwise"></i>
            </template>
          </BaseButton>
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

      <!-- Telegram Column -->
      <template #cell-telegram="{ row }">
        <a
          v-if="row.telegram && row.telegram !== '—'"
          :href="getTelegramLink(row.telegram)"
          target="_blank"
          rel="noopener noreferrer"
          class="text-primary text-decoration-none d-inline-flex align-items-center gap-1"
        >
          <i class="bi bi-telegram"></i>
          <span>{{ row.telegram }}</span>
        </a>
        <span v-else class="text-muted">—</span>
      </template>

      <!-- Contact Note Column -->
      <template #cell-contactNote="{ row }">
        <div class="note-cell text-truncate" :title="row.contactNote">
          <span v-if="row.contactNote" class="text-dark fw-medium">{{ row.contactNote }}</span>
          <span v-else class="text-muted">—</span>
        </div>
      </template>

      <!-- Contact Status Badge -->
      <template #cell-isContacted="{ row }">
        <span
          class="badge rounded-pill px-3 py-2 d-inline-flex align-items-center gap-1"
          :class="row.isContacted ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'"
        >
          <i :class="row.isContacted ? 'bi bi-check-circle-fill' : 'bi bi-clock-fill'"></i>
          <span>{{ row.isContacted ? "បានទាក់ទង" : "មិនទាន់ទាក់ទង" }}</span>
        </span>
      </template>

      <!-- Actions Column -->
      <template #actions="{ row }">
        <div class="d-flex justify-content-start align-items-center gap-2">
          <!-- View Detail -->
          <button 
            :disabled="loading || isSubmittingAction"
            type="button"
            class="btn btn-action-outline action-btn action-view"
            title="មើលលម្អិត"
            @click="reviewApplication(row)"
          >
            <i class="bi bi-eye"></i>
          </button>

          <!-- 3-DOT ACTION DROPDOWN -->
          <div class="dropdown">
            <button
              :disabled="loading || isSubmittingAction"
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
              <!-- Mark as Contacted (if not contacted yet) -->
              <li v-if="!row.isContacted">
                <button
                  :disabled="loading || isSubmittingAction"
                  type="button"
                  class="dropdown-item d-flex align-items-center gap-2 text-success py-2"
                  @click="openMarkContactedModal(row)"
                >
                  <i class="bi bi-check2-circle fs-6"></i>
                  <span class="small fw-medium">សម្គាល់ថាបានទាក់ទង</span>
                </button>
              </li>

              <li v-if="!row.isContacted">
                <hr class="dropdown-divider my-1" />
              </li>

              <!-- Remove from Contact List -->
              <li>
                <button
                  :disabled="loading || isSubmittingAction"
                  type="button"
                  class="dropdown-item d-flex align-items-center gap-2 text-danger py-2"
                  @click="openDeleteModal(row)"
                >
                  <i class="bi bi-trash3-fill fs-6"></i>
                  <span class="small fw-medium">លុបចេញពីបញ្ជី (Delete)</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </template>
    </BaseTable>

    <!-- MARK CONTACTED CONFIRMATION MODAL -->
    <BaseModal
      :show="showMarkModal"
      size="md"
      :showClose="!isSubmittingAction && !loading"
      @close="showMarkModal = false"
    >
      <template #header>
        <div class="d-flex align-items-center gap-3">
          <div
            class="bg-success-subtle text-success rounded-3 d-flex align-items-center justify-content-center"
            style="width: 44px; height: 44px;"
          >
            <i class="bi bi-telephone-check fs-5"></i>
          </div>
          <div>
            <h5 class="fw-bold text-dark mb-0">សម្គាល់ថាបានទាក់ទង</h5>
            <span class="text-muted small">Mark Student as Contacted</span>
          </div>
        </div>
      </template>

      <div class="py-2">
        <p class="text-secondary mb-3">
          តើអ្នកពិតជាចង់សម្គាល់សិស្ស <strong>{{ selectedStudent?.name }}</strong> ថាបានទាក់ទងរួចរាល់ហើយមែនទេ?
        </p>
        <div v-if="selectedStudent?.contactNote" class="p-3 bg-light rounded-3 border mb-2">
          <span class="text-muted small d-block mb-1">កំណត់ចំណាំ ៖</span>
          <span class="text-dark fw-medium">{{ selectedStudent?.contactNote }}</span>
        </div>
      </div>

      <template #footer>
        <div class="d-flex justify-content-end gap-2 w-100">
          <BaseButton
            type="button"
            variant="outline"
            :disabled="isSubmittingAction || loading"
            @click="showMarkModal = false"
          >
            បោះបង់
          </BaseButton>
          <BaseButton
            type="button"
            custom-class="btn-success text-white px-4"
            :disabled="isSubmittingAction || loading"
            :loading="isSubmittingAction || loading"
            @click="confirmMarkContacted"
          >
            <template #icon>
              <i class="bi bi-check2-circle"></i>
            </template>
            យល់ព្រម
          </BaseButton>
        </div>
      </template>
    </BaseModal>

    <!-- DELETE CONTACT CONFIRMATION MODAL -->
    <BaseModal
      :show="showDeleteModal"
      size="md"
      :showClose="!isSubmittingAction && !loading"
      @close="showDeleteModal = false"
    >
      <template #header>
        <div class="d-flex align-items-center gap-3">
          <div
            class="bg-danger-subtle text-danger rounded-3 d-flex align-items-center justify-content-center"
            style="width: 44px; height: 44px;"
          >
            <i class="bi bi-trash3-fill fs-5"></i>
          </div>
          <div>
            <h5 class="fw-bold text-dark mb-0">លុបចេញពីបញ្ជីទំនាក់ទំនង</h5>
            <span class="text-muted small">Remove Student from Contact List</span>
          </div>
        </div>
      </template>

      <div class="py-2">
        <p class="text-secondary mb-2">
          តើអ្នកប្រាកដជាចង់លុបសិស្ស <strong>{{ selectedStudent?.name }}</strong> ចេញពីបញ្ជីទំនាក់ទំនងនេះមែនទេ?
        </p>
        <p class="text-danger small mb-0">
          * ការលុបនេះនឹងដកសិស្សចេញពីបញ្ជីទំនាក់ទំនង ប៉ុន្តែមិនលុបពាក្យសុំរបស់សិស្សនោះទេ។
        </p>
      </div>

      <template #footer>
        <div class="d-flex justify-content-end gap-2 w-100">
          <BaseButton
            type="button"
            variant="outline"
            :disabled="isSubmittingAction || loading"
            @click="showDeleteModal = false"
          >
            បោះបង់
          </BaseButton>
          <BaseButton
            type="button"
            custom-class="btn-danger text-white px-4"
            :disabled="isSubmittingAction || loading"
            :loading="isSubmittingAction || loading"
            @click="confirmDeleteContact"
          >
            <template #icon>
              <i class="bi bi-trash3"></i>
            </template>
            លុបចេញ
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
import { shiftOptions, specializationOptions, contactStatusOptions } from "@/constants/options";
import { useContactList } from "@/composable/contact/contact";
import { useStatistic } from "@/composable/dashboard/useStatistic";

const router = useRouter();
const statistic = useStatistic();
const total_student = ref(0);

onMounted(async() => {
  await statistic.getStatsUser();
  total_student.value = statistic.statsData.value?.submissions?.total || 0;
});

// Filters State
const searchQuery = ref("");
const selectedStatus = ref("");
const selectedShift = ref("");
const selectedTrack = ref("");

// Actions & Modal State
const actionLoadingId = ref(null);
const isSubmittingAction = ref(false);
const showMarkModal = ref(false);
const showDeleteModal = ref(false);
const selectedStudent = ref(null);

const {
  loading,
  students,
  totalSubmissions,
  pagination,
  fetchContacts,
  markContacted,
  deleteContact,
} = useContactList();

const columns = [
  { key: "seq_num", label: "#" },
  { key: "name", label: "ឈ្មោះសិស្ស" },
  { key: "gender", label: "ភេទ" },
  { key: "skill", label: "ជំនាញ" },
  { key: "phone", label: "លេខទូរស័ព្ទ" },
  { key: "telegram", label: "Telegram" },
  { key: "contactNote", label: "កំណត់ចំណាំ" },
  { key: "isContacted", label: "ស្ថានភាព" },
];

const loadContacts = async (page = 1) => {
  const params = {
    page,
    limit: pagination.value.per_page || 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  };

  if (selectedStatus.value !== "") {
    params.isContacted = selectedStatus.value;
  }
  if (selectedShift.value) params.shift = selectedShift.value;
  if (selectedTrack.value) params.program = selectedTrack.value;
  if (searchQuery.value) params.search = searchQuery.value;

  await fetchContacts(params);
};

const handlePageChange = (page) => {
  loadContacts(page);
};

const reviewApplication = (row) => {
  router.push({ path: `/application-review/${row.id}`, query: { from: "contacted" } });
};

const getTelegramLink = (telegram) => {
  if (!telegram) return "#";
  const clean = String(telegram).replace(/^@/, "").trim();
  return `https://t.me/${clean}`;
};

const openMarkContactedModal = (row) => {
  selectedStudent.value = row;
  showMarkModal.value = true;
};

const confirmMarkContacted = async () => {
  if (!selectedStudent.value) return;
  isSubmittingAction.value = true;
  actionLoadingId.value = selectedStudent.value.id;
  try {
    const success = await markContacted(selectedStudent.value.id);
    if (success) {
      showMarkModal.value = false;
      await loadContacts(pagination.value.current_page);
    }
  } finally {
    isSubmittingAction.value = false;
    actionLoadingId.value = null;
  }
};

const openDeleteModal = (row) => {
  selectedStudent.value = row;
  showDeleteModal.value = true;
};

const confirmDeleteContact = async () => {
  if (!selectedStudent.value) return;
  isSubmittingAction.value = true;
  actionLoadingId.value = selectedStudent.value.id;
  try {
    const success = await deleteContact(selectedStudent.value.id);
    if (success) {
      showDeleteModal.value = false;
      await loadContacts(pagination.value.current_page);
    }
  } finally {
    isSubmittingAction.value = false;
    actionLoadingId.value = null;
  }
};

// Auto search debouncing
let searchTimeout;
watch(searchQuery, () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    loadContacts(1);
  }, 500);
});

watch([selectedStatus, selectedShift, selectedTrack], () => {
  loadContacts(1);
});

onMounted(() => {
  loadContacts();
});
</script>

<style scoped>
.search-box {
  min-width: 200px;
}

.note-cell {
  max-width: 220px;
}

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

.action-btn:disabled,
.action-btn[disabled] {
  opacity: 0.5;
  cursor: not-allowed !important;
  pointer-events: none;
  background-color: #f1f5f9;
  border-color: #e2e8f0;
}

.action-view {
  color: #3b82f6;
}
</style>
