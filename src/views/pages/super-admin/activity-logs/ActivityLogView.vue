<template>
  <div class="container-fluid">
    <div class="log-tabs">
      <button v-for="tab in tabOptions" :key="tab.value" class="log-tab" :class="{ active: activeTab === tab.value }"
        type="button" @click="changeTab(tab.value)">
        <i :class="tab.icon" class="fs-5"></i>
        {{ tab.label }}
      </button>
    </div>
    <BaseTable :columns="currentColumns" :rows="currentTab.data" :pagination="currentTab.pagination"
      :loading="currentTab.loading" :show-actions="activeTab === 'audit' || activeTab === 'restore'"
      @page-change="handlePageChange">

      <!-- ================= SEARCH / FILTER ================= -->
      <template #search-filter>
        <div class="position-relative search-box">
          <BaseInput v-model="currentTab.search" type="text" placeholder="ស្វែងរក..." input-class="p-0"
            @input="applySearch">
            <i class="bi bi-search search-icon"></i>
          </BaseInput>
        </div>

        <div class="d-flex align-items-center gap-2">
          <BaseSelect v-model="currentTab.filters.status" :options="currentStatusOptions"
            @update:model-value="applyFilter" />
        </div>
      </template>

      <!-- ================================================= -->
      <template #cell-user="{ row }">
        <div class="d-flex align-items-center gap-3">
          <BaseAvatar
            :src="row.user"
            :alt="row.user?.name || 'User'"
            :size="40"
          />

          <div class="d-flex flex-column">
            <span class="fw-semibold text-dark">
              {{ row.user?.name }}
            </span>

            <span class="text-muted small">
              {{ row.user?.email }}
            </span>
          </div>
        </div>
      </template>
      <template #cell-createdAt="{ row }">
        <span class="">{{ formatDate(row.createdAt) }}</span>
      </template>


      <!-- ================================================= -->
      <!-- AUDIT: ACTION -->
      <!-- ================================================= -->

      <template v-if="activeTab === 'audit'" #cell-action="{ row }">
        <span class="badge px-3 py-1" :class="{
          'bg-success-subtle text-success':
            row.action === 'CREATE',

          'bg-primary-subtle text-primary':
            row.action === 'UPDATE',

          'bg-danger-subtle text-danger':
            row.action === 'DELETE',

          'bg-warning-subtle text-warning':
            row.action === 'RESTORE',

          'bg-info-subtle text-info':
            row.action === 'LOGIN',
        }">
          {{ row.action }}
        </span>
      </template>


      <!-- ================================================= -->
      <!-- LOGIN: STATUS -->
      <!-- ================================================= -->
      <template v-if="activeTab === 'login'" #cell-status="{ row }">
        <span class="badge px-3 py-1" :class="{
          'bg-success-subtle text-success':
            row.status === 'SUCCESS',

          'bg-danger-subtle text-danger':
            row.status === 'FAILED',
        }">
          {{ row.status }}
        </span>
      </template>

      <template #cell-loggedInAt="{ row }">
        <span class="">{{ formatDate(row.loggedInAt) }}</span>
      </template>

      <!-- ================================================= -->
      <!-- RESTORE: STATUS -->
      <!-- ================================================= -->

      <template v-if="activeTab === 'restore'" #cell-status="{ row }">
        <span class="badge px-3 py-1" :class="{
          'bg-success-subtle text-success': isRestored(row),
          'bg-warning-subtle text-warning': !isRestored(row),
        }">
          {{ isRestored(row) ? 'បានស្ដារ' : 'កំពុងរង់ចាំ' }}
        </span>
      </template>


      <!-- ================================================= -->
      <!-- ACTIONS -->
      <!-- ================================================= -->

      <template #actions="{ row }">
        <div class="d-flex align-items-center gap-1">

          <!-- VIEW DETAIL -->
          <button v-if="activeTab !== 'login'" type="button" class="btn btn-action-outline action-btn action-view" title="មើលលម្អិត"
            @click="openDetail(row, activeTab)">
            <i class="bi bi-eye"></i>
          </button>

          <!-- RESTORE -->
          <button v-if="activeTab === 'restore'" type="button" class="btn action-btn" :class="isRestored(row)
              ? 'action-restored'
              : 'action-restore'
            " :disabled="isRestored(row) || restoringId === row.id" :title="isRestored(row)
          ? 'បានស្ដាររួច'
          : 'ស្ដារកំណត់ត្រា'
        " @click="openRestoreModal(row)">
            <span v-if="restoringId === row.id" class="spinner-border spinner-border-sm" role="status"></span>
            <i v-else class="bi bi-arrow-counterclockwise"></i>
          </button>

        </div>
      </template>
    </BaseTable>
  </div>

  <!-- Detail Modal -->
  <DetailActivityLog
    :show="showDetail"
    :log="selectedLog"
    :type="detailType"
    @close="showDetail = false"
  />

  <!-- Confirm Restore Modal -->
  <BaseModal :show="showRestoreModal" size="md" title="បញ្ជាក់ការស្ដារទិន្នន័យ" @close="closeRestoreModal">
    <template #header>
      <div class="d-flex align-items-center gap-3">
        <div class="d-flex align-items-center justify-content-center bg-warning-subtle text-warning rounded-3" style="width: 42px; height: 42px;">
          <i class="bi bi-arrow-counterclockwise fs-3"></i>
        </div>
        <div>
          <h5 class="modal-title fw-bold mb-1">បញ្ជាក់ការស្ដារទិន្នន័យ</h5>
          <p class="text-muted mb-0 small">ស្ដារកំណត់ត្រាត្រឡប់ទៅស្ថានភាពដើមវិញ</p>
        </div>
      </div>
    </template>

    <div class="py-2">
      <p class="mb-3">តើអ្នកពិតជាចង់ស្ដារកំណត់ត្រានេះត្រឡប់ទៅស្ថានភាពដើមវិញមែនទេ?</p>

      <div class="p-3 bg-light rounded-3 mb-3 small">
        <div class="d-flex justify-content-between py-1 border-bottom">
          <span class="text-muted">តារាងគោលដៅ (Table):</span>
          <span class="fw-semibold text-primary font-monospace">{{ getRestoreTable(restoreTarget) }}</span>
        </div>
        <div class="d-flex justify-content-between py-1 border-bottom">
          <span class="text-muted">សកម្មភាពដើម (Action):</span>
          <span class="fw-semibold text-danger">{{ restoreTarget?.action || 'N/A' }}</span>
        </div>
        <div v-if="restoreTarget?.message" class="d-flex justify-content-between py-1 border-bottom">
          <span class="text-muted">សារ (Message):</span>
          <span class="fw-semibold text-dark">{{ restoreTarget?.message }}</span>
        </div>
        <div class="d-flex justify-content-between py-1">
          <span class="text-muted">ពេលវេលា (Time):</span>
          <span class="text-dark">{{ formatDate(restoreTarget?.createdAt) }}</span>
        </div>
      </div>

      <div class="alert alert-warning d-flex align-items-center gap-2 mb-0 py-2 small">
        <i class="bi bi-exclamation-triangle-fill fs-5"></i>
        <span>ទិន្នន័យបច្ចុប្បន្ននឹងត្រូវបានជំនួសដោយទិន្នន័យដើម (Snapshot) មុនពេលមានការកែប្រែ/លុប។</span>
      </div>
    </div>

    <template #footer>
      <div class="d-flex justify-content-end gap-2 w-100">
        <BaseButton type="button" custom-class="btn-light bg-secondary-subtle px-4" :disabled="restoring" @click="closeRestoreModal">
          បោះបង់
        </BaseButton>
        <BaseButton type="button" variant="warning" custom-class="px-4 text-white" :disabled="restoring" @click="handleRestoreConfirm">
          <span v-if="restoring" class="spinner-border spinner-border-sm me-1" role="status"></span>
          {{ restoring ? "កំពុងស្ដារ..." : "យល់ព្រមស្ដារ" }}
        </BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import BaseTable from "@/components/ui/base/BaseTable.vue";
