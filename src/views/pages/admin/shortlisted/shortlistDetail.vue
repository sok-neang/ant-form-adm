<template>
  <DetailStudent :key="detailStudentKey" @loaded="onDataLoaded">
    <!-- Badge -->
    <template #badge="{ submission }">
      <div class="d-flex align-items-center gap-2 flex-wrap">
        <!-- Status Badge -->
        <span
          class="badge rounded-pill px-3 py-2 fw-semibold"
          :class="getStatusInfo(submission).color"
          :style="getStatusInfo(submission).style"
        >
          {{ getStatusInfo(submission).text }}
        </span>

        <!-- Group Number Badge (shown ONLY for SHORTLIST status) -->
        <template v-if="isShortlistStatus(submission)">
          <span
            v-if="getGroupNumber(submission)"
            class="badge rounded-pill px-3 py-2 fw-semibold d-inline-flex align-items-center gap-1.5"
            style="color: var(--bs-primary, #2662d9); background-color: rgba(38, 98, 217, 0.12); font-size: 0.85rem;"
          >
            <i class="bi bi-people-fill me-1"></i>
            <span>ក្រុម {{ getGroupNumber(submission) }}</span>
          </span>
          <span
            v-else
            class="badge bg-secondary-subtle text-secondary rounded-pill px-3 py-2 small fw-medium"
            style="font-size: 0.85rem;"
          >
            <i class="bi bi-people me-2"></i>
            មិនទាន់មានក្រុម
          </span>
        </template>
      </div>
    </template>

    <!-- Footer Actions -->
    <template #footer-actions="{ goBack }">
      <!-- Back -->
      <button
        type="button"
        class="btn btn-light border px-4"
        @click="goBack"
      >
        <i class="bi bi-arrow-left me-2"></i>
        ត្រឡប់
      </button>

      <div class="d-flex flex-wrap gap-2">
        <!-- Change Group (Only for SHORTLIST status) -->
        <button
          v-if="isShortlistStatus()"
          type="button"
          class="btn btn-outline-primary px-3 px-md-4 d-inline-flex align-items-center gap-2"
          @click="openChangeGroupModal"
          :disabled="isUpdating || isSubmittingGroup"
          title="ប្ដូរក្រុម (Change Group)"
        >
          <i class="bi bi-people"></i>
          <span>ប្ដូរក្រុម</span>
        </button>

        <button
          type="button"
          class="btn blacklist-btn px-4"
          @click="openActionModal('BLACKLIST')"
          :disabled="isUpdating"
        >
          <i class="bi bi-person-x-fill me-2"></i>
          បញ្ជីខ្មៅ
        </button>
        <button
          type="button"
          class="btn blacklist-btn px-4"
          @click="openActionModal('DROPOUT')"
          :disabled="isUpdating"
        >
          <i class="bi bi-person-x-fill me-2"></i>
          បោះបង់
        </button>
        <button
          v-if="!isFailed"
          type="button"
          class="btn reject-btn px-4"
          @click="openActionModal('FAILED_EVALUATION')"
          :disabled="isUpdating"
        >
          <i class="bi bi-person-x-fill me-2"></i>
          ធ្លាក់
        </button>
        <button
          v-if="!isReserved"
          type="button"
          class="btn text-white px-4"
          style="background-color: #f59e0b; border-color: #f59e0b;"
          @click="openActionModal('RESERVED')"
          :disabled="isUpdating"
        >
          <i class="bi bi-person-lines-fill me-2"></i>
          បម្រុង
        </button>
        <button
          v-if="!isPassed"
          type="button"
          class="btn shortlist-btn px-4 text-white"
          style="background-color: var(--bs-primary, #2662d9); border-color: var(--bs-primary, #2662d9);"
          @click="openActionModal('PASS')"
          :disabled="isUpdating"
        >
          <i class="bi bi-person-check-fill me-2"></i>
          ជាប់
        </button>
      </div>
    </template>

    <!-- Modals -->
    <template #modals>
      <BaseModal 
        :show="showActionModal" 
        :title="actionModalTitle" 
        size="md" 
        @close="showActionModal = false"
      >
        <div class="py-2">
          <p class="text-secondary mb-3 fs-6 lh-base">
            {{ actionModalPrompt }}
          </p>

          <!-- Reason & Note only for Blacklist and Dropout -->
          <template v-if="isReasonRequired">
            <div class="mb-3">
              <label class="form-label">
                មូលហេតុ (Reason) <span class="text-danger">*</span>
              </label>
              <textarea 
                v-model="actionReason" 
                class="form-control shadow-none border-secondary-subtle" 
                :class="{ 'is-invalid border-danger': reasonError }"
                rows="3" 
                placeholder="បញ្ចូលមូលហេតុ..."
                @input="reasonError = ''"
              ></textarea>
              <div v-if="reasonError" class="text-danger small mt-1">
                {{ reasonError }}
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label">កំណត់សម្គាល់ (Note - Optional)</label>
              <textarea 
                v-model="actionNote" 
                class="form-control shadow-none border-secondary-subtle" 
                rows="2" 
                placeholder="បញ្ចូលកំណត់ចំណាំបន្ថែម..."
              ></textarea>
            </div>
          </template>
        </div>

        <div class="d-flex justify-content-end gap-2 mt-3">
          <button type="button" class="btn btn-light px-4" @click="showActionModal = false">
            បោះបង់
          </button>
          <button 
            type="button" 
            class="btn btn-primary px-4" 
            style="background-color: var(--bs-primary, #2662d9); border-color: var(--bs-primary, #2662d9);"
            @click="submitActionModal" 
            :disabled="isUpdating || (isReasonRequired && !actionReason.trim())"
          >
            <span v-if="isUpdating" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            យល់ព្រម
          </button>
        </div>
      </BaseModal>

      <!-- Change Group Modal -->
      <BaseModal
        :show="showGroupModal"
        size="md"
        :showClose="!isSubmittingGroup"
        @close="closeGroupModal"
      >
        <template #header>
          <div class="d-flex align-items-center gap-3">
            <div
              class="bg-primary-subtle text-primary rounded-3 d-flex align-items-center justify-content-center"
              style="width: 44px; height: 44px;"
            >
              <i class="bi bi-people fs-5"></i>
            </div>
            <div>
              <h5 class="fw-bold mb-0 text-dark">ប្ដូរក្រុមសិស្ស</h5>
              <span class="text-muted small">ជ្រើសរើសក្រុមថ្មីសម្រាប់បេក្ខជន</span>
            </div>
          </div>
        </template>

        <div class="py-2">
          <!-- Student Info Card -->
          <div class="p-3 rounded-3 bg-light border mb-3">
            <div class="d-flex align-items-center justify-content-between mb-2">
              <span class="fw-bold text-dark fs-6">{{ studentDisplayName }}</span>
              <span
                v-if="currentGroupNumber"
                class="badge rounded-pill px-3 py-1 fw-semibold"
                style="color: var(--bs-primary, #2662d9); background-color: rgba(38, 98, 217, 0.12);"
              >
                ក្រុម {{ currentGroupNumber }}
              </span>
              <span v-else class="badge bg-secondary-subtle text-secondary rounded-pill px-2.5 py-1 small">
                មិនទាន់មានក្រុម
              </span>
            </div>
            <div class="d-flex align-items-center gap-3 text-muted small flex-wrap">
              <span><i class="bi bi-laptop me-1"></i>{{ studentSkill }}</span>
              <span><i class="bi bi-clock me-1"></i>{{ studentShift }}</span>
              <span><i class="bi bi-person me-1"></i>{{ studentGender }}</span>
            </div>
          </div>

          <!-- Group Selector -->
          <div class="mb-3">
            <label class="form-label small fw-semibold text-dark mb-1">
              ជ្រើសរើសក្រុមថ្មី (New Group) <span class="text-danger">*</span>
            </label>
            <BaseSelect
              v-model="newGroupNumber"
              :options="groupModalOptions"
              option-label="label"
              option-value="value"
              placeholder="ជ្រើសរើសក្រុម"
              :clearable="false"
              :searchable="false"
            />
          </div>

          <!-- Preview comparison -->
          <div
            v-if="newGroupNumber && newGroupNumber !== String(currentGroupNumber)"
            class="alert alert-primary py-2 px-3 small d-flex align-items-center gap-2 mb-0"
          >
            <i class="bi bi-arrow-left-right text-primary"></i>
            <span>
              ប្ដូរពី <strong>{{ currentGroupNumber ? `ក្រុម ${currentGroupNumber}` : 'គ្មានក្រុម' }}</strong> ទៅកាន់ <strong>ក្រុម {{ newGroupNumber }}</strong>
            </span>
          </div>
        </div>

        <template #footer>
          <div class="d-flex justify-content-end gap-2 w-100">
            <button
              type="button"
              class="btn btn-light px-4 border"
              :disabled="isSubmittingGroup"
              @click="closeGroupModal"
            >
              បោះបង់
            </button>
            <button
              type="button"
              class="btn btn-primary px-4 d-inline-flex align-items-center gap-2 shadow-sm"
              :disabled="isSubmittingGroup || !newGroupNumber || newGroupNumber === String(currentGroupNumber)"
              @click="handleConfirmChangeGroup"
            >
              <span
                v-if="isSubmittingGroup"
                class="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
              <span>{{ isSubmittingGroup ? 'កំពុងរក្សាទុក...' : 'យល់ព្រមប្ដូរ' }}</span>
            </button>
          </div>
        </template>
      </BaseModal>
    </template>
  </DetailStudent>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import DetailStudent from "@/components/ui/detailStudent.vue";
