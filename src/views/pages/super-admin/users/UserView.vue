<template>
  <div class="container-fluid">
    <div class="row g-3 mb-4">
      <BaseCard v-for="card in userCards">
        <div class="d-flex align-items-center justify-content-between mb-3">
          <div class="info-icon" :class="`bg-${card.color}-subtle text-${card.color}`">
            <i :class="card.icon"></i>
          </div>
          <!-- Value -->
          <h2 class="fw-bold mb-0 text-success fw-bold">{{ card.value }}</h2>
        </div>
        <!-- Title -->
        <p class="text-muted mb-1 fw-bold">
          {{ card.en_title }}
        </p>
        <p class="text-muted mb-1">
          {{ card.kh_title }}
        </p>
      </BaseCard>

    </div>

    <BaseTable :columns="columns" :rows="users" :pagination="pagination" :loading="loading" :show-actions="true"
      @page-change="getUsers">
      <template #search-filter>
        <div class="position-relative search-box">
          <BaseInput type="text" placeholder="ស្វែងរក..." input-class="p-0" v-model="search">
            <i class="bi bi-search search-icon"></i>
          </BaseInput>
        </div>
        <!-- Filters / Dropdown -->
        <div class="d-flex align-items-center gap-2">
          <BaseSelect v-model="filter.status" :options="statusOptions" option-label="label" option-value="value"
            placeholder="ជ្រើសរើសស្ថានភាព" :clearable="false" style="width: 150px" />
          <BaseSelect v-model="filter.role" :options="roleOptions" option-label="label" option-value="value"
            placeholder="ជ្រើសរើសតួនាទី" :clearable="false" style="width: 150px" />
          <BaseButton type="submit" variant="" custom-class="bg-primary text-light" @click="showCreateModal = true">
            បង្កើតគណនី
            <template #icon>
              <i class="bi bi-plus-circle"></i>
            </template>
          </BaseButton>

        </div>
      </template>
      <template #cell-user="{ row }">
        <div class="d-flex align-items-center gap-3">
          <img :src="row.avatarPath || '/src/assets/images/img/profile.webp'" :alt="row.name || 'User'" width="45"
            height="45" class="rounded-circle object-fit-cover" />

          <div class="d-flex flex-column">
            <span class="fw-semibold text-dark">
              {{ row.name }}
            </span>

            <span class="text-muted small">
              {{ row.email }}
            </span>
          </div>
        </div>
      </template>
      <template #cell-role="{ row }">
        <span class="badge px-3 py-1" :class="{
          'bg-success-subtle text-success': row.role === 'SUPER_ADMIN',
          'bg-primary-subtle text-primary': row.role === 'ADMIN',
          'bg-warning-subtle text-warning': row.role === 'TEACHER',
        }">
          {{ row.role }}
        </span>
      </template>
      <template #cell-status="{ row }">
        <span class="status-text" :class="row.status === 'ACTIVE' ? 'text-success' : (row.status === 'INACTIVE' ? 'text-secondary' : 'text-danger')">
          <span class="status-dot" :class="row.status === 'ACTIVE' ? 'bg-success' : (row.status === 'INACTIVE' ? 'bg-secondary' : 'bg-danger')"></span>
          {{ row.status === 'ACTIVE' ? 'សកម្ម' : (row.status === 'INACTIVE' ? 'អសកម្ម' : 'ផ្អាក') }}
        </span>
      </template>
      <template #cell-createdAt="{ row }">
        <span>{{ formatDate(row.createdAt) }}</span>
      </template>
      <template #cell-updatedAt="{ row }">
        <span>{{ formatDate(row.updatedAt) }}</span>
      </template>
      <template #actions="{ row }">
        <div class="dropdown" v-if="row.role !== 'SUPER_ADMIN'">
          <button type="button" class="btn action-btn" data-bs-toggle="dropdown" aria-expanded="false" title="សកម្មភាព">
            <i class="bi bi-three-dots-vertical"></i>
          </button>

          <ul class="dropdown-menu dropdown-menu-end shadow-sm ">
            <!-- Update User -->
            <li>
              <button type="button" class="dropdown-item d-flex align-items-center gap-2" @click="handleEditUser(row.id)">
                <i class="bi bi-pencil-square text-primary"></i>
                <span class="fs-6">កែប្រែអ្នកប្រើប្រាស់</span>
              </button>
            </li>

            <!-- Change Status -->
            <li>
              <button type="button" class="dropdown-item d-flex align-items-center gap-2"
                @click="openStatusModal(row)">
                <i class="bi bi-arrow-repeat text-warning"></i>
                <span class="fs-6">ប្តូរស្ថានភាព</span>
              </button>
            </li>

            <li>
              <hr class="dropdown-divider" />
            </li>

            <!-- Reset Password -->
            <li>
              <button type="button" class="dropdown-item d-flex align-items-center gap-2" @click="handleResetPassword(row)">
                <i class="bi bi-lock-fill text-danger"></i>
                <span class="fs-6">កំណត់ពាក្យសម្ងាត់ឡើងវិញ</span>
              </button>
            </li>
          </ul>
        </div>
      </template>



    </BaseTable>

    <CreateUserModal :show="showCreateModal" @close="showCreateModal = false" @created="handleCreateSuccess" />
    <EditUserModal :show="showEditModal" @close="showEditModal = false" :user-id="selectedUserId" @updated="handleUserUpdated" />
    <ResetPasswordModal :show="showGeneratedPassword" :user="data" @close="handleCloseGeneratedPassword" />

    <ChangeStatusModal :show="showStatusModal" :user="selectedUser" :loading="statusLoading" @close="showStatusModal = false" @change="handleStatusChange" />
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from "vue";

