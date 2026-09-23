<template>
  <BaseModal
    :show="isOpenModel"
    :show-close="false"
    :close-on-backdrop="!isDownloading"
    class="export-modal-dialog-wrapper"
    @close="handleClose"
  >
    <!-- ================= MODAL HEADER ================= -->
    <template #header>
      <div class="d-flex align-items-center justify-content-between w-100 pb-2 border-bottom">
        <div class="d-flex align-items-center gap-3">
          <!-- Download Icon Box -->
          <div class="export-icon-box d-flex align-items-center justify-content-center flex-shrink-0">
            <i class="bi bi-file-earmark-arrow-down-fill"></i>
          </div>
          <!-- Title & Subtitle -->
          <div>
            <h5 class="fw-bold mb-0 export-modal-title">ទាញយកទិន្នន័យ</h5>
            <p class="mb-0 text-muted export-modal-subtitle">
              កំណត់លក្ខខណ្ឌ ចែកក្រុម និងទាញយកជាឯកសារ PDF ឬ Word
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
    <div v-if="isSuccess" class="export-success-container d-flex flex-column align-items-center text-center py-4">
      <!-- Success Checkmark Badge -->
      <div class="export-success-icon-box border border-primary-subtle bg-primary-subtle d-flex align-items-center justify-content-center mb-3">
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#2662d9"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>

      <!-- Heading -->
      <h4 class="fw-bold mb-2 export-success-title">ទាញយកបានជោគជ័យ!</h4>

      <!-- Description with bold highlight -->
      <p class="export-success-desc mb-4 px-3">
        <template v-if="selectedStatus === 'final'">
          ទិន្នន័យបេក្ខជនជ័យលាភី <span class="fw-bold export-success-highlight">សរុប {{ finalTotalCount }} នាក់</span> (ជាប់ {{ passCount }} នាក់, បម្រុង {{ effectiveReservedCount }} នាក់) ត្រូវបានទាញយកដោយជោគជ័យ។
        </template>
        <template v-else>
          ទិន្នន័យ <span class="fw-bold export-success-highlight">{{ successGroupText }}</span> ({{ activeRowCount }} នាក់) ត្រូវបានទាញយកដោយជោគជ័យ។
        </template>
      </p>

      <!-- 4 Details Cards Grid -->
      <div class="row justify-content-center w-100 mb-2 px-2">
        <div class="col-9">
          <div class="row ">
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
                <div class="export-stat-label">ទម្រង់</div>
                <div class="export-stat-value text-truncate text-uppercase">{{ selectedFormat }}</div>
              </div>
            </div>
            <div class="col-3">
              <div class="export-stat-card">
                <div class="export-stat-label">{{ selectedStatus === 'final' ? 'ប្រភេទ' : 'ក្រុម' }}</div>
                <div class="export-stat-value text-truncate">{{ selectedStatus === 'final' ? 'ជាប់ & បម្រុង' : selectedGroupBadgeText }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. FORM VIEW -->
    <div v-else class="export-modal-content py-2">
      <div class="row g-4">
        <!-- ==================================================== -->
        <!-- LEFT COLUMN: Candidates, Grouping & Summary Preview -->
        <!-- ==================================================== -->
        <div class="col-12 col-md-6 d-flex flex-column gap-3">
          <!-- Final Choice Overview Banner -->
          <div
            v-if="selectedStatus === 'final'"
            class="export-stat-card-banner export-stat-banner-final p-3 rounded-3"
          >
            <div class="d-flex align-items-center justify-content-between mb-2">
              <div class="d-flex align-items-center gap-2">
                <div class="stat-icon-circle bg-primary-subtle text-primary">
                  <i class="bi bi-award-fill"></i>
                </div>
                <div>
                  <span class="d-block fw-bold text-dark small">ទិន្នន័យលទ្ធផលចុងក្រោយ</span>
                  <span class="text-muted" style="font-size: 0.74rem;">ជាប់ & បម្រុងសរុប</span>
                </div>
              </div>
              <div class="d-flex align-items-center gap-1">
                <span v-if="isLoadingCounts" class="spinner-border spinner-border-sm text-primary me-1" role="status"></span>
                <span v-else class="badge bg-primary-subtle text-primary border border-primary-subtle fw-bold px-2.5 py-1">
                  សរុប {{ finalTotalCount }} នាក់
                </span>
              </div>
            </div>

            <div class="row g-2 pt-1">
              <div class="col-6">
                <div class="p-2 rounded-2 bg-white border d-flex align-items-center justify-content-between">
                  <div class="d-flex align-items-center gap-1.5">
                    <span class="status-indicator bg-primary me-2"></span>
                    <span class="small fw-semibold text-muted">ជាប់</span>
                  </div>
                  <span class="fw-bold text-primary small">{{ passCount }} នាក់</span>
                </div>
              </div>
              <div class="col-6">
                <div class="p-2 rounded-2 bg-white border d-flex align-items-center justify-content-between">
                  <div class="d-flex align-items-center gap-1.5">
                    <span class="status-indicator bg-warning me-2"></span>
                    <span class="small fw-semibold text-muted">បម្រុង</span>
                  </div>
                  <span class="fw-bold text-warning-emphasis small">{{ effectiveReservedCount }} នាក់</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Shortlist Overview Banner -->
          <div
            v-else
            class="export-stat-card-banner p-3 rounded-3"
          >
            <div class="d-flex align-items-center justify-content-between mb-2">
              <div class="d-flex align-items-center gap-2">
                <div class="stat-icon-circle bg-primary-subtle text-primary">
                  <i class="bi bi-people-fill"></i>
                </div>
                <div>
                  <span class="d-block fw-bold text-dark small">បេក្ខជន Shortlist សរុប</span>
                  <span class="text-muted" style="font-size: 0.74rem;">ទិន្នន័យដែលអាចទាញយកបាន</span>
                </div>
              </div>
              <div class="d-flex align-items-center gap-1">
                <span v-if="isLoadingCounts" class="spinner-border spinner-border-sm text-primary me-1" role="status"></span>
                <span v-else class="badge bg-primary-subtle text-primary border border-primary-subtle fw-bold px-2.5 py-1">
                  {{ activeTotalCount }} នាក់
                </span>
              </div>
            </div>
            <div class="d-flex align-items-center justify-content-between bg-white px-3 py-2 rounded-2 border small text-muted">
              <span>ចែកជា <strong class="text-dark">{{ totalGroupCount }}</strong> ក្រុម</span>
              <span>មធ្យម <strong class="text-dark">{{ averageGroupSize }}</strong> នាក់/ក្រុម</span>
            </div>
          </div>

          <!-- Shortlist Mode: Group Config & Group Selector -->
          <template v-if="selectedStatus === 'shortlist'">
            <!-- Group Selector Dropdown -->
            <div>
              <label class="form-label fw-semibold export-label mb-1.5 d-flex align-items-center justify-content-between">
                <span><i class="bi bi-people text-primary me-1"></i>ជ្រើសរើសក្រុមទាញយក</span>
                <span class="text-muted fw-normal small">
                  មាន <strong class="text-primary">{{ totalGroupCount }}</strong> ក្រុម
                </span>
              </label>
              <BaseSelect
                v-model="selectedGroup"
                :options="groupSelectOptions"
                option-label="label"
                option-value="value"
                placeholder="ជ្រើសរើសក្រុម"
                :clearable="false"
                :searchable="false"
              />
            </div>
          </template>

          <!-- Final Mode: Optional Reserve Limit -->
          <template v-else>
            <div>
              <label class="form-label fw-semibold export-label mb-1.5 d-flex align-items-center justify-content-between">
                <span><i class="bi bi-sliders text-primary me-2"></i>កំណត់ចំនួនបេក្ខជនបម្រុង</span>
                <span class="text-muted fw-normal small">
                  បម្រុងសរុប: <strong class="text-warning-emphasis">{{ reservedCount }}</strong> នាក់
                </span>
              </label>
              <input
                type="number"
                min="0"
                :max="reservedCount || undefined"
                v-model.number="reserveLimit"
                class="form-control export-input shadow-none"
                :placeholder="`ទាំងអស់ (${reservedCount} នាក់)`"
              />
              <div class="form-text text-muted small mt-1">
                <i class="bi bi-info-circle me-2"></i>ទុកទទេ = ជ្រើសយកទាំងអស់ ({{ reservedCount }} នាក់)
              </div>
            </div>
          </template>

          <!-- Live Summary Preview Card -->
          <div class="export-summary-card p-3 rounded-3">
            <div class="d-flex align-items-center justify-content-between">
              <div class="d-flex align-items-center gap-2">
                <div class="summary-icon-box d-flex align-items-center justify-content-center me-2 flex-shrink-0">
                  <i class="bi bi-file-earmark-bar-graph"></i>
                </div>
                <div>
                  <div class="summary-title fw-bold">ទិន្នន័យទាញយក</div>
                  <div class="summary-subtitle text-muted text-truncate" style="max-width: 190px;">
                    <template v-if="selectedStatus === 'final'">
                      ជាប់ {{ passCount }} + បម្រុង {{ effectiveReservedCount }}
                    </template>
                    <template v-else>
                      {{ activeGroupSummarySubtitle }}
                    </template>
                  </div>
                </div>
              </div>
              <div class="text-end">
                <div class="summary-count fw-bold">
                  {{ selectedStatus === 'final' ? finalTotalCount : activeRowCount }}
                </div>
                <div class="summary-unit text-muted">
                  នាក់
                </div>
              </div>
            </div>
          </div>
          <div class="text-muted small d-none d-sm-block">
            <i class="bi bi-shield-check text-primary me-1"></i>ទិន្នន័យត្រូវបានទាញយកដោយស្វ័យប្រវត្តិតាមតម្រង
          </div>
        </div>

        <!-- ==================================================== -->
        <!-- RIGHT COLUMN: Filters, Requirement Dates & Formats  -->
        <!-- ==================================================== -->
        <div class="col-12 col-md-6 d-flex flex-column gap-3">
          <!-- Filter Selects Card -->
          <div class="filter-box-card p-3 rounded-3 border">
            <div class="small fw-bold text-dark mb-2.5 d-flex align-items-center gap-1.5">
              <i class="bi bi-funnel text-primary me-2"></i>
              <span>លក្ខខណ្ឌតម្រងទិន្នន័យ</span>
            </div>
            <div class="row g-2">
              <!-- Program -->
              <div class="col-4">
                <label class="form-label small fw-semibold text-muted mb-1">ជំនាញ</label>
                <BaseSelect
                  v-model="selectedProgram"
                  :options="programOptions"
                  option-label="label"
                  option-value="value"
                  :clearable="false"
                  :searchable="false"
                />
              </div>
              <!-- Shift -->
              <div class="col-4">
                <label class="form-label small fw-semibold text-muted mb-1">វេន</label>
                <BaseSelect
                  v-model="selectedShift"
                  :options="shiftOptions"
                  option-label="label"
                  option-value="value"
                  :clearable="false"
                  :searchable="false"
                />
              </div>
              <!-- Status / Type -->
              <div class="col-4">
                <label class="form-label small fw-semibold text-muted mb-1">ស្ថានភាព</label>
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
          </div>

          <!-- Course Requirement Dates (Shortlist Only) -->
          <div v-if="selectedStatus === 'shortlist'" class="date-box-card p-3 rounded-3 border">
            <div class="small fw-bold text-dark mb-2.5 d-flex align-items-center justify-content-between">
              <span><i class="bi bi-calendar-range text-primary me-2"></i>កាលបរិច្ឆេទចូលរៀន ២សប្ដាហ៍</span>
              <span class="badge bg-secondary-subtle text-secondary fw-normal">2 Weeks</span>
            </div>
            <div class="row g-2">
              <div class="col-6">
                <label class="form-label small text-muted mb-1">ថ្ងៃចាប់ផ្ដើម (Start)</label>
                <el-date-picker
                  v-model="startDate"
                  type="date"
                  format="DD MMM YYYY"
                  value-format="YYYY-MM-DD"
                  placeholder="ចាប់ផ្ដើម"
                  :clearable="true"
                  class="w-100 export-date-picker"
                  popper-class="export-date-popper"
                  @change="onStartDateChange"
                />
              </div>
              <div class="col-6">
                <label class="form-label small text-muted mb-1">ថ្ងៃបញ្ចប់ (End)</label>
                <el-date-picker
                  v-model="endDate"
                  type="date"
                  format="DD MMM YYYY"
                  value-format="YYYY-MM-DD"
                  placeholder="បញ្ចប់"
                  :clearable="true"
                  class="w-100 export-date-picker"
                  popper-class="export-date-popper"
                />
              </div>
            </div>
          </div>

          <!-- Document Export Date -->
          <div>
            <label class="form-label fw-semibold export-label mb-1.5 d-flex align-items-center justify-content-between">
              <span><i class="bi bi-calendar-event text-primary me-2"></i>កាលបរិច្ឆេទលើកឯកសារ</span>
              <span class="text-muted fw-normal small">ថ្ងៃទាញយក / ហត្ថលេខា</span>
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

          <!-- File Format Selection (Modern Interactive Cards) -->
          <div>
            <label class="form-label fw-semibold export-label mb-1.5">
              <i class="bi bi-file-earmark-text text-primary me-2"></i>ទម្រង់ឯកសារ (File Format)
            </label>
            <div class="row g-2">
              <!-- PDF Card -->
              <div class="col-6">
                <div
                  class="format-card d-flex align-items-center justify-content-between p-2.5 rounded-3 border"
                  :class="{ active: selectedFormat === 'pdf' }"
                  @click="selectedFormat = 'pdf'"
                >
                  <div class="d-flex align-items-center p-2 gap-2">
                    <div class="format-card-icon bg-danger-subtle text-danger">
                      <i class="bi bi-file-earmark-pdf-fill"></i>
                    </div>
                    <div>
                      <span class="d-block fw-semibold small text-dark">PDF</span>
                    </div>
                  </div>
                  <i class="bi" :class="selectedFormat === 'pdf' ? 'bi-check-circle-fill text-primary fs-5 me-2' : 'bi-circle text-muted fs-5 me-2'"></i>
                </div>
              </div>

              <!-- Word Card -->
              <div class="col-6">
                <div
                  class="format-card d-flex align-items-center justify-content-between p-2.5 rounded-3 border"
                  :class="{ active: selectedFormat === 'docx' }"
                  @click="selectedFormat = 'docx'"
                >
                  <div class="d-flex align-items-center p-2 gap-2">
                    <div class="format-card-icon bg-primary-subtle text-primary">
                      <i class="bi bi-file-earmark-word-fill"></i>
                    </div>
                    <div>
                      <span class="d-block fw-semibold small text-dark">Word (.docx)</span>
                    </div>
                  </div>
                  <i class="bi" :class="selectedFormat === 'docx' ? 'bi-check-circle-fill text-primary fs-5 me-2' : 'bi-circle text-muted fs-5 me-2'"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ================= MODAL FOOTER ================= -->
    <template #footer>
      <!-- Success Action -->
      <div v-if="isSuccess" class="w-100 pt-1">
        <button
          type="button"
          class="btn btn-export-submit w-100 py-2.5 fs-6 fw-bold"
          @click="handleClose"
        >
          <i class="bi bi-check2-circle me-2"></i>រួចរាល់
        </button>
      </div>

      <!-- Normal Form Actions -->
      <div v-else class="d-flex align-items-center justify-content-between w-100 pt-1">
        <div class="d-flex align-items-center gap-2 ms-auto">
          <!-- Cancel Button -->
          <button
            type="button"
            class="btn btn-export-cancel px-4"
            :disabled="isDownloading"
            @click="handleClose"
          >
            បោះបង់
          </button>

          <!-- Download Button -->
          <button
            type="button"
            class="btn btn-export-submit px-4 d-inline-flex align-items-center justify-content-center gap-2"
            :disabled="isDownloading"
            @click="handleDownload"
          >
            <span v-if="isDownloading" class="spinner-border spinner-border-sm" role="status"></span>
            <i v-else class="bi bi-download"></i>
            <span>{{ isDownloading ? 'កំពុងទាញយក...' : 'ទាញយកឯកសារ' }}</span>
          </button>
        </div>
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
import groupService from '@/services/group.service';
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
    default: '',
  },
  initialShift: {
    type: String,
    default: '',
  },
  initialGroup: {
    type: [String, Number],
    default: '',
  },
  initialStatus: {
    type: String,
    default: '',
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
const passCount = ref(0);
const reservedCount = ref(0);
const reserveLimit = ref(null);

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

// Status Options: ជ្រើសសម្រាំង and លទ្ធផលចុងក្រោយ
const statusOptions = [
  { value: "shortlist", label: "ជ្រើសសម្រាំង" },
  { value: "final", label: "លទ្ធផលចុងក្រោយ" },
];

// Dual-prop visibility binding
const isOpenModel = computed(() => props.show || props.isOpen);

// Form States
const today = new Date().toISOString().split('T')[0];
const exportDate = ref(today);
const startDate = ref('');
const resolveInitialStatus = () => {
  if (props.exportType === 'final') return 'final';
  if (props.exportType === 'shortlist') return 'shortlist';
  if (props.initialStatus === 'final' || ['PASS', 'RESERVED', 'PASSED'].includes(props.initialStatus)) {
    return 'final';
  }
  return 'shortlist';
};

const endDate = ref('');
const groupSize = ref(20);
const selectedGroup = ref(props.initialGroup ? String(props.initialGroup) : '');
const selectedGroupIndex = ref(1);
const realGroups = ref([]);
const groupSetting = ref(null);
const selectedProgram = ref(props.initialProgram || '');
const selectedShift = ref(props.initialShift || '');
const selectedStatus = ref(resolveInitialStatus());
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

// Auto-fill end date to +14 days if not manually set
const onStartDateChange = (val) => {
  if (val && !endDate.value) {
    const d = new Date(val);
    d.setDate(d.getDate() + 14);
    endDate.value = d.toISOString().split('T')[0];
  }
};

// Helper to extract query-filtered total from API responses
const extractCount = (settledRes) => {
  if (!settledRes || settledRes.status !== 'fulfilled') return null;
  const resData = settledRes.value?.data;
  if (!resData) return null;

  const meta = resData.data?.pagination || resData.pagination;
  if (meta) {
    // Priority 1: 'total' is the query-filtered count!
    if (meta.total !== undefined && meta.total !== null && !isNaN(Number(meta.total))) {
      return Number(meta.total);
    }
    // Priority 2: 'count'
    if (meta.count !== undefined && meta.count !== null && !isNaN(Number(meta.count))) {
      return Number(meta.count);
    }
    // Priority 3: 'totalSubmissions' (fallback only if total is missing)
    if (meta.totalSubmissions !== undefined && meta.totalSubmissions !== null && !isNaN(Number(meta.totalSubmissions))) {
      return Number(meta.totalSubmissions);
    }
  }

  // Fallback if data is raw array
  if (Array.isArray(resData.data)) return resData.data.length;
  if (Array.isArray(resData.data?.submissions)) return resData.data.submissions.length;
  if (Array.isArray(resData.submissions)) return resData.submissions.length;

  return null;
};

// Fetch live total candidate counts according to selected program and shift
const fetchTotalCounts = async () => {
  isLoadingCounts.value = true;
  try {
    const queryParams = { page: 1, limit: 1 };
    if (selectedProgram.value) queryParams.program = selectedProgram.value;
    if (selectedShift.value) queryParams.shift = selectedShift.value;

    const [
      shortlistRes,
      passRes,
      reservedRes,
      allPassedPassRes,
      allPassedReservedRes,
    ] = await Promise.allSettled([
      submissionService.getShortlist(queryParams),
      submissionService.getPassFinalResult(queryParams),
      submissionService.getReservedFinalResult(queryParams),
      submissionService.getAllFinalResult({ ...queryParams, status: 'PASS' }),
      submissionService.getAllFinalResult({ ...queryParams, status: 'RESERVED' }),
    ]);

    // Shortlist count
    const slCount = extractCount(shortlistRes);
    if (slCount !== null) {
      shortlistCount.value = slCount;
    }

    // Final Passed count (try getPassFinalResult first, fallback to getAllFinalResult with status PASS)
    const pCount = extractCount(passRes);
    const altPCount = extractCount(allPassedPassRes);
    if (pCount !== null) {
      passCount.value = pCount;
    } else if (altPCount !== null) {
      passCount.value = altPCount;
    }

    // Final Reserved count (try getReservedFinalResult first, fallback to getAllFinalResult with status RESERVED)
    const rCount = extractCount(reservedRes);
    const altRCount = extractCount(allPassedReservedRes);
    if (rCount !== null) {
      reservedCount.value = rCount;
    } else if (altRCount !== null) {
      reservedCount.value = altRCount;
    }
  } catch (err) {
    console.error('Error fetching candidate counts for export:', err);
  } finally {
    isLoadingCounts.value = false;
  }
};

// Re-fetch counts when filters change
watch([selectedProgram, selectedShift, selectedStatus], () => {
  if (isOpenModel.value) {
    selectedGroupIndex.value = 1;
    fetchTotalCounts();
  }
});

// Active total count for Shortlist mode
const activeTotalCount = computed(() => {
  if (selectedStatus.value === 'final') {
    return finalTotalCount.value;
  }
  return shortlistCount.value;
});

// Fetch group settings from /settings/groups
const fetchGroupSettings = async () => {
  try {
    const res = await groupService.getGroupSettings();
    if (res.data?.success && res.data?.data) {
      const data = res.data.data;
      groupSetting.value = data.setting || null;
      realGroups.value = Array.isArray(data.groups) ? data.groups : [];

      if (data.setting?.studentsPerGroup) {
        groupSize.value = Number(data.setting.studentsPerGroup);
      } else if (realGroups.value.length > 0 && activeTotalCount.value > 0) {
        groupSize.value = Math.round(activeTotalCount.value / realGroups.value.length);
      }
    }
  } catch (err) {
    console.warn('Error fetching group settings for export:', err);
  }
};

// Automatically synchronize groupSize when active total count updates
watch(activeTotalCount, (count) => {
  if (count > 0) {
    if (groupSetting.value?.studentsPerGroup) {
      groupSize.value = Number(groupSetting.value.studentsPerGroup);
    } else if (realGroups.value.length > 0) {
      groupSize.value = Math.round(count / realGroups.value.length);
    }
  }
});

// Reset / sync state when modal opens
watch(
  () => isOpenModel.value,
  (open) => {
    if (open) {
      isSuccess.value = false;
      selectedProgram.value = props.initialProgram || '';
      selectedShift.value = props.initialShift || '';
      selectedStatus.value = resolveInitialStatus();
      selectedGroup.value = props.initialGroup ? String(props.initialGroup) : '';
      selectedGroupIndex.value = 1;
      if (groupSetting.value?.studentsPerGroup) {
        groupSize.value = Number(groupSetting.value.studentsPerGroup);
      } else if (realGroups.value.length > 0 && activeTotalCount.value > 0) {
        groupSize.value = Math.round(activeTotalCount.value / realGroups.value.length);
      } else if (!groupSize.value || groupSize.value < 1) {
        groupSize.value = 20;
      }
      exportDate.value = today;
      startDate.value = '';
      endDate.value = '';
      reserveLimit.value = null;

      if (props.totalCount && !props.initialProgram && !props.initialShift) {
        if (props.exportType === 'final') {
          passCount.value = props.totalCount;
        } else {
          shortlistCount.value = props.totalCount;
        }
      } else {
        passCount.value = 0;
        shortlistCount.value = 0;
        reservedCount.value = 0;
      }
      fetchGroupSettings();
      fetchTotalCounts();
    }
  }
);

watch(
  () => props.initialGroup,
  (val) => {
    selectedGroup.value = val ? String(val) : '';
  }
);

// Dynamic Group Generation dividing the actual available total students equally (Shortlist fallback)
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

const totalGroupCount = computed(() => {
  if (realGroups.value.length > 0) return realGroups.value.length;
  if (groupSetting.value?.numberOfGroups) return Number(groupSetting.value.numberOfGroups);
  return computedGroups.value.length;
});

const averageGroupSize = computed(() => {
  if (realGroups.value.length > 0 && activeTotalCount.value > 0) {
    return Math.round(activeTotalCount.value / realGroups.value.length);
  }
  if (groupSetting.value?.studentsPerGroup) {
    return Number(groupSetting.value.studentsPerGroup);
  }
  return Number(groupSize.value) || 20;
});

// Options formatted for BaseSelect dropdown
const groupSelectOptions = computed(() => {
  const options = [
    { value: '', label: 'ក្រុមទាំងអស់ (All Groups)', count: activeTotalCount.value },
  ];

  if (realGroups.value.length > 0) {
    realGroups.value.forEach((g) => {
      options.push({
        value: String(g.group),
        label: g.studentCount ? `ក្រុមទី ${g.group} (${g.studentCount} នាក់)` : `ក្រុមទី ${g.group}`,
        count: Number(g.studentCount) || 0,
      });
    });
  } else if (groupSetting.value?.numberOfGroups) {
    const total = Number(groupSetting.value.numberOfGroups);
    for (let i = 1; i <= total; i++) {
      options.push({
        value: String(i),
        label: `ក្រុមទី ${i}`,
        count: 0,
      });
    }
  } else if (computedGroups.value.length > 0) {
    computedGroups.value.forEach((grp) => {
      options.push({
        value: String(grp.index),
        label: `ក្រុមទី ${grp.index} (${grp.count} នាក់ · ជួរ ${grp.rangeText})`,
        count: grp.count,
      });
    });
  }

  return options;
});

// Active group details
const activeGroupSummarySubtitle = computed(() => {
  if (!selectedGroup.value) {
    return `គ្រប់ក្រុមទាំងអស់ (${totalGroupCount.value} ក្រុម)`;
  }
  const matched = groupSelectOptions.value.find((o) => o.value === String(selectedGroup.value));
  return matched ? matched.label : `ក្រុមទី ${selectedGroup.value}`;
});

const activeRowCount = computed(() => {
  if (!selectedGroup.value) {
    return activeTotalCount.value;
  }
  const matched = groupSelectOptions.value.find((o) => o.value === String(selectedGroup.value));
  if (matched && matched.count) {
    return matched.count;
  }
  const grp = computedGroups.value.find((g) => String(g.index) === String(selectedGroup.value));
  if (grp) return grp.count;
  return Math.min(Number(groupSize.value) || 20, activeTotalCount.value);
});

const successGroupText = computed(() => {
  if (!selectedGroup.value) {
    return 'គ្រប់ក្រុមទាំងអស់';
  }
  return `ក្រុមទី ${selectedGroup.value}`;
});

const selectedGroupBadgeText = computed(() => {
  if (!selectedGroup.value) return 'គ្រប់ក្រុម';
  return `ក្រុម ${selectedGroup.value}`;
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
    const targetType = selectedStatus.value === 'final' ? 'final' : 'shortlist';

    const payload = {
      format: selectedFormat.value,
      program: selectedProgram.value || undefined,
      shift: selectedShift.value || undefined,
      exportDate: exportDate.value || undefined,
    };

    if (targetType === 'shortlist') {
      if (selectedGroup.value) {
        payload.group = selectedGroup.value;
        payload.groupNumber = Number(selectedGroup.value);
        payload.groupIndex = Number(selectedGroup.value);

        // Ensure groupSize and limit reflect the full count of the selected group
        const matched = groupSelectOptions.value.find((o) => o.value === String(selectedGroup.value));
        const effectiveCount = matched?.count || activeRowCount.value || Number(groupSize.value) || 20;
        payload.groupSize = effectiveCount;
        payload.limit = effectiveCount;
      } else {
        payload.sortBy = 'group';
        const effectiveSize = Number(groupSetting.value?.studentsPerGroup) || averageGroupSize.value || Number(groupSize.value) || 20;
        payload.groupSize = effectiveSize;
        if (activeTotalCount.value) {
          payload.limit = activeTotalCount.value;
        }
      }
      if (startDate.value) payload.startDate = startDate.value;
      if (endDate.value) payload.endDate = endDate.value;
    }

    if (targetType === 'final') {
      const limit = reserveLimit.value;
      if (limit !== null && limit !== undefined && limit !== '' && !isNaN(Number(limit))) {
        payload.reserveLimit = Number(limit);
        payload.reserveCount = Number(limit);
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
  width: 42px;
  height: 42px;
  background: linear-gradient(135deg, #f7f9fa 0%, #d8e5f9 100%);
  border-radius: 12px;
  color: var(--bs-primary);
  font-size: 20px;
}

.export-modal-title {
  color: #1e293b;
  font-size: 1.12rem;
  letter-spacing: -0.2px;
}

.export-modal-subtitle {
  font-size: 16px;
  color: #64748b !important;
}

.btn-close-export {
  width: 32px;
  height: 32px;
  background-color: #f1f5f9;
  border: none;
  border-radius: 8px;
  color: #64748b;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-close-export:hover {
  background-color: #e2e8f0;
  color: #1e293b;
}

/* ====================================
   BANNER CARDS
   ==================================== */
.export-stat-card-banner {
  background: linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%);
  border: 1px solid #bfdbfe !important;
}

.export-stat-banner-final {
  background: linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%);
  border: 1px solid #bfdbfe !important;
}

.stat-icon-circle {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

/* ====================================
   CONTAINER CARDS (FILTERS & DATES)
   ==================================== */
.filter-box-card,
.date-box-card {
  background-color: #fafbfc;
  border: 1px solid #eef2f6 !important;
}

/* ====================================
   LABELS & INPUTS
   ==================================== */
.export-label {
  color: #334155;
  font-size: 0.84rem;
}

.export-input {
  height: 42px;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  padding: 0 14px;
  font-size: 0.92rem;
  font-weight: 600;
  color: #1e293b;
  background-color: #ffffff;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.export-input:focus {
  border-color: var(--bs-primary, #2662d9);
  box-shadow: 0 0 0 3px rgba(38, 98, 217, 0.12);
}

/* ====================================
   SUMMARY PREVIEW CARD
   ==================================== */
.export-summary-card {
  background-color: #f8fafc;
  border: 1.5px dashed #cbd5e1;
}

.summary-icon-box {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  color: var(--bs-primary, #2662d9);
  font-size: 18px;
}

.summary-title {
  color: #1e293b;
  font-size: 0.86rem;
}

.summary-subtitle {
  font-size: 0.76rem;
}

.summary-count {
  font-size: 1.35rem;
  line-height: 1;
  color: var(--bs-primary, #2662d9);
}

.summary-unit {
  font-size: 0.74rem;
  margin-top: 2px;
}

/* ====================================
   FORMAT CARDS
   ==================================== */
.format-card {
  background-color: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}

.format-card:hover {
  border-color: #94a3b8 !important;
  background-color: #f8fafc;
}

.format-card.active {
  border-color: var(--bs-primary, #2662d9) !important;
  background-color: #eff6ff;
}

.format-card-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

/* ====================================
   SUCCESS VIEW
   ==================================== */
.export-success-icon-box {
  width: 68px;
  height: 68px;
  border-radius: 50%;
}

.export-success-title {
  color: #1e293b;
  font-size: 1.35rem;
}

.export-success-desc {
  color: #64748b;
  font-size: 0.9rem;
  line-height: 1.5;
}

.export-success-highlight {
  color: var(--bs-primary, #2662d9);
}

.export-stat-card {
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 10px 8px;
}

.export-stat-label {
  color: #64748b;
  margin-bottom: 2px;
}

.export-stat-value {
  font-size: 0.86rem;
  font-weight: 700;
  color: #1e293b;
}

/* ====================================
   FOOTER BUTTONS
   ==================================== */
.btn-export-cancel {
  height: 42px;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  background-color: #ffffff;
  color: #64748b;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.btn-export-cancel:hover {
  background-color: #f8fafc;
  border-color: #cbd5e1;
  color: #334155;
}

.btn-export-submit {
  height: 42px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, #2662d9 0%, #1f52bc 100%);
  color: #ffffff;
  font-weight: 600;
  font-size: 0.9rem;
  box-shadow: 0 4px 12px rgba(38, 98, 217, 0.25);
  transition: all 0.2s ease;
}

.btn-export-submit:hover {
  background: linear-gradient(135deg, #1f52bc 0%, #17429d 100%);
  color: #ffffff;
  box-shadow: 0 6px 16px rgba(38, 98, 217, 0.35);
  transform: translateY(-1px);
}

.btn-export-submit:disabled,
.btn-export-cancel:disabled {
  opacity: 0.65;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}
</style>

<style>
/* Unscoped styles for Element Plus date picker */
.export-date-popper,
.export-date-picker {
  --el-color-primary: #2662d9 !important;
  --el-input-focus-border-color: #2662d9 !important;
  --el-input-hover-border-color: #2662d9 !important;
  --el-datepicker-active-color: #2662d9 !important;
  --el-datepicker-hover-text-color: #2662d9 !important;
}

.export-date-popper {
  border-radius: 14px !important;
  overflow: hidden !important;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12) !important;
}

.export-date-popper .el-date-table td.current:not(.disabled) .el-date-table-cell__text {
  background-color: #2662d9 !important;
  color: #ffffff !important;
  font-weight: 700 !important;
  border-radius: 50% !important;
}

.export-date-popper .el-date-table td.today .el-date-table-cell__text {
  color: #2662d9 !important;
  font-weight: 700 !important;
}

.export-date-popper .el-date-table td.available:hover {
  color: #2662d9 !important;
}

.export-date-picker .el-input__wrapper.is-focus,
.export-date-picker .el-input__wrapper:focus,
.export-date-picker .el-input__wrapper:focus-within {
  border-color: #2662d9 !important;
  box-shadow: 0 0 0 1px #2662d9 inset, 0 0 0 3px rgba(38, 98, 217, 0.12) !important;
  outline: none !important;
}

.export-date-picker .el-input__inner:focus {
  outline: none !important;
}

/* ==========================================================
   ISOLATED WIDTH FOR EXPORT MODAL ONLY (Does not touch others)
   ========================================================== */
.export-modal-dialog-wrapper .modal-dialog {
  max-width: 1050px !important;
  width: 1050px !important;
}

.export-modal-dialog-wrapper .modal-content {
  width: 100% !important;
  max-width: 100% !important;
  border-radius: 16px !important;
}

.export-modal-dialog-wrapper .modal-body {
  max-height: calc(90vh - 130px);
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
}
</style>