import BaseModal from "@/components/ui/base/BaseModal.vue";
import BaseSelect from "@/components/ui/base/BaseSelect.vue";
import submissionService from "@/services/submission.service";
import groupService from "@/services/group.service";
import { groupOptions } from "@/constants/options";
import { useAppToast } from "@/composable/useAppToast";

const route = useRoute();
const router = useRouter();
const toast = useAppToast();

const detailStudentKey = ref(0);
const isUpdating = ref(false);
const showActionModal = ref(false);
const actionType = ref("");
const actionReason = ref("");
const actionNote = ref("");
const reasonError = ref("");
const currentSubmission = ref(null);
const currentStudent = ref(null);
const loadedGroupNumber = ref(null);

// Change Group State
const showGroupModal = ref(false);
const isSubmittingGroup = ref(false);
const newGroupNumber = ref("");
const groupSelectOptions = ref([...groupOptions]);

const fetchGroupOptions = async () => {
  try {
    const res = await groupService.getGroupSettings();
    if (res.data?.success && res.data?.data) {
      const groups = res.data.data.groups;
      const numGroups = res.data.data.setting?.numberOfGroups;
      if (Array.isArray(groups) && groups.length > 0) {
        groupSelectOptions.value = [
          { value: "", label: "ក្រុមទាំងអស់" },
          ...groups.map((g) => {
            const val = g.group ?? g.groupNumber ?? g.number ?? g.id;
            return {
              value: String(val),
              label: g.name || `ក្រុម ${val}`,
            };
          }),
        ];
      } else if (numGroups && Number(numGroups) > 0) {
        const count = Number(numGroups);
        const dynamicList = [{ value: "", label: "ក្រុមទាំងអស់" }];
        for (let i = 1; i <= count; i++) {
          dynamicList.push({ value: String(i), label: `ក្រុម ${i}` });
        }
        groupSelectOptions.value = dynamicList;
      }
    }
  } catch (err) {
    console.error("Error fetching group options:", err);
  }
};