import BaseInput from "@/components/ui/base/BaseInput.vue";
import BaseSelect from "@/components/ui/base/BaseSelect.vue";
import BaseModal from "@/components/ui/base/BaseModal.vue";
import BaseAvatar from "@/components/ui/base/BaseAvatar.vue";
import BaseButton from "@/components/ui/base/BaseButton.vue";
import { formatDate } from "@/utils/dateFormat.js";
import { useAppToast } from "@/composable/useAppToast";
import activityLogService from "@/services/activity-log.service";
import DetailActivityLog from "./DetailActivityLog .vue";

const toast = useAppToast();

const showDetail = ref(false);
const selectedLog = ref(null);
const detailType = ref("");

const openDetail = (row, type) => {  
  selectedLog.value = row;
  detailType.value = type;
  showDetail.value = true;
};

// Restore state & actions
const showRestoreModal = ref(false);
const restoreTarget = ref(null);
const restoring = ref(false);
const restoringId = ref(null);

const isRestored = (row) => {
  const s = String(row?.status || row?.restoreStatus || "").toUpperCase();
  return s === "RESTORED";
};

const getRestoreTable = (row) => {
  const rawTable = row?.targetTable || row?.tableName || row?.table || "";
  const t = rawTable.toLowerCase();
  if (t.includes("user")) return "users";
  if (t.includes("submiss")) return "submissions";
  if (t.includes("eval")) return "evaluations";
  return t || "users";
};

const openRestoreModal = (row) => {
  if (isRestored(row)) return;
  restoreTarget.value = row;
  showRestoreModal.value = true;
};

