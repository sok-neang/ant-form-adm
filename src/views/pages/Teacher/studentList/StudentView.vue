<template>
  <div class="container-fluid">
    <div class="row g-3 mb-4">
      <BaseCard v-for="card in studentCards">
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
    <BaseTable :columns="columns" :rows="students" :pagination="pagination" :loading="loading" :show-actions="true">
      <template #search-filter>
        <!-- Filters / Dropdown -->
        <div class="d-flex align-items-center gap-2 mb-4">
          <button v-for="tab in studentTabs" :key="tab.key" type="button"
            class="btn student-tab d-flex align-items-center gap-2" :class="{ active: activeTab === tab.key }"
            @click="activeTab = tab.key">
            <i :class="tab.icon"></i>
            <span>{{ tab.label }}</span>

            <span class="badge rounded-pill"
              :class="activeTab === tab.key ? 'bg-white text-primary' : 'bg-light text-muted'">
            </span>
          </button>
        </div>
        <div class="d-flex align-items-center gap-2">
          <BaseSelect v-model="selectedRole" :options="scoreLevelOptions" option-label="label" option-value="value"
            placeholder="ជ្រើសរើសពេល" :clearable="false" style="width: 150px" />
          <BaseSelect v-model="selectedRole" :options="shiftOptions" option-label="label" option-value="value"
            placeholder="ជ្រើសរើសពេល" :clearable="false" style="width: 150px" />

        </div>
      </template>
      <template #cell-skill="{ row }">
        <span class="badge rounded-pill px-3 py-2" :style="{
          color: row.skill === 'Web Development' ? '#357867' : '#6f42c1',
          backgroundColor:
            row.skill === 'Web Development'
              ? 'rgba(53, 120, 103, 0.12)'
              : 'rgba(111, 66, 193, 0.12)',
        }">
          {{ row.skill }}
        </span>
      </template>
      <!-- Technology Score -->

      <template #cell-score_technology="{ row }">
        <span class="badge rounded-pill px-3 py-2" :class="row.score_technology < 50
            ? 'score-fail'
            : row.score_technology < 70
              ? 'score-medium'
              : 'score-good'
          ">
          {{ row.score_technology }}
        </span>
      </template>

      <!-- Attendance Score -->
      <template #cell-score_attendance="{ row }">

        <span class="badge rounded-pill px-3 py-2" :class="row.score_attendance < 50
            ? 'score-fail'
            : row.score_attendance < 70
              ? 'score-medium'
              : 'score-good'
          ">
          {{ row.score_attendance }}
        </span>
      </template>
      <!-- Total score  -->
      <template #cell-total_score="{ row }">
        <span class="badge rounded-pill px-3 py-2 fw-bold" :class="row.total_score < 50
            ? 'score-fail'
            : row.total_score < 70
              ? 'score-medium'
              : 'score-good'
          ">
          {{ row.total_score }}
        </span>
      </template>
      <template #actions>
        <div class="d-flex justify-content-start align-items-center gap-2">
          <!-- VIEW -->
          <button v-if="activeTab != 'login'" type="button" class="btn action-btn action-view" title="មើលលម្អិត"
            @click="handleView(row)">
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
import BaseCard from "@/components/ui/base/BaseCard.vue";

import BaseButton from "@/components/ui/base/BaseButton.vue";
import { shiftOptions, specializationOptions, scoreLevelOptions } from "@/constants/options"
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
    key: "score_technology",
    label: "ពិន្ទុបចេ្ចកទេស",
  },
  {
    key: "score_attendance",
    label: "ពិន្ទុវត្តមាន",
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
const studentCards = [
  {
    kh_title: "សិស្សសរុប",
    en_title: "Total Students",
    value: 1250,
    icon: "bi bi-people-fill",
    color: "primary",
  },

  {
    kh_title: "បានវាយតម្លៃរួច",
    en_title: "Evaluated Students",
    value: 35,
    icon: "bi bi-person-check-fill",
    color: "success",
  },

  {
    kh_title: "មិនទាន់វាយតម្លៃ",
    en_title: "Pending Evaluation",
    value: 86,
    icon: "bi bi-person-exclamation",
    color: "warning",
  },
];
const activeTab = ref("all");
const studentTabs = [
  {
    key: "all",
    label: "សិស្សសរុប",
    icon: "bi bi-people-fill",
  },
  {
    key: "evaluated",
    label: "បានវាយតម្លៃរួច",
    icon: "bi bi-person-check-fill",
  },
  {
    key: "pending",
    label: "មិនទាន់វាយតម្លៃ",
    icon: "bi bi-person-exclamation",
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