const groupModalOptions = computed(() => {
  return groupSelectOptions.value.filter(
    (opt) => opt.value !== "" && opt.value !== "undefined" && !opt.label?.includes("undefined")
  );
});

const getGroupNumber = (sub) => {
  const target = sub || currentSubmission.value;
  const num =
    target?.groupNumber ??
    target?.submissionGroup?.groupNumber ??
    target?.submissionGroup?.group ??
    target?.group_number ??
    target?.submissionGroup?.group?.groupNumber ??
    target?.submissionGroup?.group?.group ??
    target?.group?.groupNumber ??
    target?.group?.group ??
    target?.group?.number ??
    target?.submission?.groupNumber ??
    target?.submission?.submissionGroup?.groupNumber ??
    target?.raw?.groupNumber ??
    target?.raw?.submissionGroup?.groupNumber ??
    target?.raw?.group_number ??
    target?.group ??
    loadedGroupNumber.value ??
    null;

  if (num != null && num !== "" && num !== "undefined" && num !== "null") {
    const match = String(num).match(/\d+/);
    return match ? match[0] : null;
  }
  return null;
};

const currentGroupNumber = computed(() => {
  return getGroupNumber(currentSubmission.value);
});

const isShortlistStatus = (sub) => {
  const target = sub || currentSubmission.value;
  const s = String(target?.status || "").toUpperCase();
  if (
    [
      "PASS",
      "PASSED",
      "RESERVED",
      "RESERVE",
      "FAILED_EVALUATION",
      "FAIL",
      "FAILED",
      "FAILED_SHORTLIST",
      "BLACKLIST",
      "BLACKLISTED",
      "DROPOUT",
      "DROP_OUT",
      "SUBMIT",
      "SUBMITTED",
    ].includes(s)
  ) {
    return false;
  }
  return s === "SHORTLIST" || s === "" || s === "SHORTLISTED";
};

