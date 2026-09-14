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
            <h5 class="fw-bold mb-0 export-modal-title">ទាញយកទិន្នន័យ (Export Data)</h5>
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
      <div class="export-success-icon-box d-flex align-items-center justify-content-center mb-3">
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#2e7d6b"
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
        <template v-if="isFinalChoice">
          ទិន្នន័យបេក្ខជនជ័យលាភី <span class="fw-bold export-success-highlight">សរុប {{ finalTotalCount }} នាក់</span> (ជាប់ {{ passCount }} នាក់, បម្រុង {{ effectiveReservedCount }} នាក់) ត្រូវបានទាញយកដោយជោគជ័យ។
        </template>
        <template v-else>
          ទិន្នន័យ <span class="fw-bold export-success-highlight">Group {{ selectedGroupIndex }}: {{ activeRangeText }}</span> ({{ activeRowCount }} ជួរ) ត្រូវបានទាញយកដោយជោគជ័យ។
        </template>
      </p>

      <!-- 4 Details Cards Grid -->
      <div class="row g-2 w-100 mb-2 px-2">
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
            <div class="export-stat-label">{{ isFinalChoice ? 'ប្រភេទ' : 'ក្រុម' }}</div>
            <div class="export-stat-value text-truncate">{{ isFinalChoice ? 'ជាប់ & បម្រុង' : `G${selectedGroupIndex}` }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. FORM VIEW -->
    <div v-else class="export-modal-content py-2">
      <div class="row g-3">
        <!-- ==================================================== -->
        <!-- LEFT COLUMN: Candidates, Grouping & Summary Preview -->
        <!-- ==================================================== -->
        <div class="col-12 col-md-6 d-flex flex-column gap-3">
          <!-- Final Choice Overview Banner -->
          <div
            v-if="isFinalChoice"
            class="export-stat-card-banner export-stat-banner-final p-3 rounded-3"
          >
            <div class="d-flex align-items-center justify-content-between mb-2">
              <div class="d-flex align-items-center gap-2">
                <div class="stat-icon-circle bg-warning-subtle text-warning-emphasis">
                  <i class="bi bi-award-fill"></i>
                </div>
                <div>
                  <span class="d-block fw-bold text-dark small">ទិន្នន័យលទ្ធផលចុងក្រោយ</span>
                  <span class="text-muted" style="font-size: 0.74rem;">ជាប់ & បម្រុងសរុប</span>
                </div>
              </div>
              <div class="d-flex align-items-center gap-1">
                <span v-if="isLoadingCounts" class="spinner-border spinner-border-sm text-secondary me-1" role="status"></span>
                <span class="badge bg-dark text-white fw-bold px-2 py-1">
                  សរុប {{ passCount + reservedCount }} នាក់
                </span>
              </div>
            </div>

            <div class="row g-2 pt-1">
              <div class="col-6">
                <div class="p-2 rounded-2 bg-white border d-flex align-items-center justify-content-between">
                  <div class="d-flex align-items-center gap-1.5">
                    <span class="status-indicator bg-success"></span>
                    <span class="small fw-semibold text-muted">ជាប់</span>
                  </div>
                  <span class="fw-bold text-success small">{{ passCount }} នាក់</span>
                </div>
              </div>
              <div class="col-6">
                <div class="p-2 rounded-2 bg-white border d-flex align-items-center justify-content-between">
                  <div class="d-flex align-items-center gap-1.5">
                    <span class="status-indicator bg-warning"></span>
                    <span class="small fw-semibold text-muted">បម្រុង</span>
                  </div>
                  <span class="fw-bold text-warning-emphasis small">{{ reservedCount }} នាក់</span>
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
                <div class="stat-icon-circle bg-success-subtle text-success">
                  <i class="bi bi-people-fill"></i>
                </div>
                <div>
                  <span class="d-block fw-bold text-dark small">បេក្ខជន Shortlist សរុប</span>
                  <span class="text-muted" style="font-size: 0.74rem;">ទិន្នន័យដែលអាចទាញយកបាន</span>
                </div>
              </div>
              <div class="d-flex align-items-center gap-1">
                <span v-if="isLoadingCounts" class="spinner-border spinner-border-sm text-success me-1" role="status"></span>
                <span class="badge bg-success-subtle text-success border border-success-subtle fw-bold px-2.5 py-1">
                  {{ activeTotalCount }} នាក់
                </span>
              </div>
            </div>
            <div class="d-flex align-items-center justify-content-between bg-white px-3 py-2 rounded-2 border small text-muted">
              <span>ចែកជា <strong class="text-dark">{{ computedGroups.length }}</strong> ក្រុម</span>
              <span>មធ្យម <strong class="text-dark">{{ groupSize }}</strong> នាក់/ក្រុម</span>
            </div>
          </div>

          <!-- Group Config & Group Selector (Shortlist Only) -->
          <template v-if="!isFinalChoice">
            <!-- Group Size Input -->
            <div>
              <label class="form-label fw-semibold export-label mb-1.5 d-flex align-items-center justify-content-between">
                <span><i class="bi bi-layers text-success me-1"></i>ចំនួនក្នុងមួយក្រុម</span>
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

            <!-- Group Selector Pills -->
            <div>
              <label class="form-label fw-semibold export-label mb-1.5 d-flex align-items-center justify-content-between">
                <span><i class="bi bi-check2-square text-success me-1"></i>ជ្រើសរើសក្រុមទាញយក</span>
                <span class="text-muted fw-normal small">
                  មាន <strong class="text-success">{{ computedGroups.length }}</strong> ក្រុម
                </span>
              </label>
              <div class="group-pills-container d-flex gap-2 overflow-x-auto pb-1 pt-1">
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

          <!-- Final Mode: Optional Reserve Limit -->
          <template v-else>
            <div>
              <label class="form-label fw-semibold export-label mb-1.5 d-flex align-items-center justify-content-between">
                <span><i class="bi bi-sliders text-primary me-1"></i>កំណត់ចំនួនបេក្ខជនបម្រុង</span>
                <span class="text-muted fw-normal small">
                  បម្រុងសរុប៖ <strong class="text-warning-emphasis">{{ reservedCount }}</strong> នាក់
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
                <i class="bi bi-info-circle me-1"></i>ទុកទទេ = ជ្រើសយកទាំងអស់ ({{ reservedCount }} នាក់)
              </div>
            </div>
          </template>

          <!-- Live Summary Preview Card -->
          <div class="export-summary-card p-3 rounded-3 mt-auto">
            <div class="d-flex align-items-center justify-content-between">
              <div class="d-flex align-items-center gap-2">
                <div class="summary-icon-box d-flex align-items-center justify-content-center me-2 flex-shrink-0">
                  <i class="bi bi-file-earmark-bar-graph"></i>
                </div>
                <div>
                  <div class="summary-title fw-bold">ទិន្នន័យទាញយក</div>
                  <div class="summary-subtitle text-muted text-truncate" style="max-width: 190px;">
                    <template v-if="isFinalChoice">
                      ជាប់ {{ passCount }} + បម្រុង {{ effectiveReservedCount }}
                    </template>
                    <template v-else>
                      Group {{ selectedGroupIndex }} · ជួរ {{ activeRangeText }}
                    </template>
                  </div>
                </div>
              </div>
              <div class="text-end">
                <div class="summary-count fw-bold">
                  {{ isFinalChoice ? finalTotalCount : activeRowCount }}
                </div>
                <div class="summary-unit text-muted">
                  {{ isFinalChoice ? 'នាក់' : 'ជួរ' }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ==================================================== -->
        <!-- RIGHT COLUMN: Filters, Requirement Dates & Formats  -->
        <!-- ==================================================== -->
        <div class="col-12 col-md-6 d-flex flex-column gap-3">
          <!-- Filter Selects Card -->
          <div class="filter-box-card p-3 rounded-3 border">
            <div class="small fw-bold text-dark mb-2.5 d-flex align-items-center gap-1.5">
              <i class="bi bi-funnel text-success me-2"></i>
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
          <div v-if="!isFinalChoice" class="date-box-card p-3 rounded-3 border">
            <div class="small fw-bold text-dark mb-2.5 d-flex align-items-center justify-content-between">
              <span><i class="bi bi-calendar-range text-success me-2"></i>កាលបរិច្ឆេទចូលរៀន ២សប្ដាហ៍</span>
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
              <span><i class="bi bi-calendar-event text-success me-2"></i>កាលបរិច្ឆេទលើឯកសារ</span>
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
              <i class="bi bi-file-earmark-text text-primary me-1.5"></i>ទម្រង់ឯកសារ (File Format)
            </label>
            <div class="row g-2">
              <!-- PDF Card -->
              <div class="col-6">
                <div
                  class="format-card d-flex align-items-center justify-content-between p-2.5 rounded-3 border"
                  :class="{ active: selectedFormat === 'pdf' }"
                  @click="selectedFormat = 'pdf'"
                >
                  <div class="d-flex align-items-center gap-2">
                    <div class="format-card-icon bg-danger-subtle text-danger">
                      <i class="bi bi-file-earmark-pdf-fill"></i>
                    </div>
                    <div>
                      <span class="d-block fw-bold small text-dark">PDF</span>
                      <span class="text-muted" style="font-size: 0.72rem;">ផ្លូវការ / បោះពុម្ព</span>
                    </div>
                  </div>
                  <i class="bi" :class="selectedFormat === 'pdf' ? 'bi-check-circle-fill text-success fs-5' : 'bi-circle text-muted fs-5'"></i>
                </div>
              </div>

              <!-- Word Card -->
              <div class="col-6">
                <div
                  class="format-card d-flex align-items-center justify-content-between p-2.5 rounded-3 border"
                  :class="{ active: selectedFormat === 'docx' }"
                  @click="selectedFormat = 'docx'"
                >
                  <div class="d-flex align-items-center gap-2">
                    <div class="format-card-icon bg-primary-subtle text-primary">
                      <i class="bi bi-file-earmark-word-fill"></i>
                    </div>
                    <div>
                      <span class="d-block fw-bold small text-dark">Word (.docx)</span>
                      <span class="text-muted" style="font-size: 0.72rem;">អាចកែសម្រួលបាន</span>
                    </div>
                  </div>
                  <i class="bi" :class="selectedFormat === 'docx' ? 'bi-check-circle-fill text-success fs-5' : 'bi-circle text-muted fs-5'"></i>
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
          <i class="bi bi-check2-circle me-1.5"></i>រួចរាល់
        </button>
      </div>

      <!-- Normal Form Actions -->
      <div v-else class="d-flex align-items-center justify-content-between w-100 pt-1">
        <div class="text-muted small d-none d-sm-block">
          <i class="bi bi-shield-check text-success me-1"></i>ទិន្នន័យត្រូវបានទាញយកដោយស្វ័យប្រវត្តិតាមតម្រង
        </div>

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
  width: 42px;
  height: 42px;
  background: linear-gradient(135deg, #e8f5f1 0%, #d5eee6 100%);
  border-radius: 12px;
  color: #2e7d6b;
  font-size: 20px;
}

.export-modal-title {
  color: #1e3a34;
  font-size: 1.12rem;
  letter-spacing: -0.2px;
}

.export-modal-subtitle {
  font-size: 0.8rem;
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
  background: linear-gradient(135deg, #f8faf9 0%, #f0f7f5 100%);
  border: 1px solid #d4ede4 !important;
}

.export-stat-banner-final {
  background: linear-gradient(135deg, #fffbf5 0%, #fef8ec 100%);
  border: 1px solid #fed7aa !important;
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
  border-color: #2e7d6b;
  box-shadow: 0 0 0 3px rgba(46, 125, 107, 0.12);
  background-color: #ffffff;
}

/* ====================================
   GROUP PILLS
   ==================================== */
.group-pills-container {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
}

.group-pill-btn {
  min-width: 72px;
  height: 52px;
  border-radius: 10px;
  border: 1.5px solid #e2e8f0;
  background-color: #ffffff;
  cursor: pointer;
  padding: 4px 8px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.group-pill-btn:hover {
  border-color: #9fd4c7;
  background-color: #f7faf9;
  transform: translateY(-1px);
}

.group-pill-name {
  font-size: 0.9rem;
  font-weight: 700;
  color: #334155;
}

.group-pill-range {
  font-size: 0.7rem;
  color: #94a3b8;
  white-space: nowrap;
}

.group-pill-btn.active {
  border-color: #2e7d6b;
  background: linear-gradient(135deg, #f0fdf4 0%, #e8f7f2 100%);
  box-shadow: 0 2px 6px rgba(46, 125, 107, 0.15);
}

.group-pill-btn.active .group-pill-name {
  color: #2e7d6b;
}

.group-pill-btn.active .group-pill-range {
  color: #2e7d6b;
  font-weight: 600;
}

/* ====================================
   SUMMARY PREVIEW CARD
   ==================================== */
.export-summary-card {
  border: 1.5px solid #d1fae5;
  background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
}

.summary-icon-box {
  width: 42px;
  height: 42px;
  background-color: #ffffff;
  border-radius: 10px;
  color: #2e7d6b;
  font-size: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
}

.summary-title {
  color: #1e3a34;
  font-size: 0.88rem;
}

.summary-subtitle {
  font-size: 0.78rem;
}

.summary-count {
  color: #2e7d6b;
  font-size: 1.6rem;
  line-height: 1;
}

.summary-unit {
  font-size: 0.78rem;
  color: #64748b;
}

/* ====================================
   FORMAT CARDS (PDF / WORD)
   ==================================== */
.format-card {
  background-color: #ffffff;
  border: 1.5px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.2s ease;
}

.format-card:hover {
  border-color: #cbd5e1;
  background-color: #f8fafc;
}

.format-card.active {
  border-color: #2e7d6b !important;
  background-color: #f0f9f6 !important;
  box-shadow: 0 0 0 1px #2e7d6b;
}

.format-card-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}

/* ====================================
   BASE SELECT DROPDOWN OVERRIDES
   ==================================== */
:deep(.base-select) {
  --bs-radius: 10px;
  --bs-border: #e2e8f0;
  --bs-focus: #2e7d6b;
  --bs-focus-ring: rgba(46, 125, 107, 0.12);
  --bs-text: #2e7d6b;
}

:deep(.base-select__group) {
  border: 1.5px solid #e2e8f0 !important;
  border-radius: 10px !important;
  transition: all 0.2s ease !important;
  background-color: #ffffff !important;
}

:deep(.base-select.is-focused .base-select__group) {
  border-color: #2e7d6b !important;
  box-shadow: 0 0 0 3px rgba(46, 125, 107, 0.12) !important;
}

:deep(.base-select__group .ts-control) {
  font-weight: 600 !important;
  color: #334155 !important;
  font-size: 0.84rem !important;
  min-height: 40px !important;
  padding: 0 26px 0 12px !important;
  border-radius: 10px !important;
}

:deep(.base-select__chevron) {
  color: #64748b !important;
  right: 10px !important;
}

:deep(.base-select__placeholder) {
  display: none !important;
}

:deep(.ts-dropdown) {
  border-radius: 10px !important;
  border: 1px solid #e2e8f0 !important;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08) !important;
  overflow: hidden !important;
  z-index: 1060 !important;
  margin-top: 4px !important;
}

:deep(.ts-dropdown .option) {
  padding: 8px 12px !important;
  font-size: 0.84rem !important;
  font-weight: 500 !important;
  color: #334155 !important;
  cursor: pointer !important;
}

:deep(.ts-dropdown .option.active),
:deep(.ts-dropdown .option:hover) {
  background-color: #f0f9f6 !important;
  color: #2e7d6b !important;
  font-weight: 600 !important;
}

:deep(.ts-dropdown .option.selected) {
  background-color: #e8f5f1 !important;
  color: #1e3a34 !important;
  font-weight: 700 !important;
}

/* ====================================
   ELEMENT PLUS DATE PICKER OVERRIDES
   ==================================== */
.export-date-picker {
  --el-color-primary: #2e7d6b !important;
  --el-input-focus-border-color: #2e7d6b !important;
  --el-input-hover-border-color: #2e7d6b !important;
  --el-input-border-color: #e2e8f0 !important;
  height: 42px !important;
  width: 100% !important;
}

.export-date-picker :deep(.el-input__wrapper) {
  border-radius: 10px !important;
  border: 1.5px solid #e2e8f0 !important;
  box-shadow: none !important;
  outline: none !important;
  transition: all 0.2s ease !important;
  padding: 0 12px !important;
}

.export-date-picker :deep(.el-input__wrapper:hover) {
  border-color: #2e7d6b !important;
}

.export-date-picker :deep(.el-input__wrapper.is-focus),
.export-date-picker :deep(.el-input__wrapper:focus),
.export-date-picker :deep(.el-input__wrapper:focus-within) {
  border-color: #2e7d6b !important;
  box-shadow: 0 0 0 1px #2e7d6b inset, 0 0 0 3px rgba(46, 125, 107, 0.12) !important;
  outline: none !important;
}

.export-date-picker :deep(.el-input__inner) {
  font-weight: 600 !important;
  color: #1e293b !important;
  font-size: 0.88rem !important;
}

.export-date-picker :deep(.el-input__inner:focus) {
  outline: none !important;
  box-shadow: none !important;
}

.export-date-picker :deep(.el-input__prefix) {
  color: #2e7d6b !important;
  font-size: 15px !important;
}

/* ====================================
   SUCCESS SCREEN STYLES
   ==================================== */
.export-success-container {
  padding: 20px 0;
}

.export-success-icon-box {
  width: 76px;
  height: 76px;
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
  border-radius: 50%;
  color: #2e7d6b;
  box-shadow: 0 10px 20px rgba(46, 125, 107, 0.15);
}

.export-success-title {
  color: #1e293b;
  font-size: 1.3rem;
  letter-spacing: -0.2px;
}

.export-success-desc {
  font-size: 0.9rem;
  color: #64748b;
}

.export-success-highlight {
  color: #2e7d6b;
  font-weight: 700;
}

.export-stat-card {
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 10px 4px;
  text-align: center;
  transition: all 0.2s ease;
}

.export-stat-label {
  font-size: 0.78rem;
  color: #64748b;
  font-weight: 500;
  margin-bottom: 2px;
}

.export-stat-value {
  font-size: 0.92rem;
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
  background: linear-gradient(135deg, #2e7d6b 0%, #24584b 100%);
  color: #ffffff;
  font-weight: 600;
  font-size: 0.9rem;
  box-shadow: 0 4px 12px rgba(46, 125, 107, 0.25);
  transition: all 0.2s ease;
}

.btn-export-submit:hover {
  background: linear-gradient(135deg, #256b5b 0%, #1e4b40 100%);
  color: #ffffff;
  box-shadow: 0 6px 16px rgba(46, 125, 107, 0.35);
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
  --el-color-primary: #2e7d6b !important;
  --el-input-focus-border-color: #2e7d6b !important;
  --el-input-hover-border-color: #2e7d6b !important;
  --el-datepicker-active-color: #2e7d6b !important;
  --el-datepicker-hover-text-color: #2e7d6b !important;
}

.export-date-popper {
  border-radius: 14px !important;
  overflow: hidden !important;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12) !important;
}

.export-date-popper .el-date-table td.current:not(.disabled) .el-date-table-cell__text {
  background-color: #2e7d6b !important;
  color: #ffffff !important;
  font-weight: 700 !important;
  border-radius: 50% !important;
}

.export-date-popper .el-date-table td.today .el-date-table-cell__text {
  color: #2e7d6b !important;
  font-weight: 700 !important;
}

.export-date-popper .el-date-table td.available:hover {
  color: #2e7d6b !important;
}

.export-date-picker .el-input__wrapper.is-focus,
.export-date-picker .el-input__wrapper:focus,
.export-date-picker .el-input__wrapper:focus-within {
  border-color: #2e7d6b !important;
  box-shadow: 0 0 0 1px #2e7d6b inset, 0 0 0 3px rgba(46, 125, 107, 0.12) !important;
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
  width: 1000px !important;
}

.export-modal-dialog-wrapper .modal-content {
  width: 1050px !important;
  max-width: 95vw !important;
  border-radius: 16px !important;
}

.export-modal-dialog-wrapper .modal-body {
  max-height: calc(90vh - 130px);
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
}
</style>
