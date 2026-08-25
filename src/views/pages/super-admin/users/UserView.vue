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
    <BaseTable
    :columns="columns"
    :rows="students"
    :pagination="pagination"
    :loading="loading"
    :show-actions="true"
    >
    <template #search-filter>
        <div class="position-relative search-box">
            <BaseInput
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
           v-model="selectedRole"
            :options="RoleOptions"
            option-label="label"
            option-value="value"
            placeholder="ជ្រើសរើសស្ថានភាព"
            :clearable="false"
            style="width: 150px"
            />
          <BaseSelect
           v-model="selectedStatus"
            :options="statusOptions"
            option-label="label"
            option-value="value"
            placeholder="ជ្រើសរើសស្ថានភាព"
            :clearable="false"
            style="width: 150px"
            />
          <BaseButton
            type="submit"
            variant=""
            custom-class="bg-primary text-light"
            @click="showCreateModal = true"
          >
            បង្កើតគណនី
            <template #icon>
              <i class="bi bi-plus-circle"></i>
            </template>
          </BaseButton>

        </div>

    </template>
    <template #actions>
    <div class="d-flex justify-content-end align-items-center gap-2">
        <!-- Block -->
        <button
        type="button"
        class="btn action-btn action-block"
        title="បិទគណនី"
        >
        <i class="bi bi-ban"></i>
        </button>
        <!-- Change Password -->
        <button
        type="button"
        class="btn action-btn action-password"
        title="ប្តូរពាក្យសម្ងាត់"
        @click="showChangePassModal = true"
        >
        <i class="bi bi-lock-fill"></i>
        </button>

    </div>
    </template>

    </BaseTable>
    <CreateUserModal
      v-model:show="showCreateModal"
      @submit="handleCreateUser"
    />
    <ChangePassword  
      v-model:show="showChangePassModal"
      @submit="handleChangePassword" />
    
    

  </div>
</template>


<script setup>
import { ref } from "vue";
import BaseCard from "@/components/ui/base/BaseCard.vue";
import BaseTable from "@/components/ui/base/BaseTable.vue";
import BaseInput from "@/components/ui/base/BaseInput.vue";
import BaseSelect from "@/components/ui/base/BaseSelect.vue";
import BaseButton from "@/components/ui/base/BaseButton.vue";
import CreateUserModal from "./CreateUserModal.vue";
import ChangePassword from "./ChangePassword.vue";
const selectedRole = ref("");
const selectedStatus = ref("");
const showCreateModal = ref(false);
const showChangePassModal = ref(false);

const handleCreateUser = async (data) => {
  // API here
};
const handleChangePassword = async (data) => {
  // API here
};
const userCards = [
  {
    kh_title: "អ្នកប្រើប្រាស់សរុប",
    en_title: "Total Users",
    value: 1250,
    icon: "bi bi-people-fill",
    color: "primary",
  },

  {
    kh_title: "អ្នកគ្រប់គ្រងទាំងអស់",
    en_title: "Total Admins",
    value: 35,
    icon: "bi bi-person-gear",
    color: "success",
  },

  {
    kh_title: "គ្រូបង្រៀនទាំងអស់",
    en_title: "Total Teachers",
    value: 86,
    icon: "bi bi-person-workspace",
    color: "warning",
  },
];
const columns = [
  {
    key: "name",
    label: "ឈ្មោះ",
  },

  {
    key: "email",
    label: "អ៊ីមែល",
  },
  {
    key: "role",
    label: "តួនាទី",
  },
  {
    key: "status",
    label: "ស្ថានភាព",
  },
  {
    key: "created_at",
    label: "កាលបរិច្ឆេទ",
  },
   {
    key: "last_login",
    label: "ចូលចុងក្រោយ",
  },
];


const students = ref([
  {
    id: 1,
    name: "យឹម ស្រីយ៉ឺ",
    email: "sreyyer@example.com",
    role: "Admin",
    status: "Active",
    created_at: "12/03/2026",
    last_login: "12/03/2026 9:02",
  },
  {
    id: 2,
    name: "សុខ ដារ៉ា",
    email: "dara@example.com",
    role: "Teacher",
    status: "Active",
    created_at: "20 Aug 2026",
    last_login: "12/03/2026 9:02",
  },
  {
    id: 3,
    name: "ចាន់ វណ្ណា",
    email: "vanna@example.com",
    role: "Teacher",
    status: "Inactive",
    created_at: "19 Aug 2026",
    last_login: "12/03/2026 9:02",
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
    label: "ទាំងអស់",
  },
  {
    value: "active",
    label: "សកម្ម",
  },
  {
    value: "inactive",
    label: "អសកម្ម",
  },
];
const RoleOptions = [
  {
    value: "",
    label: "តូនាទីទាំងអស់",
  },
  {
    value: "Admin",
    label: "អ្នកគ្រប់គ្រង",
  },
  {
    value: "Teeacher",
    label: "គ្រូបង្រៀន",
  },
];

const loading = ref(false);
</script>