const studentDisplayName = computed(() => {
  return (
    currentStudent.value?.khName ||
    currentStudent.value?.enName ||
    currentSubmission.value?.student?.khName ||
    currentSubmission.value?.student?.enName ||
    currentSubmission.value?.khName ||
    currentSubmission.value?.enName ||
    "N/A"
  );
});

const studentSkill = computed(() => {
  const p = currentSubmission.value?.program;
  if (p === "MOBILE_APP") return "Mobile App";
  if (p === "WEB_DEVELOPMENT") return "Web Development";
  return p || "—";
});

const studentShift = computed(() => {
  const s = currentSubmission.value?.shift;
  if (s === "MORNING") return "វេនព្រឹក";
  if (s === "AFTERNOON") return "វេនរសៀល";
  return s || "—";
});

const studentGender = computed(() => {
  const g =
    currentStudent.value?.gender ||
    currentSubmission.value?.student?.gender ||
    currentSubmission.value?.gender;
  if (g === "MALE") return "ប្រុស";
  if (g === "FEMALE") return "ស្រី";
  return g || "—";
});

const openChangeGroupModal = () => {
  const currentNum = currentGroupNumber.value;
  newGroupNumber.value = currentNum ? String(currentNum) : "";
  showGroupModal.value = true;
};

const closeGroupModal = () => {
  if (isSubmittingGroup.value) return;
  showGroupModal.value = false;
  newGroupNumber.value = "";
};

const handleConfirmChangeGroup = async () => {
  const id = activeSubmissionId.value;
  if (!id || !newGroupNumber.value) {
    toast.warning("សូមជ្រើសរើសក្រុមថ្មី");
    return;
  }

  isSubmittingGroup.value = true;
  try {
    const res = await submissionService.updateStudentGroup(
      id,
      Number(newGroupNumber.value)
    );

    if (res.data?.success !== false) {
      toast.success("បានផ្លាស់ប្ដូរក្រុមសិស្សដោយជោគជ័យ" || res.data?.message);

      loadedGroupNumber.value = Number(newGroupNumber.value);
      if (currentSubmission.value) {
        currentSubmission.value.groupNumber = Number(newGroupNumber.value);
        if (currentSubmission.value.submissionGroup) {
          currentSubmission.value.submissionGroup.groupNumber = Number(newGroupNumber.value);
        } else {
          currentSubmission.value.submissionGroup = { groupNumber: Number(newGroupNumber.value) };
        }
      }

      showGroupModal.value = false;
      newGroupNumber.value = "";

      // Force rerender / refresh DetailStudent
      detailStudentKey.value += 1;
    } else {
      toast.error("បរាជ័យក្នុងការប្ដូរក្រុម" || res.data?.message);
    }
  } catch (err) {
    console.error("Error updating student group:", err);
    const msg = err.response?.data?.message || err.message || "មិនអាចប្ដូរក្រុមបានទេ";
    toast.error(msg);
  } finally {
    isSubmittingGroup.value = false;
  }
};

