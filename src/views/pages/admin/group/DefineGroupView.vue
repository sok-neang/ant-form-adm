<template>
  <div class="container-fluid define-group-container py-2">
    <!-- PAGE HEADER -->
    <div class="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4">
      <div>
        <div class="d-flex align-items-center gap-2 mb-1">
          <h4 class="fw-bold mb-0 text-dark">កំណត់ក្រុម</h4>
          <span class="badge rounded-pill bg-primary-subtle text-primary px-3 py-1 fw-semibold small">
            វគ្គសិក្សា ២ សប្តាហ៍
          </span>
        </div>
        <p class="text-muted mb-0 small">
          បែងចែកសិស្សជាប់ក្នុងបញ្ជីសម្រាំងជាក្រុម ដើម្បីចូលរៀនវគ្គមូលដ្ឋាន ២ សប្តាហ៍តាមវេន និងក្រុមនីមួយៗ
        </p>
      </div>

      <div class="d-flex align-items-center gap-2">
        <button
          type="button"
          class="btn btn-outline-secondary d-inline-flex align-items-center gap-2 px-3 py-2 rounded-3"
          :disabled="loading"
          @click="loadAllData"
          title="ផ្ទុកទិន្នន័យឡើងវិញ"
        >
          <i class="bi bi-arrow-clockwise" :class="{ 'spin-anim': loading }"></i>
          <span class="d-none d-sm-inline">ផ្ទុកឡើងវិញ</span>
        </button>

        <button
          type="button"
          class="btn btn-primary d-inline-flex align-items-center gap-2 px-4 py-2 rounded-3 fw-semibold shadow-sm"
          @click="openAssignModal"
        >
          <i class="bi bi-diagram-3-fill"></i>
          <span>{{ currentSetting ? 'បែងចែកក្រុមឡើងវិញ' : 'បែងចែកក្រុម' }}</span>
        </button>
      </div>
    </div>

    <!-- STAT CARDS ROW -->
    <div class="row g-3 mb-4">
      <!-- 1. Total Shortlisted -->
      <div class="col-12 col-sm-6 col-xl-3">
        <div class="stat-card p-3 rounded-4 bg-white border border-primary-subtle h-100 d-flex align-items-center gap-3">
          <div class="stat-icon bg-primary-subtle text-primary rounded-3 d-flex align-items-center justify-content-center">
            <i class="bi bi-people-fill fs-4"></i>
          </div>
          <div class="min-w-0 flex-grow-1">
            <span class="text-muted small fw-medium d-block">សិស្សជាប់សម្រាំងសរុប</span>
            <div v-if="loading" class="my-1">
              <BaseSkeleton width="80px" height="28px" radius="6px" />
            </div>
            <h3 v-else class="fw-bold mb-0 text-dark">
              {{ currentSetting?.shortlistedCount || 0 }}
              <span class="fs-6 fw-normal text-muted"> នាក់</span>
            </h3>
          </div>
        </div>
      </div>

      <!-- 2. Number of Groups -->
      <div class="col-12 col-sm-6 col-xl-3">
        <div class="stat-card p-3 rounded-4 bg-white border border-primary-subtle h-100 d-flex align-items-center gap-3">
          <div class="stat-icon bg-warning-subtle text-warning rounded-3 d-flex align-items-center justify-content-center">
            <i class="bi bi-grid-3x3-gap-fill fs-4"></i>
          </div>
          <div class="min-w-0 flex-grow-1">
            <span class="text-muted small fw-medium d-block">ចំនួនក្រុមបច្ចុប្បន្ន</span>
            <div v-if="loading" class="my-1">
              <BaseSkeleton width="80px" height="28px" radius="6px" />
            </div>
            <h3 v-else class="fw-bold mb-0 text-dark">
              {{ currentSetting?.numberOfGroups ?? groupsList.length ?? 0 }}
              <span class="fs-6 fw-normal text-muted"> ក្រុម</span>
            </h3>
          </div>
        </div>
      </div>

      <!-- 3. Students Per Group -->
      <div class="col-12 col-sm-6 col-xl-3">
        <div class="stat-card p-3 rounded-4 bg-white border border-primary-subtle h-100 d-flex align-items-center gap-3">
          <div class="stat-icon bg-info-subtle text-info rounded-3 d-flex align-items-center justify-content-center">
            <i class="bi bi-person-badge-fill fs-4"></i>
          </div>
          <div class="min-w-0 flex-grow-1">
            <span class="text-muted small fw-medium d-block">សិស្សក្នុងមួយក្រុម</span>
            <div v-if="loading" class="my-1">
              <BaseSkeleton width="110px" height="28px" radius="6px" />
            </div>
            <h3 v-else class="fw-bold mb-0 text-dark">
              {{ currentSetting?.studentsPerGroup ?? averagePerGroup ?? 0 }}
              <span class="fs-6 fw-normal text-muted"> នាក់/ក្រុម</span>
            </h3>
          </div>
        </div>
      </div>

      <!-- 4. Last Configured -->
      <div class="col-12 col-sm-6 col-xl-3">
        <div class="stat-card p-3 rounded-4 bg-white border border-primary-subtle h-100 d-flex align-items-center gap-3">
          <div class="stat-icon bg-success-subtle text-success rounded-3 d-flex align-items-center justify-content-center">
            <i class="bi bi-calendar-check-fill fs-4"></i>
          </div>
          <div class="min-w-0 flex-grow-1">
            <span class="text-muted small fw-medium d-block">អ្នកកំណត់ចុងក្រោយ</span>
            <div v-if="loading" class="my-1 d-flex flex-column gap-1">
              <BaseSkeleton width="110px" height="18px" radius="6px" />
              <BaseSkeleton width="70px" height="13px" radius="4px" />
            </div>
            <div v-else>
              <h6 class="fw-bold mb-0 text-dark text-truncate" :title="currentSetting?.createdBy?.name || '—'">
                {{ currentSetting?.createdBy?.name || 'មិនទាន់មាន' }}
              </h6>
              <span class="text-muted small" style="font-size: 0.75rem;">
                {{ formatDate(currentSetting?.createdAt) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- GROUPS VISUAL GRID -->
    <div class="card border-0 rounded-4 shadow-sm bg-white p-4 mb-4">
      <div class="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h5 class="fw-bold text-dark mb-1">
            <i class="bi bi-diagram-3 me-2 text-primary"></i>
            បញ្ជីក្រុមដែលបានបែងចែក
          </h5>
          <p class="text-muted mb-0 small">
            សិស្សត្រូវបានបែងចែកចូលក្រុមនីមួយៗ សម្រាប់ចូលរៀនវគ្គសិក្សាមូលដ្ឋាន ២ សប្តាហ៍តាមលំដាប់លំដោយ
          </p>
        </div>

        <span v-if="groupsList.length > 0" class="badge rounded-pill bg-light text-secondary border px-3 py-2">
          សរុប {{ groupsList.length }} ក្រុម
        </span>
      </div>

      <!-- Loading skeleton -->
      <div v-if="loading" class="row g-3">
        <div v-for="i in 3" :key="i" class="col-12 col-md-6 col-xl-4">
          <div class="p-4 rounded-4 border bg-white shadow-sm h-100">
            <div class="d-flex align-items-center justify-content-between mb-3">
              <div class="d-flex align-items-center gap-2">
                <BaseSkeleton width="38px" height="38px" radius="50%" :circle="true" />
                <div class="d-flex flex-column gap-1">
                  <BaseSkeleton width="100px" height="20px" radius="6px" />
                  <BaseSkeleton width="140px" height="13px" radius="4px" />
                </div>
              </div>
              <BaseSkeleton width="54px" height="28px" radius="16px" />
            </div>

            <div class="d-flex align-items-baseline gap-2 mb-3">
              <BaseSkeleton width="60px" height="34px" radius="6px" />
              <BaseSkeleton width="35px" height="18px" radius="4px" />
            </div>

            <!-- Progress skeleton -->
            <BaseSkeleton width="100%" height="8px" radius="8px" class="mb-3" />

            <div class="d-flex justify-content-between align-items-center pt-2 border-top">
              <BaseSkeleton width="70px" height="14px" radius="4px" />
              <BaseSkeleton width="90px" height="14px" radius="4px" />
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State: No groups assigned yet -->
      <div
        v-else-if="groupsList.length === 0"
        class="text-center py-5 px-3 rounded-4 border border-dashed bg-light-soft my-2"
      >
        <div class="empty-icon-wrapper mx-auto mb-3 rounded-circle d-flex align-items-center justify-content-center bg-primary-subtle text-primary">
          <i class="bi bi-diagram-3 fs-1"></i>
        </div>
        <h5 class="fw-bold text-dark mb-2">មិនទាន់បានបែងចែកក្រុមនៅឡើយទេ</h5>
        <p class="text-muted mb-4 mx-auto" style="max-width: 480px;">
          សូមចុចប៊ូតុងខាងក្រោម ដើម្បីកំណត់ចំនួនក្រុម និងបែងចែកសិស្សជាប់ក្នុងបញ្ជីសម្រាំងចូលក្នុងក្រុមនីមួយៗ។
        </p>
        <button
          type="button"
          class="btn btn-primary px-4 py-2 rounded-3 fw-semibold shadow-sm"
          @click="openAssignModal"
        >
          <i class="bi bi-plus-circle me-2"></i>
          ចាប់ផ្ដើមបែងចែកក្រុម
        </button>
      </div>

      <!-- Groups Cards Grid -->
      <div v-else class="row g-3">
        <div
          v-for="grp in groupsList"
          :key="grp.group"
          class="col-12 col-md-6 col-xl-4"
        >
          <div class="group-card p-4 rounded-4 border h-100 position-relative">
            <div class="d-flex align-items-center justify-content-between mb-3">
              <div class="d-flex align-items-center gap-2">
                <span class="group-badge-icon mb-4"></span>
                <div>
                  <h5 class="fw-bold mb-0 text-dark">
                    ក្រុមទី {{ grp.group }}</h5>
                  <span class="text-muted small" style="font-size: 0.78rem;">
                    វគ្គសិក្សា ២ សប្តាហ៍ (Batch {{ grp.group }})
                  </span>
                </div>
              </div>

              <span class="badge rounded-pill bg-primary-subtle text-primary fw-bold px-3 py-2">
                {{ getGroupPercentage(grp.studentCount) }}%
              </span>
            </div>

            <div class="d-flex align-items-baseline gap-2 mb-3">
              <h2 class="fw-bold mb-0 text-dark">{{ grp.studentCount }}</h2>
              <span class="text-muted fw-semibold">សិស្ស</span>
            </div>

            <!-- Progress Bar -->
            <div class="progress mb-2" style="height: 8px; border-radius: 8px;">
              <div
                class="progress-bar bg-primary"
                role="progressbar"
                :style="{ width: `${getGroupPercentage(grp.studentCount)}%` }"
                :aria-valuenow="grp.studentCount"
                aria-valuemin="0"
                :aria-valuemax="totalShortlistedCount || 100"
              ></div>
            </div>

            <div class="d-flex justify-content-between align-items-center text-muted small mt-3 pt-2 border-top">
              <span>ស្ថានភាពវគ្គ</span>
              <span class="text-primary fw-semibold d-inline-flex align-items-center gap-1">
                <i class="bi bi-clock-history"></i>
                ត្រៀមដំណើរការ
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ================= MODALS ================= -->
    <BaseModal
      :show="showAssignModal"
      size="md"
      :showClose="!isAssigning"
      @close="closeAssignModal"
    >
      <template #header>
        <div class="d-flex align-items-center gap-3">
          <div class="stat-icon bg-primary-subtle text-primary rounded-3 d-flex align-items-center justify-content-center" style="width: 44px; height: 44px;">
            <i class="bi bi-diagram-3-fill fs-5"></i>
          </div>
          <div>
            <h5 class="fw-bold text-dark mb-0">បែងចែកក្រុមសិស្សជាប់សម្រាំង</h5>
            <span class="text-muted small">វគ្គសិក្សាមូលដ្ឋាន ២ សប្តាហ៍</span>
          </div>
        </div>
      </template>

      <div class="py-2">
        <p class="text-secondary mb-4 small lh-base">
          កំណត់ចំនួនក្រុមដើម្បីបែងចែកសិស្សដែលជាប់ក្នុងបញ្ជីសម្រាំង ចូលទៅក្នុងក្រុមវគ្គសិក្សា ២ សប្តាហ៍តាមលំដាប់លំដោយ។
        </p>

        <!-- 1. Total Students Input -->
        <div class="mb-3">
          <label class="form-label fw-semibold text-dark small mb-1">
            ចំនួនសិស្សជាប់សម្រាំងសរុប (Total Shortlisted Students)
          </label>
          <div class="input-group">
            <span class="input-group-text bg-light text-muted">
              <i class="bi bi-people"></i>
            </span>
            <input
              v-model.number="formTotalStudents"
              type="number"
              min="1"
              class="form-control"
              :placeholder="totalShortlistedCount"
            />
          </div>
          <span class="text-muted small" style="font-size: 0.75rem;">
            * ប្រព័ន្ធទាញយកចំនួនសិស្សជាប់សម្រាំងស្វ័យប្រវត្តិចំនួន {{ totalShortlistedCount || 0 }} នាក់
          </span>
        </div>

        <!-- 2. Number of Groups Input -->
        <div class="mb-4">
          <label class="form-label fw-semibold text-dark small mb-1">
            ចំនួនក្រុមដែលត្រូវបែងចែក (Number of Groups) <span class="text-danger">*</span>
          </label>
          <div class="d-flex align-items-center gap-2">
            <button
              type="button"
              class="btn btn-outline-primary px-3 py-2"
              :disabled="formNumberOfGroups <= 1"
              @click="formNumberOfGroups = Math.max(1, formNumberOfGroups - 1)"
            >
              <i class="bi bi-dash"></i>
            </button>
            <input
              v-model.number="formNumberOfGroups"
              type="number"
              min="1"
              max="50"
              class="form-control text-center fw-bold fs-5"
            />
            <button
              type="button"
              class="btn btn-outline-primary px-3 py-2"
              @click="formNumberOfGroups++"
            >
              <i class="bi bi-plus"></i>
            </button>
          </div>
        </div>

        <!-- Real-Time Calculation Preview Card -->
        <div class="p-3 rounded-4 bg-light-soft border mb-3">
          <div class="d-flex align-items-center justify-content-between mb-2">
            <span class="fw-semibold text-dark small">
              <i class="bi bi-calculator me-1 text-primary"></i>
              ការគណនាបែងចែកសាកល្បង៖
            </span>
            <span class="badge bg-primary text-white rounded-pill px-2 py-1 small">
              {{ formNumberOfGroups }} ក្រុម
            </span>
          </div>

          <div class="row g-2 text-center my-2">
            <div
              v-for="gNum in Math.min(formNumberOfGroups, 6)"
              :key="gNum"
              class="col"
            >
              <div class="p-2 rounded-3 bg-white border">
                <span class="text-muted d-block" style="font-size: 0.72rem;">ក្រុម {{ gNum }}</span>
                <span class="fw-bold text-dark fs-6">{{ getPreviewGroupCount(gNum) }}</span>
                <span class="text-muted d-block" style="font-size: 0.7rem;">នាក់</span>
              </div>
            </div>
            <div v-if="formNumberOfGroups > 6" class="col-auto d-flex align-items-center text-muted small">
              +{{ formNumberOfGroups - 6 }} ក្រុមទៀត...
            </div>
          </div>

          <div class="text-muted small mt-2 d-flex align-items-center justify-content-between" style="font-size: 0.78rem;">
            <span>មធ្យមភាគក្នុងមួយក្រុម៖</span>
            <span class="fw-bold text-primary">~{{ calculatedPerGroupPreview }} នាក់/ក្រុម</span>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="d-flex justify-content-end gap-2 w-100">
          <button
            type="button"
            class="btn btn-light px-4 border"
            :disabled="isAssigning"
            @click="closeAssignModal"
          >
            បោះបង់
          </button>
          <button
            type="button"
            class="btn btn-primary px-4 fw-semibold shadow-sm d-inline-flex align-items-center gap-2"
            :disabled="isAssigning || formNumberOfGroups < 1 || formTotalStudents < 1"
            @click="submitAssignGroups"
          >
            <span v-if="isAssigning" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            <span>{{ isAssigning ? 'កំពុងបែងចែក...' : 'យល់ព្រមបែងចែក' }}</span>
          </button>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import BaseSkeleton from "@/components/ui/base/BaseSkeleton.vue";
import BaseModal from "@/components/ui/base/BaseModal.vue";
import groupService from "@/services/group.service";
import submissionService from "@/services/submission.service";
import dashboardService from "@/services/dashboard.service";
import { useAppToast } from "@/composable/useAppToast";

const toast = useAppToast();

// State
const loading = ref(true);
const isAssigning = ref(false);
const showAssignModal = ref(false);

const currentSetting = ref(null);
const groupsList = ref([]);
const totalShortlistedCount = ref(0);

// Form State in Modal
const formNumberOfGroups = ref(2);
const formTotalStudents = ref(0);

// Calculated stats
const averagePerGroup = computed(() => {
  if (!currentSetting.value?.numberOfGroups || !totalShortlistedCount.value) return 0;
  return Math.round(totalShortlistedCount.value / currentSetting.value.numberOfGroups);
});

const calculatedPerGroupPreview = computed(() => {
  const total = Number(formTotalStudents.value) || 0;
  const groups = Number(formNumberOfGroups.value) || 1;
  if (total <= 0 || groups <= 0) return 0;
  return Math.round(total / groups);
});

const getPreviewGroupCount = (groupNumber) => {
  const total = Number(formTotalStudents.value) || 0;
  const groups = Number(formNumberOfGroups.value) || 1;
  if (total <= 0 || groups <= 0) return 0;

  const base = Math.floor(total / groups);
  const remainder = total % groups;
  return groupNumber <= remainder ? base + 1 : base;
};

const getGroupPercentage = (count) => {
  const total = currentSetting.value?.shortlistedCount || totalShortlistedCount.value || 1;
  if (!total) return 0;
  return Math.round(((count || 0) / total) * 100);
};

const formatDate = (isoString) => {
  if (!isoString) return "—";
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString("km-KH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (e) {
    return isoString;
  }
};

// Helper to extract query-filtered or overall total from API responses
const extractShortlistTotal = (res) => {
  if (!res?.data) return 0;
  const resData = res.data;
  const meta = resData.data?.pagination || resData.pagination;
  if (meta) {
    if (meta.total !== undefined && meta.total !== null && !isNaN(Number(meta.total))) {
      return Number(meta.total);
    }
    if (meta.count !== undefined && meta.count !== null && !isNaN(Number(meta.count))) {
      return Number(meta.count);
    }
    if (meta.totalSubmissions !== undefined && meta.totalSubmissions !== null && !isNaN(Number(meta.totalSubmissions))) {
      return Number(meta.totalSubmissions);
    }
  }

  if (Array.isArray(resData.data)) return resData.data.length;
  if (Array.isArray(resData.data?.submissions)) return resData.data.submissions.length;
  if (Array.isArray(resData.submissions)) return resData.submissions.length;
  return 0;
};

// Load Group Setting & Groups from GET /settings/groups
const fetchGroupSettings = async () => {
  try {
    const res = await groupService.getGroupSettings();
    if (res.data?.success && res.data?.data) {
      const data = res.data.data;
      currentSetting.value = data.setting || null;
      groupsList.value = Array.isArray(data.groups) ? data.groups : [];

      if (!totalShortlistedCount.value && data.setting?.shortlistedCount) {
        totalShortlistedCount.value = data.setting.shortlistedCount;
      }
      if (data.setting?.numberOfGroups) {
        formNumberOfGroups.value = data.setting.numberOfGroups;
      }
    }
  } catch (err) {
    console.warn("No existing group settings found or failed to load:", err);
  }
};

// Load dynamic total shortlisted candidates count directly from shortlist API
const fetchShortlistedCount = async () => {
  try {
    const res = await submissionService.getShortlist({ limit: 1 });
    const total = extractShortlistTotal(res);
    if (total > 0) {
      totalShortlistedCount.value = total;
      return total;
    }
  } catch (err) {
    console.warn("Could not fetch shortlist count from getShortlist:", err);
  }

  // Fallback: fetch from dashboard stats
  try {
    const dashRes = await dashboardService.getStats();
    const stats = dashRes.data?.data;
    const statsTotal = stats?.shortlist?.passed?.total ?? stats?.shortlist?.total;
    if (statsTotal && Number(statsTotal) > 0) {
      totalShortlistedCount.value = Number(statsTotal);
      return Number(statsTotal);
    }
  } catch (err) {
    console.warn("Could not fetch shortlist count from dashboard stats:", err);
  }

  // Fallback to setting snapshot if live API calls failed
  if (!totalShortlistedCount.value && currentSetting.value?.shortlistedCount) {
    totalShortlistedCount.value = currentSetting.value.shortlistedCount;
  }
  return totalShortlistedCount.value;
};

const loadAllData = async () => {
  loading.value = true;
  await Promise.allSettled([fetchShortlistedCount(), fetchGroupSettings()]);
  loading.value = false;
};

// Open Assign Modal
const openAssignModal = async () => {
  await fetchShortlistedCount();
  formTotalStudents.value = totalShortlistedCount.value || currentSetting.value?.shortlistedCount || 0;
  formNumberOfGroups.value = currentSetting.value?.numberOfGroups || 2;
  showAssignModal.value = true;
};

const closeAssignModal = () => {
  if (isAssigning.value) return;
  showAssignModal.value = false;
};

// Submit Group Assignment POST /settings/groups/assign
const submitAssignGroups = async () => {
  const groupsCount = Number(formNumberOfGroups.value);
  const studentsCount = Number(formTotalStudents.value);

  if (!groupsCount || groupsCount < 1) {
    toast.warning("សូមបញ្ចូលចំនួនក្រុមយ៉ាងតិច ១");
    return;
  }
  if (!studentsCount || studentsCount < 1) {
    toast.warning("សូមបញ្ចូលចំនួនសិស្សជាប់សម្រាំងសរុប");
    return;
  }

  isAssigning.value = true;
  try {
    const payload = {
      numberOfGroups: groupsCount,
      totalStudents: studentsCount,
    };

    const res = await groupService.assignGroups(payload);
    if (res.data?.success) {
      toast.success(res.data.message || `បានបែងចែកសិស្សចំនួន ${studentsCount} នាក់ជា ${groupsCount} ក្រុមដោយជោគជ័យ`);

      if (res.data.data) {
        currentSetting.value = res.data.data.setting || currentSetting.value;
        groupsList.value = res.data.data.groups || groupsList.value;
        if (res.data.data.setting?.shortlistedCount) {
          totalShortlistedCount.value = res.data.data.setting.shortlistedCount;
        }
      }

      showAssignModal.value = false;
      await fetchGroupSettings();
    } else {
      toast.error(res.data?.message || "ការបែងចែកក្រុមបរាជ័យ");
    }
  } catch (err) {
    console.error("Failed to assign groups:", err);
    const msg = err.response?.data?.message || "មិនអាចបែងចែកក្រុមបានទេ សូមព្យាយាមម្ដងទៀត";
    toast.error(msg);
  } finally {
    isAssigning.value = false;
  }
};

onMounted(() => {
  loadAllData();
});
</script>

<style scoped>
.define-group-container {
  min-height: calc(100vh - 120px);
}

.stat-card {
  border: 1px solid #eef2f6;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(38, 98, 217, 0.08) !important;
}

.stat-icon {
  width: 52px;
  height: 52px;
  flex-shrink: 0;
}

.bg-light-soft {
  background-color: #f8fafc;
}

.empty-icon-wrapper {
  width: 72px;
  height: 72px;
}

.group-card {
  background: #ffffff;
  border: 1px solid #eef2f6 !important;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.group-card:hover {
  transform: translateY(-3px);
  border-color: rgba(38, 98, 217, 0.35) !important;
  box-shadow: 0 8px 24px rgba(38, 98, 217, 0.12) !important;
}

.group-badge-icon {
  width: 10px;
  height: 10px;
  background: #3b5aba;
  border-radius: 100%;
  font-size: 1.05rem;
}

.spin-anim {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}
</style>
