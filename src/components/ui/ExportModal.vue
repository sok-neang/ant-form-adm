<template>
  <BaseModal
    :show="isOpenModel"
    :show-close="false"
    :close-on-backdrop="!isDownloading"
    size="md"
    @close="handleClose"
  >
    <!-- ================= MODAL HEADER ================= -->
    <template #header>
      <div class="d-flex align-items-center justify-content-between w-100 pb-2 border-bottom">
        <div class="d-flex align-items-center gap-3">
          <!-- Download Icon Box -->
          <div class="export-icon-box d-flex align-items-center justify-content-center flex-shrink-0">
            <i class="bi bi-download"></i>
          </div>
          <!-- Title & Subtitle -->
          <div>
            <h5 class="fw-bold mb-1 export-modal-title">ទាញយកទិន្នន័យ</h5>
            <p class="mb-0 text-muted export-modal-subtitle">
              កំណត់ក្រុម និងទាញយកទិន្នន័យឥឡូវនេះ
            </p>
          </div>
        </div>

        <!-- Custom Close Button -->
        <button
          type="button"
          class="btn-close-export d-flex align-items-center justify-content-center"
          aria-label="Close"
          :disabled="isDownloading"
          @click="handleClose"
        >
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
    </template>

    <!-- ================= MODAL BODY ================= -->
    <!-- 1. SUCCESS VIEW -->
    <div v-if="isSuccess" class="export-success-container d-flex flex-column align-items-center text-center py-3">
      <!-- Success Checkmark Badge -->
      <div class="export-success-icon-box d-flex align-items-center justify-content-center mb-3">
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#357867"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>

      <!-- Heading -->
      <h4 class="fw-bold mb-2 export-success-title">ទាញយកបានជោគជ័យ</h4>

      <!-- Description with bold highlight -->
      <p class="export-success-desc mb-4">
        <template v-if="isFinalChoice">
          ទិន្នន័យបេក្ខជនជ័យលាភី <span class="fw-bold export-success-highlight">សរុប {{ finalTotalCount }} នាក់</span> (ជាប់ {{ passCount }} នាក់, បម្រុង {{ effectiveReservedCount }} នាក់) ត្រូវបានទាញយក
        </template>
        <template v-else>
          ទិន្នន័យ <span class="fw-bold export-success-highlight">Group {{ selectedGroupIndex }}: {{ activeRangeText }}</span> ({{ activeRowCount }} ជួរ) ត្រូវបានទាញយក
        </template>
      </p>

      <!-- 4 Details Cards Grid -->
      <div class="row g-2 w-100 mb-2">
        <div class="col-3">
          <div class="export-stat-card">
            <div class="export-stat-label">ជំនាញ</div>
            <div class="export-stat-value text-truncate">{{ selectedProgramLabel }}</div>
          </div>
        </div>
        <div class="col-3">
          <div class="export-stat-card">
            <div class="export-stat-label">វេន</div>
            <div class="export-stat-value text-truncate">{{ selectedShiftLabel }}</div>
          </div>
        </div>
        <div class="col-3">
          <div class="export-stat-card">
            <div class="export-stat-label">ស្ថានភាព</div>
            <div class="export-stat-value text-truncate">{{ selectedStatusLabel }}</div>
          </div>
        </div>
        <div class="col-3">
          <div class="export-stat-card">
            <div class="export-stat-label">{{ isFinalChoice ? 'ប្រភេទ' : 'ក្រុម' }}</div>
            <div class="export-stat-value text-truncate">{{ isFinalChoice ? 'ជាប់ & បម្រុង' : `G${selectedGroupIndex}` }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. FORM VIEW -->
    <div v-else class="export-modal-content py-2">
      <!-- Total Available Students Banner -->
      <!-- A. Final Export Banner -->
      <div
        v-if="isFinalChoice"
        class="export-total-banner export-total-banner-final p-3 rounded-4 mb-3"
      >
        <div class="d-flex align-items-center justify-content-between mb-2">
          <div class="d-flex align-items-center gap-2">
            <div class="export-banner-icon bg-warning-subtle text-warning-emphasis">
              <i class="bi bi-award-fill"></i>
            </div>
            <div>
              <span class="fw-bold fs-6 text-dark">ទិន្នន័យលទ្ធផលចុងក្រោយ</span>
              <span class="text-muted small ms-1">(ជាប់ និងបម្រុង)</span>
            </div>
          </div>
          <div class="d-flex align-items-center gap-1">
            <span v-if="isLoadingCounts" class="spinner-border spinner-border-sm text-secondary me-1" role="status"></span>
            <span class="badge bg-dark-subtle text-dark fw-bold px-2 py-1">
              សរុប {{ passCount + reservedCount }} នាក់
            </span>
          </div>
        </div>

        <div class="row g-2">
          <div class="col-6">
            <div class="p-2 rounded-3 bg-white border d-flex align-items-center justify-content-between">
              <div class="d-flex align-items-center gap-2">
                <span class="status-indicator bg-success"></span>
                <span class="small fw-semibold text-muted">ជាប់ (Pass)</span>
              </div>
              <span class="fw-bold text-success">{{ passCount }} នាក់</span>
            </div>
          </div>
          <div class="col-6">
            <div class="p-2 rounded-3 bg-white border d-flex align-items-center justify-content-between">
              <div class="d-flex align-items-center gap-2">
                <span class="status-indicator bg-warning"></span>
                <span class="small fw-semibold text-muted">បម្រុង (Reserved)</span>
              </div>
              <span class="fw-bold text-warning-emphasis">{{ reservedCount }} នាក់</span>
            </div>
          </div>
        </div>
      </div>

      <!-- B. Shortlist Export Banner -->
      <div
        v-else
        class="export-total-banner p-3 rounded-4 mb-3 d-flex align-items-center justify-content-between"
      >
        <div class="d-flex align-items-center gap-3">
          <div class="export-banner-icon bg-success-subtle text-success">
            <i class="bi bi-people-fill"></i>
          </div>
          <div>
            <div class="small text-muted fw-medium mb-1">
              បេក្ខជន Shortlist សរុបដែលអាចទាញយក
            </div>
            <div class="d-flex align-items-baseline gap-2">
              <span class="fw-bold text-success fs-5">{{ activeTotalCount }}</span>
              <span class="text-dark fw-semibold small">នាក់</span>
              <span class="text-muted small ms-1">
                (ចែកជា <strong class="text-dark">{{ computedGroups.length }}</strong> ក្រុម · {{ groupSize }} នាក់/ក្រុម)
              </span>
            </div>
          </div>
        </div>
        <div>
          <span v-if="isLoadingCounts" class="spinner-border spinner-border-sm text-success" role="status"></span>
        </div>
      </div>

      <!-- 1. Students Per Group Input & 2. Select Group List (Shortlist Only) -->
      <template v-if="!isFinalChoice">
        <!-- 1. Students Per Group Input -->
        <div class="mb-3">
          <label class="form-label fw-bold export-label mb-2 d-flex align-items-center justify-content-between">
            <span>ចំនួននៅក្នុងមួយក្រុម</span>
            <span class="text-muted fw-normal small">
              សរុប៖ <strong class="text-success">{{ activeTotalCount }}</strong> នាក់
            </span>
          </label>
          <div class="position-relative">
            <input
              type="number"
              min="1"
              :max="Math.max(1, activeTotalCount)"
              v-model.number="groupSize"
              class="form-control export-input shadow-none"
              placeholder="20"
            />
          </div>
        </div>

        <!-- 2. Select Group List -->
        <div class="mb-3">
          <label class="form-label fw-bold export-label mb-2 d-flex align-items-center justify-content-between">
            <span>ជ្រើសក្រុម <span class="text-muted fw-normal">({{ groupSize }} ជួរ/ក្រុម)</span></span>
            <span class="text-muted fw-normal small">
              មាន <strong class="text-success">{{ computedGroups.length }}</strong> ក្រុម
            </span>
          </label>
          <div class="group-pills-container d-flex gap-2 overflow-x-auto pb-2">
            <button
              v-for="grp in computedGroups"
              :key="grp.index"
              type="button"
              class="group-pill-btn d-flex flex-column align-items-center justify-content-center flex-shrink-0"
              :class="{ active: selectedGroupIndex === grp.index }"
              @click="selectedGroupIndex = grp.index"
            >
              <span class="group-pill-name">G{{ grp.index }}</span>
              <span class="group-pill-range">{{ grp.rangeText }}</span>
            </button>
          </div>
        </div>
      </template>

      <!-- 3. Filter Selects: ជំនាញ (Skill), វេន (Shift), ស្ថានភាព (Status) -->
      <div class="row g-2 mb-3">
        <!-- ជំនាញ (Skill) -->
        <div class="col-4">
          <label class="form-label fw-bold export-label mb-1">
            ជំនាញ
          </label>
          <BaseSelect
            v-model="selectedProgram"
            :options="programOptions"
            option-label="label"
            option-value="value"
            :clearable="false"
            :searchable="false"
          />
        </div>

        <!-- វេន (Shift) -->
        <div class="col-4">
          <label class="form-label fw-bold export-label mb-1">
            វេន
          </label>
          <BaseSelect
            v-model="selectedShift"
            :options="shiftOptions"
            option-label="label"
            option-value="value"
            :clearable="false"
            :searchable="false"
          />
        </div>

        <!-- ស្ថានភាព (Status) -->
        <div class="col-4">
          <label class="form-label fw-bold export-label mb-1">
            ស្ថានភាព
          </label>
          <BaseSelect
            v-model="selectedStatus"
            :options="statusOptions"
            option-label="label"
            option-value="value"
            :clearable="false"
            :searchable="false"
          />
        </div>
      </div>

      <!-- 4. Final Mode: Optional Reserve Count Limit -->
      <div v-if="isFinalChoice" class="mb-3">
        <label class="form-label fw-bold export-label mb-1 d-flex align-items-center justify-content-between">
          <span>កំណត់ចំនួនបេក្ខជនបម្រុង (Reserve Limit)</span>
          <span class="text-muted fw-normal small">
            បម្រុងសរុប៖ <strong class="text-warning-emphasis">{{ reservedCount }}</strong> នាក់
          </span>
        </label>
        <div class="position-relative">
          <input
            type="number"
            min="0"
            :max="reservedCount || undefined"
            v-model.number="reserveLimit"
            class="form-control export-input shadow-none"
            :placeholder="`ទាំងអស់ (${reservedCount} នាក់)`"
          />
        </div>
        <div class="form-text text-muted small mt-1">
          <i class="bi bi-info-circle me-1"></i>កំណត់ចំនួនបេក្ខជនបម្រុងដែលត្រូវទាញយក (ទុកទទេ = ទាំងអស់ {{ reservedCount }} នាក់)
        </div>
      </div>

      <!-- 5. Course Requirement Dates (កាលបរិច្ឆេទចូលរៀន ២សប្ដាហ៍) - Shortlist Only -->
      <div v-if="!isFinalChoice" class="mb-3">
        <label class="form-label fw-bold export-label mb-1 d-flex align-items-center justify-content-between">
          <span>កាលបរិច្ឆេទចូលរៀន ២សប្ដាហ៍</span>
          <span class="text-muted fw-normal small">វគ្គសិក្សាសាកល្បង (2 Weeks Course)</span>
        </label>
        <div class="row g-2">
          <!-- Start Date -->
          <div class="col-6">
            <label class="form-label small text-muted mb-1">ថ្ងៃចាប់ផ្ដើម (Start Date)</label>
            <el-date-picker
              v-model="startDate"
              type="date"
              format="DD MMM YYYY"
              value-format="YYYY-MM-DD"
              placeholder="ថ្ងៃចាប់ផ្ដើម"
              :clearable="true"
              class="w-100 export-date-picker"
              popper-class="export-date-popper"
              @change="onStartDateChange"
            />
          </div>

          <!-- End Date -->
          <div class="col-6">
            <label class="form-label small text-muted mb-1">ថ្ងៃបញ្ចប់ (End Date)</label>
            <el-date-picker
              v-model="endDate"
              type="date"
              format="DD MMM YYYY"
              value-format="YYYY-MM-DD"
              placeholder="ថ្ងៃបញ្ចប់"
              :clearable="true"
              class="w-100 export-date-picker"
              popper-class="export-date-popper"
            />
          </div>
        </div>
      </div>

      <!-- 5. Export Date (កាលបរិច្ឆេទលើឯកសារ) -->
      <div class="mb-3">
        <label class="form-label fw-bold export-label mb-1 d-flex align-items-center justify-content-between">
          <span>កាលបរិច្ឆេទលើឯកសារ</span>
          <span class="text-muted fw-normal small">កាលបរិច្ឆេទទាញយក / ហត្ថលេខា</span>
        </label>
        <el-date-picker
          v-model="exportDate"
          type="date"
          format="DD MMM YYYY"
          value-format="YYYY-MM-DD"
          placeholder="ជ្រើសរើសកាលបរិច្ឆេទ"
          :clearable="false"
          class="w-100 export-date-picker"
          popper-class="export-date-popper"
        />
      </div>

      <!-- 6. Summary Preview Card -->
      <div class="export-summary-card d-flex align-items-center justify-content-between p-3 rounded-4 mb-3">
        <div class="d-flex align-items-center gap-3">
          <!-- Device / Monitor Icon -->
          <div class="summary-icon-box d-flex align-items-center justify-content-center flex-shrink-0">
            <i class="bi bi-display"></i>
          </div>
          <!-- Info -->
          <div>
            <div class="summary-title fw-bold">ទិន្នន័យអ្នកទាញយក</div>
            <div class="summary-subtitle text-muted">
              <template v-if="isFinalChoice">
                លទ្ធផលចុងក្រោយ (Pass {{ passCount }} + Reserved {{ effectiveReservedCount }}) · {{ selectedProgramLabel }}
              </template>
              <template v-else>
                Group {{ selectedGroupIndex }} · ជួរ {{ activeRangeText }}
              </template>
            </div>
          </div>
        </div>
        <!-- Right Counter -->
        <div class="text-end">
          <div class="summary-count fw-bold">
            {{ isFinalChoice ? finalTotalCount : activeRowCount }}
          </div>
          <div class="summary-unit text-muted">
            {{ isFinalChoice ? 'នាក់' : 'ជួរ' }}
          </div>
        </div>
      </div>

      <!-- 5. Optional Format Switcher (PDF / DOCX) -->
      <div class="d-flex align-items-center justify-content-between px-1 mb-1">
        <span class="small text-muted fw-semibold">ទម្រង់ឯកសារ (Format):</span>
        <div class="btn-group btn-group-sm format-toggle-group" role="group">
          <button
            type="button"
            class="btn format-btn"
            :class="selectedFormat === 'pdf' ? 'btn-format-active' : 'btn-format-inactive'"
            @click="selectedFormat = 'pdf'"
          >
            <i class="bi bi-file-earmark-pdf me-1 text-danger"></i> PDF
          </button>
          <button
            type="button"
            class="btn format-btn"
            :class="selectedFormat === 'docx' ? 'btn-format-active' : 'btn-format-inactive'"
            @click="selectedFormat = 'docx'"
          >
            <i class="bi bi-file-earmark-word me-1 text-primary"></i> Word
          </button>
        </div>
      </div>
    </div>

    <!-- ================= MODAL FOOTER ================= -->
    <template #footer>
      <!-- Success Action -->
      <div v-if="isSuccess" class="w-100 pt-1">
        <button
          type="button"
          class="btn btn-export-submit w-100 py-2 fs-6 fw-bold"
          @click="handleClose"
        >
          រួចរាល់
        </button>
      </div>

      <!-- Normal Form Actions -->
      <div v-else class="d-flex align-items-center gap-3 w-100 pt-2">
        <!-- Cancel Button -->
        <button
          type="button"
          class="btn btn-export-cancel w-50"
          :disabled="isDownloading"
          @click="handleClose"
        >
          បោះបង់
        </button>

        <!-- Download Button -->
        <button
          type="button"
          class="btn btn-export-submit w-50 d-inline-flex align-items-center justify-content-center gap-2"
          :disabled="isDownloading"
          @click="handleDownload"
        >
          <span v-if="isDownloading" class="spinner-border spinner-border-sm" role="status"></span>
          <i v-else class="bi bi-download"></i>
          <span>{{ isDownloading ? 'កំពុងទាញយក...' : 'ទាញយក' }}</span>
        </button>
      </div>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import BaseModal from '@/components/ui/base/BaseModal.vue';
import BaseSelect from '@/components/ui/base/BaseSelect.vue';
import { downloadExportFile } from '@/services/export.service';
import submissionService from '@/services/submission.service';
import { useAppToast } from '@/composable/useAppToast';

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  isOpen: {
    type: Boolean,
    default: false,
  },
  exportType: {
    type: String,
    default: 'shortlist', // 'shortlist' | 'final'
  },
  initialProgram: {
    type: String,
    default: 'MOBILE_APP',
  },
  initialShift: {
    type: String,
    default: 'MORNING',
  },
  totalCount: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits([
  'update:show',
  'update:isOpen',
  'close',
  'success',
]);

const toast = useAppToast();
const isDownloading = ref(false);
const isSuccess = ref(false);
const isLoadingCounts = ref(false);

// Live candidate counts from server
const shortlistCount = ref(props.totalCount || 0);
const passCount = ref(props.exportType === 'final' ? props.totalCount || 0 : 0);
const reservedCount = ref(0);

// Dropdown Options
const programOptions = [
  { value: "", label: "ទាំងអស់" },
  { value: "MOBILE_APP", label: "Mobile" },
  { value: "WEB_DEVELOPMENT", label: "Web" },
];

const shiftOptions = [
  { value: "", label: "ទាំងអស់" },
  { value: "MORNING", label: "ព្រឹក" },
  { value: "AFTERNOON", label: "រសៀល" },
];

const statusOptions = [
  { value: "shortlist", label: "ជ្រើសសម្រាំង" },
  { value: "final", label: "លទ្ធផលចុងក្រោយ" },
];

// Determine if the currently chosen option is Final (contains both Pass and Reserved)
const isFinalChoice = computed(() => selectedStatus.value === 'final');

// Computed readable labels for the success summary
const selectedProgramLabel = computed(() => {
  const opt = programOptions.find((o) => o.value === selectedProgram.value);
  return opt ? opt.label : 'ទាំងអស់';
});

const selectedShiftLabel = computed(() => {
  const opt = shiftOptions.find((o) => o.value === selectedShift.value);
  return opt ? opt.label : 'ទាំងអស់';
});

const selectedStatusLabel = computed(() => {
  const opt = statusOptions.find((o) => o.value === selectedStatus.value);
  return opt ? opt.label : 'ជ្រើសសម្រាំង';
});

// Dual-prop visibility binding
const isOpenModel = computed(() => props.show || props.isOpen);

// Form States
const today = new Date().toISOString().split('T')[0];
const exportDate = ref(today);
const startDate = ref('');
const endDate = ref('');
const reserveLimit = ref(null);
const groupSize = ref(20);
const selectedGroupIndex = ref(1);
const selectedProgram = ref(props.initialProgram || 'MOBILE_APP');
const selectedShift = ref(props.initialShift || 'MORNING');
const selectedStatus = ref(props.exportType === 'final' ? 'final' : 'shortlist');
const selectedFormat = ref('pdf');

// Effective reserved count based on optional admin limit
const effectiveReservedCount = computed(() => {
  const limit = reserveLimit.value;
  if (limit !== null && limit !== undefined && limit !== '' && !isNaN(Number(limit))) {
    const num = Number(limit);
    if (num >= 0) return Math.min(num, reservedCount.value);
  }
  return reservedCount.value;
});

const finalTotalCount = computed(() => {
  return passCount.value + effectiveReservedCount.value;
});

// Auto-fill end date to +14 days if not manually set
const onStartDateChange = (val) => {
  if (val && !endDate.value) {
    const d = new Date(val);
    d.setDate(d.getDate() + 14);
    endDate.value = d.toISOString().split('T')[0];
  }
};

// Fetch live total candidate counts according to selected program and shift
const fetchTotalCounts = async () => {
  isLoadingCounts.value = true;
  try {
    const params = { limit: 1 };
    if (selectedProgram.value) params.program = selectedProgram.value;
    if (selectedShift.value) params.shift = selectedShift.value;

    const [shortlistRes, passRes, reservedRes] = await Promise.allSettled([
      submissionService.getShortlist(params),
      submissionService.getPassFinalResult(params),
      submissionService.getReservedFinalResult(params),
    ]);

    if (shortlistRes.status === 'fulfilled' && shortlistRes.value?.data?.success) {
      const meta = shortlistRes.value.data.data?.pagination;
      shortlistCount.value = meta?.totalSubmissions ?? meta?.total ?? 0;
    }
    if (passRes.status === 'fulfilled' && passRes.value?.data?.success) {
      const meta = passRes.value.data.data?.pagination;
      passCount.value = meta?.totalSubmissions ?? meta?.total ?? 0;
    }
    if (reservedRes.status === 'fulfilled' && reservedRes.value?.data?.success) {
      const meta = reservedRes.value.data.data?.pagination;
      reservedCount.value = meta?.totalSubmissions ?? meta?.total ?? 0;
    }
  } catch (err) {
    console.error('Error fetching candidate counts for export:', err);
  } finally {
    isLoadingCounts.value = false;
  }
};

// Re-fetch counts when filters change
watch([selectedProgram, selectedShift], () => {
  if (isOpenModel.value) {
    fetchTotalCounts();
  }
});

// Active total count based on active status selection
const activeTotalCount = computed(() => {
  if (isFinalChoice.value) {
    return finalTotalCount.value;
  }
  return shortlistCount.value;
});

// Reset / sync state when modal opens
watch(
  () => isOpenModel.value,
  (open) => {
    if (open) {
      isSuccess.value = false;
      if (props.initialProgram !== undefined) selectedProgram.value = props.initialProgram;
      if (props.initialShift !== undefined) selectedShift.value = props.initialShift;
      selectedStatus.value = props.exportType === 'final' ? 'final' : 'shortlist';
      selectedGroupIndex.value = 1;
      if (!groupSize.value || groupSize.value < 1) groupSize.value = 20;
      exportDate.value = today;
      startDate.value = '';
      endDate.value = '';
      reserveLimit.value = null;

      // Seed initial fallback count if available
      if (props.totalCount) {
        if (props.exportType === 'final') {
          passCount.value = props.totalCount;
        } else {
          shortlistCount.value = props.totalCount;
        }
      }
      fetchTotalCounts();
    }
  }
);

// Dynamic Group Generation dividing the actual available total students equally
const computedGroups = computed(() => {
  const size = Math.max(1, Number(groupSize.value) || 20);
  const total = activeTotalCount.value;

  if (total <= 0) {
    return [
      {
        index: 1,
        start: 1,
        end: size,
        count: 0,
        rangeText: `1–${size}`,
      },
    ];
  }

  const groupCount = Math.ceil(total / size);
  const groups = [];
  for (let i = 1; i <= groupCount; i++) {
    const start = (i - 1) * size + 1;
    const end = Math.min(i * size, total);
    const count = Math.max(0, end - start + 1);
    groups.push({
      index: i,
      start,
      end,
      count,
      rangeText: `${start}–${end}`,
    });
  }
  return groups;
});

// Clamp selected group index when groups change
watch(computedGroups, (newGroups) => {
  if (newGroups.length > 0 && selectedGroupIndex.value > newGroups.length) {
    selectedGroupIndex.value = 1;
  }
});

// Active group details
const activeRangeText = computed(() => {
  const grp = computedGroups.value.find((g) => g.index === selectedGroupIndex.value);
  if (grp) return grp.rangeText;
  const size = Number(groupSize.value) || 20;
  return `1–${size}`;
});

const activeRowCount = computed(() => {
  const grp = computedGroups.value.find((g) => g.index === selectedGroupIndex.value);
  if (grp) return grp.count;
  return Math.min(Number(groupSize.value) || 20, activeTotalCount.value);
});

const handleClose = () => {
  if (!isDownloading.value) {
    emit('update:show', false);
    emit('update:isOpen', false);
    emit('close');
    setTimeout(() => {
      isSuccess.value = false;
    }, 250);
  }
};

// Trigger download
const handleDownload = async () => {
  isDownloading.value = true;
  try {
    const targetType = isFinalChoice.value ? 'final' : 'shortlist';

    const payload = {
      format: selectedFormat.value,
      program: selectedProgram.value || undefined,
      shift: selectedShift.value || undefined,
      exportDate: exportDate.value || undefined,
    };

    if (targetType === 'shortlist') {
      payload.groupSize = Number(groupSize.value) || 20;
      payload.groupIndex = Number(selectedGroupIndex.value) || 1;
      if (startDate.value) payload.startDate = startDate.value;
      if (endDate.value) payload.endDate = endDate.value;
    }

    if (targetType === 'final') {
      const limit = reserveLimit.value;
      if (limit !== null && limit !== undefined && limit !== '' && !isNaN(Number(limit))) {
        payload.reserveLimit = Number(limit);
      }
    }

    const result = await downloadExportFile(targetType, payload);
    emit('success', result);
    isSuccess.value = true;
  } catch (err) {
    toast.error(err.message || 'បរាជ័យក្នុងការទាញយកឯកសារ');
  } finally {
    isDownloading.value = false;
  }
};
</script>

<style scoped>
/* ====================================
   HEADER STYLES
   ==================================== */
.export-icon-box {
  width: 44px;
  height: 44px;
  background-color: #e8f5f1;
  border-radius: 12px;
  color: #357867;
  font-size: 20px;
}

.export-modal-title {
  color: #2d6a4f;
  font-size: 1.15rem;
}

.export-modal-subtitle {
  font-size: 0.82rem;
  color: #718096 !important;
}

.btn-close-export {
  width: 32px;
  height: 32px;
  background-color: #e8f5f1;
  border: none;
  border-radius: 8px;
  color: #357867;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-close-export:hover {
  background-color: #d2ebe2;
  color: #24523d;
}

/* ====================================
   TOTAL CANDIDATES BANNER
   ==================================== */
.export-total-banner {
  background: linear-gradient(135deg, #f7faf9 0%, #edf7f4 100%);
  border: 1px solid #d4ede4 !important;
}

.export-total-banner-final {
  background: linear-gradient(135deg, #fbfbfd 0%, #f4f6fa 100%);
  border: 1px solid #e2e8f0 !important;
}

.export-banner-icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

/* ====================================
   LABELS & INPUTS
   ==================================== */
.export-label {
  color: #2d3748;
  font-size: 0.88rem;
}

.export-input {
  height: 46px;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  padding: 0 16px;
  font-size: 0.95rem;
  font-weight: 500;
  color: #2d3748;
  background-color: #ffffff;
  transition: border-color 0.2s ease;
}

.export-input:focus {
  border-color: #357867;
  background-color: #ffffff;
}

/* ====================================
   ELEMENT PLUS DATE PICKER OVERRIDES
   ==================================== */
.export-date-picker {
  --el-color-primary: #357867 !important;
  --el-input-focus-border-color: #357867 !important;
  --el-input-hover-border-color: #357867 !important;
  --el-input-border-color: #e2e8f0 !important;
  height: 46px !important;
  width: 100% !important;
}

.export-date-picker :deep(.el-input__wrapper) {
  border-radius: 12px !important;
  border: 1.5px solid #e2e8f0 !important;
  box-shadow: none !important;
  outline: none !important;
  transition: all 0.2s ease !important;
  padding: 0 14px !important;
}

.export-date-picker :deep(.el-input__wrapper:hover) {
  border-color: #357867 !important;
}

.export-date-picker :deep(.el-input__wrapper.is-focus),
.export-date-picker :deep(.el-input__wrapper:focus),
.export-date-picker :deep(.el-input__wrapper:focus-within) {
  border-color: #357867 !important;
  box-shadow: 0 0 0 1px #357867 inset, 0 0 0 3px rgba(53, 120, 103, 0.12) !important;
  outline: none !important;
}

.export-date-picker :deep(.el-input__inner) {
  font-weight: 600 !important;
  color: #2d3748 !important;
  font-size: 0.92rem !important;
}

.export-date-picker :deep(.el-input__inner:focus) {
  outline: none !important;
  box-shadow: none !important;
}

.export-date-picker :deep(.el-input__prefix) {
  color: #357867 !important;
  font-size: 16px !important;
}

/* ====================================
   GROUP PILLS
   ==================================== */
.group-pills-container {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
}

.group-pill-btn {
  width: 82px;
  height: 58px;
  border-radius: 12px;
  border: 1.5px solid #edf2f7;
  background-color: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;
}

.group-pill-btn:hover {
  border-color: #a3d9c9;
  background-color: #f7faf9;
}

.group-pill-name {
  font-size: 0.95rem;
  font-weight: 700;
  color: #4a5568;
}

.group-pill-range {
  font-size: 0.72rem;
  color: #a0aec0;
}

/* Active Group Pill */
.group-pill-btn.active {
  border: 1.5px solid #357867;
  background-color: #f0f9f5;
}

.group-pill-btn.active .group-pill-name {
  color: #357867;
}

.group-pill-btn.active .group-pill-range {
  color: #357867;
  opacity: 0.85;
}

/* ====================================
   BASE SELECT DROPDOWN OVERRIDES
   ==================================== */
:deep(.base-select) {
  --bs-radius: 12px;
  --bs-border: #e2e8f0;
  --bs-focus: #357867;
  --bs-focus-ring: rgba(53, 120, 103, 0.12);
  --bs-text: #357867;
}

:deep(.base-select__group) {
  border: 1.5px solid #e2e8f0 !important;
  border-radius: 12px !important;
  transition: all 0.2s ease !important;
  background-color: #ffffff !important;
}

:deep(.base-select.is-focused .base-select__group) {
  border-color: #357867 !important;
  box-shadow: 0 0 0 3px rgba(53, 120, 103, 0.12) !important;
}

:deep(.base-select__group .ts-control) {
  font-weight: 600 !important;
  color: #357867 !important;
  font-size: 0.88rem !important;
  min-height: 44px !important;
  padding: 0 30px 0 14px !important;
  border-radius: 12px !important;
}

:deep(.base-select__chevron) {
  color: #357867 !important;
  right: 12px !important;
}

:deep(.base-select__placeholder) {
  display: none !important;
}

:deep(.ts-dropdown) {
  border-radius: 12px !important;
  border: 1px solid #e2e8f0 !important;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08) !important;
  overflow: hidden !important;
  z-index: 1060 !important;
  margin-top: 4px !important;
}

:deep(.ts-dropdown .option) {
  padding: 9px 14px !important;
  font-size: 0.88rem !important;
  font-weight: 500 !important;
  color: #2d3748 !important;
  cursor: pointer !important;
}

:deep(.ts-dropdown .option.active),
:deep(.ts-dropdown .option:hover) {
  background-color: #f0f9f5 !important;
  color: #357867 !important;
  font-weight: 600 !important;
}

:deep(.ts-dropdown .option.selected) {
  background-color: #e8f5f1 !important;
  color: #2d6a4f !important;
  font-weight: 700 !important;
}

/* ====================================
   SUMMARY CARD
   ==================================== */
.export-summary-card {
  border: 1.5px solid #d4ede4;
  background-color: #f8fcfa;
}

.summary-icon-box {
  width: 44px;
  height: 44px;
  background-color: #e2ede8;
  border-radius: 10px;
  color: #357867;
  font-size: 20px;
}

.summary-title {
  color: #357867;
  font-size: 0.95rem;
}

.summary-subtitle {
  font-size: 0.82rem;
}

.summary-count {
  color: #357867;
  font-size: 1.85rem;
  line-height: 1;
}

.summary-unit {
  font-size: 0.82rem;
}

/* ====================================
   FORMAT TOGGLE PILLS
   ==================================== */
.format-toggle-group {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  padding: 2px;
  background-color: #f8fafc;
}

.format-btn {
  font-size: 0.78rem;
  font-weight: 600;
  border-radius: 6px !important;
  padding: 3px 10px;
  border: none;
  transition: all 0.2s ease;
}

.btn-format-active {
  background-color: #ffffff !important;
  color: #2d6a4f !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

.btn-format-inactive {
  background-color: transparent !important;
  color: #718096 !important;
}

/* ====================================
   SUCCESS SCREEN STYLES
   ==================================== */
.export-success-container {
  padding: 18px 0;
}

.export-success-icon-box {
  width: 72px;
  height: 72px;
  background-color: #ecfdf5;
  border-radius: 20px;
  color: #357867;
}

.export-success-title {
  color: #2d3748;
  font-size: 1.25rem;
  letter-spacing: -0.2px;
}

.export-success-desc {
  font-size: 0.88rem;
  color: #718096;
}

.export-success-highlight {
  color: #357867;
  font-weight: 700;
}

.export-stat-card {
  background-color: #f8fafc;
  border: 1px solid #e8edf2;
  border-radius: 14px;
  padding: 12px 6px;
  text-align: center;
  transition: all 0.2s ease;
}

.export-stat-label {
  font-size: 0.82rem;
  color: #718096;
  font-weight: 500;
  margin-bottom: 4px;
}

.export-stat-value {
  font-size: 0.95rem;
  font-weight: 700;
  color: #2d3748;
}

/* ====================================
   FOOTER BUTTONS
   ==================================== */
.btn-export-cancel {
  height: 46px;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  background-color: #ffffff;
  color: #718096;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.2s ease;
}

.btn-export-cancel:hover {
  background-color: #f8f9fa;
  border-color: #cbd5e1;
  color: #4a5568;
}

.btn-export-submit {
  height: 46px;
  border: none;
  border-radius: 12px;
  background-color: #357867;
  color: #ffffff;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.2s ease;
}

.btn-export-submit:hover {
  background-color: #295f51;
  color: #ffffff;
}

.btn-export-submit:disabled,
.btn-export-cancel:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}
</style>

<style>
/* Unscoped styles for Element Plus date picker */
.export-date-popper,
.export-date-picker {
  --el-color-primary: #357867 !important;
  --el-input-focus-border-color: #357867 !important;
  --el-input-hover-border-color: #357867 !important;
  --el-datepicker-active-color: #357867 !important;
  --el-datepicker-hover-text-color: #357867 !important;
}

.export-date-popper {
  border-radius: 14px !important;
  overflow: hidden !important;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12) !important;
}

.export-date-popper .el-date-table td.current:not(.disabled) .el-date-table-cell__text {
  background-color: #357867 !important;
  color: #ffffff !important;
  font-weight: 700 !important;
  border-radius: 50% !important;
}

.export-date-popper .el-date-table td.today .el-date-table-cell__text {
  color: #357867 !important;
  font-weight: 700 !important;
}

.export-date-popper .el-date-table td.available:hover {
  color: #357867 !important;
}

.export-date-picker .el-input__wrapper.is-focus,
.export-date-picker .el-input__wrapper:focus,
.export-date-picker .el-input__wrapper:focus-within {
  border-color: #357867 !important;
  box-shadow: 0 0 0 1px #357867 inset, 0 0 0 3px rgba(53, 120, 103, 0.12) !important;
  outline: none !important;
}

.export-date-picker .el-input__inner:focus {
  outline: none !important;
}
</style>
