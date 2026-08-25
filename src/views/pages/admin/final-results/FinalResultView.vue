<template>
  <div class="container-fluid">
    <BaseTable
    :columns="columns"
    :rows="students"
    :pagination="pagination"
    :loading="loading"
    :show-actions="true"
    >
    <template #search-filter>
      <p class="">ចំនួនសិស្សសម្រាំងសរុប <span class="text-success fw-bold">១០០</span> នាក់</p>
        <!-- Filters / Dropdown -->
        <div class="d-flex align-items-center gap-2">
            <BaseSelect
                v-model="selectedRole"
                :options="resultStatusOptions"
                option-label="label"
                option-value="value"
                placeholder="ជ្រើសរើសស្ថានភាព"
                :clearable="false"
                style="width: 150px"
            />
            <BaseSelect
                v-model="selectedRole"
                :options="scoreLevelOptions"
                option-label="label"
                option-value="value"
                placeholder="ជ្រើសរើសពេល"
                :clearable="false"
                style="width: 150px"
            />
           <BaseSelect
           v-model="selectedRole"
            :options="shiftOptions"
            option-label="label"
            option-value="value"
            placeholder="ជ្រើសរើសពេល"
            :clearable="false"
            style="width: 150px"
            />
          <BaseSelect
           v-model="selectedStatus"
            :options="specializationOptions"
            option-label="label"
            option-value="value"
            placeholder="ជ្រើសរើសមុខជំនាញ"
            :clearable="false"
            style="width: 190px"
            />
          <BaseButton
            type="submit"
            variant=""
            custom-class="bg-primary text-light"
            @click=""
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
          color: row.skill === 'Web Development' ? '#357867' : '#6f42c1',
          backgroundColor:
            row.skill === 'Web Development'
              ? 'rgba(53, 120, 103, 0.12)'
              : 'rgba(111, 66, 193, 0.12)',
        }"
      >
        {{ row.skill }}
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
    <template #actions>
    <div class="d-flex justify-content-start align-items-center gap-2">
        <!-- VIEW -->
          <button v-if="activeTab != 'login'"
            type="button"
            class="btn action-btn action-view"
            title="មើលលម្អិត"
            @click="handleView(row)"
          >
            <i class="bi bi-eye-fill"></i>
          </button>
    </div>
    </template>
    </BaseTable>
  </div>
</template>
<script setup>
import { ref } from "vue";
import BaseTable from "@/components/ui/base/BaseTable.vue";
import BaseSelect from "@/components/ui/base/BaseSelect.vue";
import BaseButton from "@/components/ui/base/BaseButton.vue";
import {shiftOptions, specializationOptions, scoreLevelOptions, resultStatusOptions} from "@/constants/options"
const selectedRole = ref("");
const selectedStatus = ref("");
const showCreateModal = ref(false);

const columns = [
  {
    key: "id",
    label: "#",
  },

  {
    key: "name",
    label: "ឈ្មោះសិស្ស",
  },
  {
    key: "gender",
    label: "ភេទ",
  },
  {
    key: "year",
    label: "និស្សិតឆ្នាំ",
  },
  {
    key: "skill",
    label: "ជំនាញ",
  },
   {
    key: "study_shift",
    label: "វេនសិក្សា",
  },

  {
    key: "total_score",
    label: "ពិន្ទុសរុប",
  },
];
const students = [
  {
    id: 1,
    name: "យឹម ស្រីយ៉ឺ",
    gender: "ស្រី",
    year: "ឆ្នាំទី 1",
    skill: "Web Development",
    study_shift: "វេនព្រឹក",
    score_technology: 85,
    score_attendance: 95,
    total_score: 90,
  },
  {
    id: 2,
    name: "សុខ ដារ៉ា",
    gender: "ប្រុស",
    year: "ឆ្នាំទី 2",
    skill: "Mobile App",
    study_shift: "វេនល្ងាច",
    score_technology: 48,
    score_attendance: 28,
    total_score: 38,
  },
  {
    id: 3,
    name: "ចាន់ វណ្ណា",
    gender: "ប្រុស",
    year: "ឆ្នាំទី 1",
    skill: "Web Development",
    study_shift: "វេនព្រឹក",
    score_technology: 62,
    score_attendance: 65,
    total_score: 60,
  },
  {
    id: 4,
    name: "លី សុភា",
    gender: "ស្រី",
    year: "ឆ្នាំទី 3",
    skill: "Mobile App",
    study_shift: "វេនល្ងាច",
    score_technology: 88,
    score_attendance: 20,
    total_score: 91,
  },
  {
    id: 5,
    name: "ហេង វិសាល",
    gender: "ប្រុស",
    year: "ឆ្នាំទី 2",
    skill: "Web Development",
    study_shift: "វេនព្រឹក",
    score_technology: 70,
    score_attendance: 82,
    total_score: 96,
  },
];
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

const loading = ref(false);
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
  color: #357867 !important;
  background-color: rgba(53, 120, 103, 0.12) !important;
}</style>