const closeRestoreModal = () => {
  if (restoring.value) return;
  showRestoreModal.value = false;
  restoreTarget.value = null;
};

const handleRestoreConfirm = async () => {
  if (!restoreTarget.value) return;
  const target = restoreTarget.value;
  const table = getRestoreTable(target);
  const id = target.id;

  try {
    restoring.value = true;
    restoringId.value = id;

    const response = await activityLogService.restoreRecord(table, id);
    if (response.data?.success || response.status === 200 || response.status === 201) {
      toast.success("ស្ដារទិន្នន័យបានជោគជ័យ");
      showRestoreModal.value = false;
      restoreTarget.value = null;
      // Refresh current tab
      await getData(activeTab.value, currentTab.value?.pagination?.page || 1);
    } else {
      toast.error(response.data?.message || "បរាជ័យក្នុងការស្ដារទិន្នន័យ");
    }
  } catch (error) {
    console.error("Restore failed:", error);
    toast.error(error.response?.data?.message || "មានបញ្ហាក្នុងការស្ដារទិន្នន័យ");
  } finally {
    restoring.value = false;
    restoringId.value = null;
  }
};
import { useActivityLogList } from "@/composable/activity-logs/useActivityLogList";

const { tabs: activityTabs, getData } = useActivityLogList();

const activeTab = ref("audit");
const currentTab = computed(() => { return activityTabs[activeTab.value]; });

const tabOptions = [
  { value: "audit", label: "កំណត់ហេតុសវនកម្ម", icon: "bi bi-shield-check" },
  { value: "login", label: "ប្រវត្តិចូលប្រព័ន្ធ", icon: "bi bi-box-arrow-in-right" },
  { value: "restore", label: "ស្ដារកំណត់ត្រា", icon: "bi bi-arrow-counterclockwise" }
];


const auditColumns = [
  { key: "user", label: "អ្នកប្រើប្រាស់" },
  { key: "action", label: "សកម្មភាព" },
  { key: "message", label: "សារបញ្ជាក់" },
  { key: "createdAt", label: "ពេលបង្កើត" },
];

const loginColumns = [
  { key: "user", label: "អ្នកប្រើប្រាស់" },
  { key: "status", label: "ស្ថានភាព" },
  { key: "userAgent", label: "User Agent" },
  { key: "ipAddress", label: "IP Address" },
  { key: "loggedInAt", label: "ពេលវេលាចូលប្រព័ន្ធ" },
];

const restoreColumns = [
  { key: "user", label: "អ្នកធ្វើសកម្មភាព" },
  { key: "message", label: "សកម្មភាព" },
  { key: "createdAt", label: "ពេលវេលា" },
  { key: "status", label: "ស្ថានភាព" },
];

const currentColumns = computed(() => {
  switch (activeTab.value) {
    case "login":
      return loginColumns;

    case "restore":
      return restoreColumns;

    case "audit":
    default:
      return auditColumns;
  }
});
const changeTab = async (tab) => {
  activeTab.value = tab;

  // Only call API if this tab doesn't have data yet
  if (!activityTabs[tab].data.length) {
    await getData(tab);
  }
};
const handlePageChange = (page) => {
  getData(activeTab.value, page);
};
const applyFilter = () => {
  getData(activeTab.value, 1);
};
const applySearch = () => {
  getData(activeTab.value, 1);
};
onMounted(() => {
  getData("audit");
});

const currentStatusOptions = computed(() => {
  switch (activeTab.value) {
    case "login":
      return loginStatusOptions;

    case "restore":
      return restoreStatusOptions;

    case "audit":
    default:
      return auditStatusOptions;
  }
});

const auditStatusOptions = [
  {
    value: "",
    label: "សកម្មភាពទាំងអស់",
  },
  {
    value: "CREATE",
    label: "CREATE",
  },
  {
    value: "UPDATE",
    label: "UPDATE",
  },
  {
    value: "DELETE",
    label: "DELETE",
  },
  {
    value: "RESTORE",
    label: "RESTORE",
  },
];

const loginStatusOptions = [
  {
    value: "",
    label: "ស្ថានភាពទាំងអស់",
  },
  {
    value: "SUCCESS",
    label: "ជោគជ័យ",
  },
  {
    value: "FAILED",
    label: "បរាជ័យ",
  },
];

const restoreStatusOptions = [
  {
    value: "",
    label: "ស្ថានភាពទាំងអស់",
  },
  {
    value: "PENDING",
    label: "កំពុងរង់ចាំ",
  },
  {
    value: "RESTORED",
    label: "បានស្ដារ",
  },
];


</script>
<style scoped>
.user-avatar {
  width: 40px;
  height: 40px;

  border-radius: 50%;

  object-fit: cover;

  flex-shrink: 0;
}
</style>