import BaseCard from "@/components/ui/base/BaseCard.vue";
import BaseTable from "@/components/ui/base/BaseTable.vue";
import BaseInput from "@/components/ui/base/BaseInput.vue";
import BaseSelect from "@/components/ui/base/BaseSelect.vue";
import BaseButton from "@/components/ui/base/BaseButton.vue";

import CreateUserModal from "./CreateUserModal.vue";
import EditUserModal from "./EditUserModal.vue";
import ResetPasswordModal from "./ResetPasswordModal.vue";
import ChangeStatusModal from "./ChangeStatusModal.vue";

import { useUserList } from "@/composable/user/useUserList.js";
import { formatDate } from "@/utils/dateFormat.js";

import { roleOptions, statusOptions } from "@/constants/options.js";
import { useAppToast } from "@/composable/useAppToast";
import userService from "@/services/user.service.js";

const { users, summaries, pagination, loading, search, filter, error, getUsers, getUserSummaries, resetPassword } = useUserList();

onMounted(async() => {
    await getUsers();
    await getUserSummaries();
})
console.log(summaries.value);


const showCreateModal = ref(false);
const showEditModal = ref(false)
const showStatusModal = ref(false); const statusLoading = ref(false);
const selectedUserId = ref(null);
const showGeneratedPassword = ref(false);
const toast = useAppToast();

const getRoleCount = (roleName) => {
    if (!summaries.value?.byRole) return 0;
    const roleObj = summaries.value.byRole.find(r => r.role === roleName);
    return roleObj ? roleObj.count : 0;
};

const userCards = computed(() => {
    return [
        {
            kh_title: "អ្នកប្រើប្រាស់សរុប",
            en_title: "Total Users",
            value: summaries.value?.total || 0,
            icon: "bi bi-people-fill",
            color: "primary",
        },
        {
            kh_title: "អ្នកគ្រប់គ្រងទាំងអស់",
            en_title: "Total Admins",
            value: getRoleCount("ADMIN"),
            icon: "bi bi-person-gear",
            color: "success",
        },
        {
            kh_title: "គ្រូបង្រៀនទាំងអស់",
            en_title: "Total Teachers",
            value: getRoleCount("TEACHER"),
            icon: "bi bi-person-workspace",
            color: "warning",
        },
    ];
});


const data = reactive({
  id: null,
  name: "",
  email: "",
  password: "",
});
const selectedUser = ref({ id: null, name: "", email: "", status: "", });
const openStatusModal = (user) => { 
  selectedUser.value = { 
    id: user.id, 
    name: user.name, 
    email: user.email, 
    status: user.status, };

    showStatusModal.value = true; 
  };
const handleStatusChange = async ({ id, status }) => {
   try { 
    statusLoading.value = true; 
    await userService.updateStatus(id, {status:status}); 
    showStatusModal.value = false; 
    await getUsers(); } 
    catch (error) { 
      console.error("Change status error:", error.response); 
    } finally {
       statusLoading.value = false; 
      } 
    };







const columns = [
  { key: "user", label: "អ្នកប្រើប្រាស់" },
  { key: "role", label: "តួនាទី" },
  { key: "status", label: "ស្ថានភាព" },
  { key: "createdAt", label: "ពេលវេលាបានបង្កើត" },
  { key: "updatedAt", label: "ពេលវេលាចូលចុងក្រោយ" },
];


const handleCreateSuccess = (user) => {
  data.id = user.id;
  data.name = user.name;
  data.email = user.email;
  data.password = user.password;

  showCreateModal.value = false;
  showGeneratedPassword.value = true;
};

const handleResetPassword = async (user) => {
  try {
    const result = await resetPassword(user.id);

    if (result?.success) {
      data.id = user.id;
      data.name = user.name;
      data.email = user.email;
      data.password = result.data.plainPassword;
      showGeneratedPassword.value = true;
      return;
    }
    if (result?.message) {
       toast.error(result.message);
    }
  } catch (error) { 
    console.error("Reset password error:", error); 
    const backendMessage = error.response?.data?.message; 
    const message = backendMessage === "You cannot reset your own password this way. Use change-password instead." ? "អ្នកមិនអាចកំណត់ពាក្យសម្ងាត់របស់ខ្លួនឯងតាមវិធីនេះបានទេ។ សូមប្រើមុខងារ «ប្តូរពាក្យសម្ងាត់» ជំនួសវិញ។" : backendMessage || "មិនអាចកំណត់ពាក្យសម្ងាត់ឡើងវិញបានទេ។";
    toast.error(message);
  }
};
const handleEditUser = (id) => {
  showEditModal.value = true;
  selectedUserId.value = id
};
const handleUserUpdated = async () => {
  await getUsers();
};
const handleCloseGeneratedPassword = () => {
  showGeneratedPassword.value = false;

  // Clear generated user data
  data.id = '';
  data.name = '';
  data.email = '';
  data.password = '';
  getUsers();
};


</script>

<style scoped>
.status-text {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.dot-success {
  background-color: #198754;
}

.dot-danger {
  background-color: #dc3545;
}
</style>