const extractSubmissionsList = (res) => {
  if (!res?.data) return [];
  const d = res.data.data !== undefined ? res.data.data : res.data;
  if (Array.isArray(d)) return d;
  if (Array.isArray(d?.submissions)) return d.submissions;
  if (Array.isArray(d?.data)) return d.data;
  if (Array.isArray(res.data?.submissions)) return res.data.submissions;
  return [];
};

const fetchShortlistBackupGroup = async (id, studentName = "") => {
  if (!id) return;
  try {
    const res = await submissionService.getShortlist({ limit: 1000 });
    const list = extractSubmissionsList(res);
    let found = list.find((item) => String(item.id) === String(id));

    if (!found && studentName) {
      const searchRes = await submissionService.getShortlist({ search: studentName });
      const searchList = extractSubmissionsList(searchRes);
      found = searchList.find((item) => String(item.id) === String(id));
    }

    if (found) {
      const g =
        found.submissionGroup?.groupNumber ??
        found.groupNumber ??
        found.group_number ??
        found.submissionGroup?.group?.groupNumber ??
        found.group ??
        null;
      if (g != null && g !== "") {
        const match = String(g).match(/\d+/);
        loadedGroupNumber.value = match ? match[0] : String(g);
      }
    }
  } catch (err) {
    console.warn("Could not fetch shortlist backup:", err);
  }
};

const activeSubmissionId = computed(() => {
  return route.params.id || route.params.submissionId || currentSubmission.value?.id;
});

const onDataLoaded = ({ submission, student }) => {
  currentSubmission.value = submission;
  currentStudent.value = student;
  const currentG = getGroupNumber(submission);
  if (!currentG && activeSubmissionId.value) {
    fetchShortlistBackupGroup(
      activeSubmissionId.value,
      student?.khName || student?.enName || submission?.khName || submission?.enName || ""
    );
  }
};

onMounted(() => {
  fetchGroupOptions();
  if (activeSubmissionId.value) {
    fetchShortlistBackupGroup(activeSubmissionId.value);
  }
});

const getStatusInfo = (sub) => {
  const s = String(sub?.status || currentSubmission.value?.status || "").toUpperCase();
  if (s === "FAILED_EVALUATION" || s === "FAIL" || s === "FAILED") {
    return {
      text: "ធ្លាក់ក្នុងជ្រើសសម្រាំង",
      style: "background-color: #ffdfe08f; color: red; font-size: 0.85rem;"
    };
  } else if (s === "PASS" || s === "PASSED") {
    return {
      text: "ជាប់ក្នុងជ្រើសសម្រាំង",
      style: "background-color: #eff6ff; color: #2662d9; font-size: 0.85rem;"
    };
  } else if (s === "RESERVED" || s === "RESERVE") {
    return {
      text: "ជាប់បម្រុង",
      style: "background-color: #fffbeb; color: #d97706; font-size: 0.85rem;"
    };
  } else {
    return {
      text: "ជ្រើសសម្រាំង",
      style: "background-color: #eff6ff; color: #2662d9; font-size: 0.85rem;"
    };
  }
};

const isPassed = computed(() => {
  const s = String(currentSubmission.value?.status || "").toUpperCase();
  return s === "PASS" || s === "PASSED";
});

const isReserved = computed(() => {
  const s = String(currentSubmission.value?.status || "").toUpperCase();
  return s === "RESERVED" || s === "RESERVE";
});

const isFailed = computed(() => {
  const s = String(currentSubmission.value?.status || "").toUpperCase();
  return s === "FAILED_EVALUATION" || s === "FAIL" || s === "FAILED";
});

const isReasonRequired = computed(() => {
  return actionType.value === "BLACKLIST" || actionType.value === "DROPOUT";
});

