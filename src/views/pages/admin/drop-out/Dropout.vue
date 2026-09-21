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
            @click="handleView(row)"
          >
            <i class="bi bi-eye"></i>
          </button>
        </div>
      </template>
    </BaseTable>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import BaseTable from "@/components/ui/base/BaseTable.vue";
import BaseInput from "@/components/ui/base/BaseInput.vue";
import BaseSelect from "@/components/ui/base/BaseSelect.vue";
import { shiftOptions, specializationOptions } from "@/constants/options";
import { useDropout } from "@/composable/application/dropout/useDropout";
import { useStatistic } from "@/composable/dashboard/useStatistic";
const router = useRouter();
const statistic = useStatistic();
const total_student = ref(0);
onMounted(async() => {
  await statistic.getStatsUser();
  total_student.value = statistic.statsData.value?.submissions?.total;
})
const selectedShift = ref("");
const selectedSpecialization = ref("");
const searchQuery = ref("");

const {
  loading,
  students,
  totalSubmissions,
  pagination,
  fetchSubmissions,
} = useDropout();

const handleView = (row) => {
  router.push(`/dropout-detail/${row.id}`);
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
  
  if (selectedShift.value) params.shift = selectedShift.value;
  if (selectedSpecialization.value) params.program = selectedSpecialization.value;
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

watch([selectedShift, selectedSpecialization], () => {
  loadSubmissions(1);
});

onMounted(() => {
  loadSubmissions();
});
</script>
