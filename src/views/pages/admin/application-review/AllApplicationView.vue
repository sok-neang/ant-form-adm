<template>
  <div class="container-fluid">
    <BaseTable
    :columns="columns"
    :rows="students"
    :pagination="pagination"
    :loading="loading"
    :show-actions="true"
    @page-change="handlePageChange"
    >
    <template #search-filter>
      <!-- Search Box -->
      <div class="search-box position-relative">
        <i class="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
        <input 
          type="text" 
          v-model="searchQuery" 
          class="form-control rounded-pill border-success ps-5" 
          placeholder="Search" 
          style="width: 250px;"
        >
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
            custom-class="text-success border-2 border-success bg-transparent"
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
      </div>
    </template>
    </BaseTable>
  </div>
</template>
<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import BaseTable from "@/components/ui/base/BaseTable.vue";
import BaseSelect from "@/components/ui/base/BaseSelect.vue";
import BaseButton from "@/components/ui/base/BaseButton.vue";
import { shiftOptions, specializationOptions } from "@/constants/options";
import { useApplicationList } from "@/composable/application/all submission/useapplicationList";

const router = useRouter();
const selectedShift = ref("");
const selectedTrack = ref("");
const searchQuery = ref("");

const {
  loading,
  students,
  totalSubmissions,
  pagination,
  fetchSubmissions,
} = useApplicationList();

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
    created_at: "newest",
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