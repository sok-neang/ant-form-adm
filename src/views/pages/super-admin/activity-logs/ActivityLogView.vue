<template>
  <div class="container-fluid">
      <div class="log-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          type="button"
          class="log-tab"
          :class="{ active: activeTab === tab.value }"
          @click="activeTab = tab.value"
        >
          <i :class="tab.icon" class="fs-5"></i>
          <span>{{ tab.label }}</span>
        </button>
      </div>

      <BaseTable
      :columns="currentColumns"
      :rows="currentData"
      :pagination="pagination"
      :loading="loading"
      :show-actions="activeTab === 'audit' || activeTab === 'restore'"
    >
      <!-- ================= SEARCH / FILTER ================= -->

      <template #search-filter>
        <div class="position-relative search-box">
          <BaseInput
            v-model="search"
            type="text"
            placeholder="ស្វែងរក..."
            input-class="p-0"
          >
            <i class="bi bi-search search-icon"></i>
          </BaseInput>
        </div>

        <div class="d-flex align-items-center gap-2">
          <BaseSelect
            v-model="selectedStatus"
            :options="statusOptions"
            option-label="label"
            option-value="value"
            placeholder="ជ្រើសរើសសកម្មភាព"
            :clearable="false"
            style="width: 150px"
          />
        </div>
      </template>

      <!-- ================================================= -->
      <!-- AUDIT: USER -->
      <!-- ================================================= -->

      <template #cell-user="{ row }">
        <div class="d-flex align-items-center gap-3">
          <img
            :src="row.avatar"
            :alt="row.user"
            class="user-avatar"
          />

          <div class="d-flex flex-column">
            <span class="fw-semibold text-dark">
              {{ row.user }}
            </span>

            <span class="text-muted small">
              {{ row.email }}
            </span>
          </div>
        </div>
      </template>


      <!-- ================================================= -->
      <!-- AUDIT: ACTION -->
      <!-- ================================================= -->

      <template
        v-if="activeTab === 'audit'"
        #cell-action="{ row }"
      >
        <span
          class="badge px-3 py-1"
          :class="{
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
          }"
        >
          {{ row.action }}
        </span>
      </template>


      <!-- ================================================= -->
      <!-- LOGIN: STATUS -->
      <!-- ================================================= -->
      <template
        v-if="activeTab === 'login'"
        #cell-status="{ row }"
      >
        <span
          class="badge px-3 py-1"
          :class="{
            'bg-success-subtle text-success':
              row.status === 'SUCCESS',

            'bg-danger-subtle text-danger':
              row.status === 'FAILED',
          }"
        >
          {{ row.status }}
        </span>
      </template>

      <!-- ================================================= -->
      <!-- RESTORE: STATUS -->
      <!-- ================================================= -->

      <template  v-if="activeTab === 'restore'" #cell-status="{ row }" >
        <span
          class="badge px-3 py-1"
          :class="{
            'bg-success-subtle text-success':
              row.status === 'Restored',

            'bg-warning-subtle text-warning':
              row.status === 'Pending',
          }"
        >
          {{ row.status }}
        </span>
      </template>


      <!-- ================================================= -->
      <!-- ACTIONS -->
      <!-- ================================================= -->

      <template #actions="{ row }">
        <div class="d-flex align-items-center gap-1">

          <!-- VIEW -->
          <button v-if="activeTab != 'login'"
            type="button"
            class="btn action-btn action-view"
            title="មើលលម្អិត"
            @click="handleView(row)"
          >
            <i class="bi bi-eye-fill"></i>
          </button>

          <!-- RESTORE -->
          <button
            v-if="activeTab === 'restore'"
            type="button"
            class="btn action-btn"
            :class="
              row.status === 'Restored'
                ? 'action-restored'
                : 'action-restore'
            "
            :title="
              row.status === 'Restored'
                ? 'បានស្ដាររួច'
                : 'ស្ដារកំណត់ត្រា'
            "
            @click="handleRestore(row)"
          >
            <i class="bi bi-arrow-counterclockwise"></i>
          </button>
        </div>
      </template>
    </BaseTable>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import BaseTable from "@/components/ui/base/BaseTable.vue";
import BaseInput from "@/components/ui/base/BaseInput.vue";
import BaseSelect from "@/components/ui/base/BaseSelect.vue";
import image from "@/assets/images/img/profile.webp"
const selectedStatus = ref("");

const activeTab = ref("audit");

const tabs = [
  {
    value: "audit",
    label: "កំណត់ហេតុសវនកម្ម",
    icon: "bi bi-shield-check",
  },
  {
    value: "login",
    label: "ប្រវត្តិចូលប្រព័ន្ធ",
    icon: "bi bi-box-arrow-in-right",
  },
  {
    value: "restore",
    label: "ស្ដារកំណត់ត្រា",
    icon: "bi bi-arrow-counterclockwise",
  },
];

const auditColumns = [
  {
    key: "user",
    label: "អ្នកប្រើប្រាស់",
  },
  {
    key: "action",
    label: "សកម្មភាព",
  },
  {
    key: "created_at",
    label: "ពេលបង្កើត",
  },
  {
    key: "message",
    label: "សារបញ្ជាក់",
  },
];

const loginColumns = [
  {
    key: "user",
    label: "អ្នកប្រើប្រាស់",
  },
  {
    key: "status",
    label: "ស្ថានភាព",
  },
  {
    key: "user_agent",
    label: "User Agent",
  },
  {
    key: "ip_address",
    label: "IP Address",
  },
  {
    key: "login_at",
    label: "ពេលវេលាចូលប្រព័ន្ធ",
  },
];

