<template>
  <div class="container-fluid">
    <div class="log-tabs">
      <button v-for="tab in tabs" :key="tab.value" type="button" class="log-tab"
        :class="{ active: activeTab === tab.value }" @click="activeTab = tab.value">
        <i :class="tab.icon" class="fs-5"></i>
        <span>{{ tab.label }}</span>
      </button>
    </div>
    <!-- {{ currentData }} -->
    <BaseTable :columns="currentColumns" :rows="currentData" :pagination="pagination" :loading="loading"
      :show-actions="activeTab === 'audit' || activeTab === 'restore'">
      <!-- ================= SEARCH / FILTER ================= -->

      <template #search-filter>
        <div class="position-relative search-box">
          <BaseInput v-model="search" type="text" placeholder="ស្វែងរក..." input-class="p-0">
            <i class="bi bi-search search-icon"></i>
          </BaseInput>
        </div>

        <div class="d-flex align-items-center gap-2">
          <BaseSelect v-model="selectedStatus" :options="statusOptions" option-label="label" option-value="value"
            placeholder="ជ្រើសរើសសកម្មភាព" :clearable="false" style="width: 150px" />
        </div>
      </template>

      <!-- ================================================= -->
      <!-- AUDIT: USER -->
      <!-- ================================================= -->
      <template #cell-user="{ row }">
        <!-- {{ row }} -->
        <div class="d-flex align-items-center gap-3">
          <!-- <img
            :src="row.avatar"
            :alt="row.user"
            class="user-avatar"
          /> -->

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
          'bg-success-subtle text-success':
            row.status === 'Restored',

          'bg-warning-subtle text-warning':
            row.status === 'Pending',
        }">
          {{ row.status }}
        </span>
      </template>
      <template #cell-></template>


      <!-- ================================================= -->
      <!-- ACTIONS -->
      <!-- ================================================= -->

      <template #actions="{ row }">
        <div class="d-flex align-items-center gap-1">

          <!-- VIEW -->
          <button v-if="activeTab != 'login'" type="button" class="btn action-btn action-view" title="មើលលម្អិត"
            @click="handleView(row)">
            <i class="bi bi-eye-fill"></i>
          </button>

          <!-- RESTORE -->
          <button v-if="activeTab === 'restore'" type="button" class="btn action-btn" :class="row.status === 'Restored'
              ? 'action-restored'
              : 'action-restore'
            " :title="row.status === 'Restored'
                ? 'បានស្ដាររួច'
                : 'ស្ដារកំណត់ត្រា'
              " @click="handleRestore(row)">
            <i class="bi bi-arrow-counterclockwise"></i>
          </button>
        </div>
      </template>
    </BaseTable>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import BaseTable from "@/components/ui/base/BaseTable.vue";
import BaseInput from "@/components/ui/base/BaseInput.vue";
import BaseSelect from "@/components/ui/base/BaseSelect.vue";
import { formatDate } from "@/utils/dateFormat.js";

import { useActivityLogList } from "@/composable/activity-logs/useActivityLogList";

const { auditLog, loginHistory, auditLogRestore, pagination, loading, search, filter, getAuditLog, getLoginHistory, getAuditLogRestore } = useActivityLogList();

const selectedStatus = ref("");
const activeTab = ref("audit");
onMounted(async () => {
  await getAuditLog();
  await getLoginHistory();
  await getAuditLogRestore();
});
const tabs = [
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
  { key: "restored_by", label: "អ្នកស្តារ" },
  { key: "message", label: "សកម្មភាព" },
  { key: "restored_at", label: "ពេលវេលា" },
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
const currentData = computed(() => {
  console.log(activeTab.value);
  
  switch (activeTab.value) {
    case "login":
      return loginHistory.value;

    case "restore":
      return auditLogRestore.value;

    case "audit":
    default:
      return auditLog.value;
  }
});


const statusOptions = [
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

// const loading = ref(false);
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