const actionModalTitle = computed(() => {
  if (actionType.value === "BLACKLIST") return "បញ្ជាក់បញ្ជីខ្មៅ (Blacklist)";
  if (actionType.value === "DROPOUT") return "បញ្ជាក់បោះបង់ (Dropout)";
  if (actionType.value === "RESERVED") return "បញ្ជាក់បម្រុង (Reserve)";
  if (actionType.value === "FAILED_EVALUATION" || actionType.value === "FAIL") return "បញ្ជាក់ការធ្លាក់ (Fail)";
  if (actionType.value === "PASS" || actionType.value === "PASSED") return "បញ្ជាក់ការជាប់ (Pass)";
  return "បញ្ជាក់";
});

const actionModalPrompt = computed(() => {
  if (actionType.value === "BLACKLIST") {
    return "តើអ្នកពិតជាចង់ផ្លាស់ប្តូរបេក្ខជននេះទៅកាន់បញ្ជីខ្មៅ (Blacklist) មែនទេ?";
  }
  if (actionType.value === "DROPOUT") {
    return "តើអ្នកពិតជាចង់ផ្លាស់ប្តូរបេក្ខជននេះទៅជាបោះបង់ (Dropout) មែនទេ?";
  }
  if (actionType.value === "RESERVED") {
    return "តើអ្នកពិតជាចង់ផ្លាស់ប្តូរស្ថានភាពបេក្ខជននេះទៅជា «ជាប់បម្រុង» មែនទេ?";
  }
  if (actionType.value === "FAILED_EVALUATION" || actionType.value === "FAIL") {
    return "តើអ្នកពិតជាចង់ផ្លាស់ប្តូរស្ថានភាពបេក្ខជននេះទៅជា «ធ្លាក់» មែនទេ?";
  }
  if (actionType.value === "PASS" || actionType.value === "PASSED") {
    return "តើអ្នកពិតជាចង់ផ្លាស់ប្តូរស្ថានភាពបេក្ខជននេះទៅជា «ជាប់ពេញសិទ្ធ» មែនទេ?";
  }
  return "តើអ្នកពិតជាចង់ផ្លាស់ប្តូរស្ថានភាពបេក្ខជននេះមែនទេ?";
});

const openActionModal = (type) => {
  actionType.value = type;
  actionReason.value = "";
  actionNote.value = "";
  reasonError.value = "";
  showActionModal.value = true;
};

const promoteStatus = async (status, payload = {}) => {
  const id = activeSubmissionId.value;
  if (!id) return;
  isUpdating.value = true;
  try {
    const response = await submissionService.promoteStatus(id, { status, ...payload });
    if (response.data?.success || response.status === 200) {
      toast.success("ស្ថានភាពត្រូវបានកែប្រែដោយជោគជ័យ។");
      router.back();
    }
  } catch (error) {
    console.error("Error updating status:", error);
    if (error?.response?.data?.message == 'Student must have evaluation scores for 3 subjects before changing status.') {
      toast.error("សិស្សត្រូវមានពិន្ទុវាយតម្លៃគ្រប់មុខវិជ្ជាសិន។");
    } else {
      toast.error(error?.response?.data?.message || "មានបញ្ហាប្រព័ន្ធ");
    }
  } finally {
    isUpdating.value = false;
  }
};

const submitActionModal = async () => {
  if (isReasonRequired.value && !actionReason.value.trim()) {
    reasonError.value = "សូមបញ្ចូលមូលហេតុជាមុនសិន";
    return;
  }

  const payload = isReasonRequired.value
    ? {
        reason: actionReason.value.trim(),
        note: actionNote.value.trim() || undefined,
      }
    : {};

  await promoteStatus(actionType.value, payload);
  if (!isUpdating.value) {
    showActionModal.value = false;
  }
};
</script>

<style scoped>
.blacklist-btn, .reject-btn {
  color: #e53e3e;
  border: 1px solid #e53e3e;
  background: rgba(229, 62, 62, 0.05);
}

.blacklist-btn:hover, .reject-btn:hover {
  color: #ffffff;
  background: #e53e3e;
}

.shortlist-btn {
  border: 1px solid var(--bs-primary, #2662d9);
  background-color: var(--bs-primary, #2662d9) !important;
}

.shortlist-btn:hover {
  background-color: var(--bs-secondary, #1f52bc) !important;
  border-color: var(--bs-secondary, #1f52bc) !important;
  color: #ffffff;
}
</style>
