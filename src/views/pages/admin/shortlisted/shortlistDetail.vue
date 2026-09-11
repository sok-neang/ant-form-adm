<template>
  <DetailStudent @loaded="onDataLoaded">
    <!-- Badge -->
    <template #badge="{ submission }">
      <span
        class="badge rounded-pill px-3 py-2 fw-semibold"
        :class="getStatusInfo(submission).color"
        :style="getStatusInfo(submission).style"
      >
        {{ getStatusInfo(submission).text }}
      </span>
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

      <div class="d-flex gap-2">
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
          v-if="getStatusInfo(currentSubmission).text !== 'ធ្លាក់ក្នុងជ្រើសសម្រាំង'"
          type="button"
          class="btn reject-btn px-4"
          @click="openActionModal('FAILED_EVALUATION')"
          :disabled="isUpdating"
        >
          <i class="bi bi-person-check-fill me-2"></i>
          ធ្លាក់
        </button>
        <button
          v-if="getStatusInfo(currentSubmission).text !== 'ជាប់ក្នុងជ្រើសសម្រាំង'"
          type="button"
          class="btn shortlist-btn px-4 text-white"
          style="background-color: #357867;"
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
              <label class="form-label">មូលហេតុ (Reason)</label>
              <textarea 
                v-model="actionReason" 
                class="form-control shadow-none border-secondary-subtle" 
                rows="3" 
                placeholder="បញ្ចូលមូលហេតុ..."
              ></textarea>
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
            class="btn btn-success px-4" 
            style="background-color: #357867; border-color: #357867;"
            @click="submitActionModal" 
            :disabled="isUpdating"
          >
            <span v-if="isUpdating" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            យល់ព្រម
          </button>
        </div>
      </BaseModal>
    </template>
  </DetailStudent>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import DetailStudent from "@/components/ui/detailStudent.vue";
import BaseModal from "@/components/ui/base/BaseModal.vue";
import submissionService from "@/services/submission.service";
import { useAppToast } from "@/composable/useAppToast";

const route = useRoute();
const router = useRouter();
const toast = useAppToast();

const isUpdating = ref(false);
const showActionModal = ref(false);
const actionType = ref("");
const actionReason = ref("");
const actionNote = ref("");
const currentSubmission = ref(null);

const activeSubmissionId = computed(() => {
  return route.params.id || route.params.submissionId || currentSubmission.value?.id;
});

const onDataLoaded = ({ submission }) => {
  currentSubmission.value = submission;
};

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
      style: "background-color: #ecfdf5; color: #059669; font-size: 0.85rem;"
    };
  } else {
    return {
      text: "ជ្រើសសម្រាំង",
      style: "background-color: #ecfdf5; color: #059669; font-size: 0.85rem;"
    };
  }
};

const status = computed(() => getStatusInfo(currentSubmission.value));

const isReasonRequired = computed(() => {
  return actionType.value === "BLACKLIST" || actionType.value === "DROPOUT";
});

const actionModalTitle = computed(() => {
  if (actionType.value === "BLACKLIST") return "បញ្ជាក់បញ្ជីខ្មៅ (Blacklist)";
  if (actionType.value === "DROPOUT") return "បញ្ជាក់បោះបង់ (Dropout)";
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
  if (actionType.value === "FAILED_EVALUATION" || actionType.value === "FAIL") {
    return "តើអ្នកពិតជាចង់ផ្លាស់ប្តូរស្ថានភាពបេក្ខជននេះទៅជា «ធ្លាក់» មែនទេ?";
  }
  if (actionType.value === "PASS" || actionType.value === "PASSED") {
    return "តើអ្នកពិតជាចង់ផ្លាស់ប្តូរស្ថានភាពបេក្ខជននេះទៅជា «ជាប់» មែនទេ?";
  }
  return "តើអ្នកពិតជាចង់ផ្លាស់ប្តូរស្ថានភាពបេក្ខជននេះមែនទេ?";
});

const openActionModal = (type) => {
  actionType.value = type;
  actionReason.value = "";
  actionNote.value = "";
  showActionModal.value = true;
};

const promoteStatus = async (status, payload = {}) => {
  const id = activeSubmissionId.value;
  if (!id) return;
  isUpdating.value = true;
  try {
    const response = await submissionService.promoteStatus(id, { status, ...payload });
    if (response.data?.success || response.status === 200) {
      toast.success("ស្ថានភាពត្រូវបានកែប្រែដោយជោគជ័យ");
      router.back();
    }
  } catch (error) {
    console.error("Error updating status:", error);
    toast.error("មានបញ្ហាក្នុងការកែប្រែស្ថានភាព");
  } finally {
    isUpdating.value = false;
  }
};

const submitActionModal = async () => {
  const payload = isReasonRequired.value
    ? {
        reason: actionReason.value || undefined,
        note: actionNote.value || undefined,
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
  border: 1px solid #357867;
}

.shortlist-btn:hover {
  background-color: #2e6658 !important;
  color: #ffdfe08f;
}
</style>