const restoreColumns = [
  {
    key: "user",
    label: "អ្នកធ្វើសកម្មភាព",
  },
   {
    key: "restored_by",
    label: "អ្នកស្តារ",
  },
     {
    key: "message",
    label: "សកម្មភាព",
  },
  {
    key: "restored_at",
    label: "ពេលវេលា",
  },
  {
    key: "status",
    label: "ស្ថានភាព",
  },
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
  switch (activeTab.value) {
    case "login":
      return loginHistory.value;

    case "restore":
      return restoreLogs.value;

    case "audit":
    default:
      return activityLogs.value;
  }
});

const activityLogs = ref([
  {
    id: 1,
    user: "យឹម ស្រីយ៉ឺ",
    avatar:image,
    email: "sreyyoe123@gmail.com",
    action: "CREATE",
    created_at: "21 Aug 2026 09:02",
    message: "បានបង្កើតអ្នកប្រើប្រាស់ថ្មី",
  },
  {
    id: 2,
    user: "សុខ ដារ៉ា",
    avatar:image,
    email: "dara@gmail.com",
    action: "UPDATE",
    created_at: "21 Aug 2026 09:15",
    message: "បានកែប្រែព័ត៌មានវគ្គសិក្សា",
  },
  {
    id: 3,
    user: "ចាន់ វណ្ណា",
    email: "Vanna@gmail.com",
    avatar:image,
    action: "DELETE",
    created_at: "21 Aug 2026 09:30",
    message: "បានលុបប្រភេទវគ្គសិក្សា",
  },
  {
    id: 4,
    user: "យឹម ស្រីយ៉ឺ",
    action: "RESTORE",
    avatar:image,
    created_at: "21 Aug 2026 10:05",
    message: "បានស្តារកំណត់ត្រាដោយជោគជ័យ",
  },
  {
    id: 5,
    user: "កែវ សុភា",
    action: "UPDATE",
    avatar:image,
    created_at: "21 Aug 2026 10:22",
    message: "បានកែប្រែព័ត៌មានអ្នកប្រើប្រាស់",
  },

]);
const loginHistory = ref([
  {
    id: 1,
    user: "យឹម ស្រីយ៉ឺ",
    avatar:image,
    email: "sreyyoe123@gmail.com",
    status: "SUCCESS",
    user_agent: "Chrome 151.0 / Windows 10",
    ip_address: "192.168.1.10",
    login_at: "21 Aug 2026 09:02",
  },
  {
    id: 2,
    user: "យឹម ស្រីយ៉ឺ",
    avatar:image,
    email: "sreyyoe123@gmail.com",
    status: "SUCCESS",
    user_agent: "Chrome 151.0 / Windows 10",
    ip_address: "192.168.1.15",
    login_at: "21 Aug 2026 09:15",
  },
  {
    id: 3,
    user: "យឹម ស្រីយ៉ឺ",
    avatar:image,
    email: "sreyyoe123@gmail.com",
    status: "FAILED",
    user_agent: "Safari 18.6 / macOS",
    ip_address: "192.168.1.20",
    login_at: "21 Aug 2026 09:30",
  },
  {
    id: 4,
    user: "យឹម ស្រីយ៉ឺ",
    avatar:image,
    email: "sreyyoe123@gmail.com",
    status: "SUCCESS",
    user_agent: "Safari 18.5 / iPhone",
    ip_address: "10.0.0.25",
    login_at: "21 Aug 2026 10:05",
  },
  {
    id: 5,
    user: "យឹម ស្រីយ៉ឺ",
    avatar:image,
    email: "sreyyoe123@gmail.com",
    status: "FAILED",
    user_agent: "Firefox 142.0 / Windows 10",
    ip_address: "10.0.0.30",
    login_at: "21 Aug 2026 10:22",
  },
 
]);
const restoreLogs = ref([
  {
    id: 1,
    user: "សុខ ដារ៉ា",
    avatar: image,
    email: "dara123@gmail.com",
    restored_by: "Supper admin",
    restored_by_avatar: image,
    restored_by_email: "sreyyoe123@gmail.com",
    message: "Restored user profile",
    restored_at: "21 Aug 2026 09:30",
    status: "Pending",
  },
  {
    id: 2,
    user: "ចាន់ វណ្ណា",
    avatar: image,
    email: "vanna123@gmail.com",
    restored_by: "Supper admin",
    restored_by_avatar: image,
    restored_by_email: "dara123@gmail.com",
    message: "Update score student",
    restored_at: "21 Aug 2026 10:15",
    status: "Restored",
  },
  {
    id: 3,
    user: "កែវ សុភា",
    avatar: image,
    email: "sophea123@gmail.com",
    restored_by: "Supper admin",
    restored_by_avatar: image,
    restored_by_email: "sreyyoe123@gmail.com",
    message: "Restored user profile",
    restored_at: "21 Aug 2026 11:05",
    status: "Restored",
  },
  {
    id: 4,
    user: "ហេង រតនា",
    avatar: image,
    email: "ratana123@gmail.com",
    restored_by: "Supper admin",
    restored_by_avatar: image,
    restored_by_email: "sophea123@gmail.com",
    message: "Update score student",
    restored_at: "21 Aug 2026 11:40",
    status: "Restored",
  },
  {
    id: 5,
    user: "មាស វិសាល",
    avatar: image,
    email: "visal123@gmail.com",
    restored_by: "Supper admin",
    restored_by_avatar: image,
    restored_by_email: "sreyyoe123@gmail.com",
    message: "Restored user profile",
    restored_at: "21 Aug 2026 12:20",
    status: "Pending",
  },
]);
const pagination = ref({
  current_page: 1,
  first_item: 1,
  last_item: 10,
  from: 1,
  to: 10,
  per_page: 10,
  total: 25,
  last_page: 3,
  on_first_page: true,
  has_more_pages: true,
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

const loading = ref(false);
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