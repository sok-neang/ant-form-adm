<template>
  <DetailStudent :banner-src="bannerBlacklistBg" @loaded="onDataLoaded">
    <!-- Badge -->
    <template #badge>
      <span class="badge rounded-pill px-3 py-2 fw-semibold" style="background-color: #fee2e2; color: #dc2626; font-size: 0.85rem;">
        បញ្ជីខ្មៅ
      </span>
    </template>

    <!-- Blacklist Reason Card -->
    <template #extra-sections="{ submission }">
      <div class="card border-0 rounded-4 shadow-sm bg-white p-4">
        <div class="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
          <div class="d-flex align-items-center gap-2">
            <div class="rounded-3 d-flex align-items-center justify-content-center">
              <i class="bi bi-shield-slash fs-5 text-danger"></i>
            </div>
            <h5 class="fw-bold text-dark mb-0">មូលហេតុនៃការដាក់បញ្ចូលក្នុងបញ្ជីខ្មៅ</h5>
          </div>
          <span v-if="getBlacklistedDate(submission)" class="text-muted small">
            <i class="bi bi-calendar-event me-1"></i>{{ getBlacklistedDate(submission) }}
          </span>
        </div>

        <div class="rounded-4 p-4 blacklist-reason-box">
          <div class="d-flex align-items-start gap-3">
            <div class="flex-grow-1">
              <div class="fw-bold text-danger mb-1">មូលហេតុ (Reason)</div>
              <p class="mb-0 text-dark lh-base fs-6">
                {{ getBlacklistReason(submission) || "មិនមានការបញ្ជាក់ពីមូលហេតុជាក់លាក់នោះទេ" }}
              </p>
              <div v-if="getBlacklistNote(submission)" class="mt-3 pt-3 border-top border-danger-subtle">
                <span class="fw-semibold text-secondary small d-block mb-1">កំណត់ចំណាំបន្ថែម (Note):</span>
                <span class="text-muted small">{{ getBlacklistNote(submission) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Footer Actions -->
    <template #footer-actions="{ goBack }">
      <button type="button" class="btn btn-light border px-4" @click="goBack">
        <i class="bi bi-arrow-left me-2"></i>
        ត្រឡប់
      </button>

      <div class="d-flex align-items-center gap-2 flex-wrap">

        <!-- Action Buttons to move status -->
        <button
          type="button"
          class="btn btn-action btn-submit px-3 py-2"
          @click="openActionModal('SUBMITTED')"
          :disabled="isUpdating"
        >
          <i class="bi bi-arrow-counterclockwise me-1"></i>
          ដាក់ស្នើ (Submit)
        </button>

        <button
          type="button"
          class="btn btn-action btn-shortlist px-3 py-2"
          @click="openActionModal('SHORTLIST')"
          :disabled="isUpdating"
        >
          <i class="bi bi-list-check me-1"></i>
          ជ្រើសសម្រាំង (Shortlist)
        </button>

        <button
          type="button"
          class="btn btn-action btn-pass px-3 py-2"
          @click="openActionModal('PASS')"
          :disabled="isUpdating"
        >
          <i class="bi bi-check-circle me-1"></i>
          ជាប់ (Pass)
        </button>
      </div>
    </template>

    <!-- Action Confirmation Modal -->
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
import bannerBlacklistBg from "@/assets/images/img/banner_blacklist.png";

const route = useRoute();
const router = useRouter();
const toast = useAppToast();

const currentSubmission = ref(null);
const isUpdating = ref(false);
const showActionModal = ref(false);
const actionType = ref("");

const activeSubmissionId = computed(() => {
  return route.params.id || route.params.submissionId || currentSubmission.value?.id;
});

const onDataLoaded = ({ submission }) => {
  currentSubmission.value = submission;
};

const actionModalTitle = computed(() => {
  if (actionType.value === "SUBMITTED" || actionType.value === "SUBMIT") return "ផ្លាស់ប្តូរស្ថានភាពទៅជា៖ ដាក់ស្នើ (Submit)";
  if (actionType.value === "SHORTLIST") return "ផ្លាស់ប្តូរស្ថានភាពទៅជា៖ ជ្រើសសម្រាំង (Shortlist)";
  if (actionType.value === "PASS" || actionType.value === "PASSED") return "ផ្លាស់ប្តូរស្ថានភាពទៅជា៖ ជាប់ (Pass)";
  return "បញ្ជាក់ការផ្លាស់ប្តូរស្ថានភាព";
});

const actionModalPrompt = computed(() => {
  if (actionType.value === "SUBMITTED" || actionType.value === "SUBMIT") {
    return "តើអ្នកពិតជាចង់ដកសិស្សនេះចេញពីបញ្ជីខ្មៅ ហើយផ្លាស់ប្តូរទៅកាន់ស្ថានភាព «ដាក់ស្នើ (SUBMIT)» មែនទេ?";
  }
  if (actionType.value === "SHORTLIST") {
    return "តើអ្នកពិតជាចង់ដកសិស្សនេះចេញពីបញ្ជីខ្មៅ ហើយផ្លាស់ប្តូរទៅកាន់ស្ថានភាព «ជ្រើសសម្រាំង (SHORTLIST)» មែនទេ?";
  }
  if (actionType.value === "PASS" || actionType.value === "PASSED") {
    return "តើអ្នកពិតជាចង់ដកសិស្សនេះចេញពីបញ្ជីខ្មៅ ហើយផ្លាស់ប្តូរទៅកាន់ស្ថានភាព «ជាប់ (PASS)» មែនទេ?";
  }
  return "តើអ្នកពិតជាចង់ផ្លាស់ប្តូរស្ថានភាពសិស្សនេះចេញពីបញ្ជីខ្មៅមែនទេ?";
});

const openActionModal = (type) => {
  actionType.value = type;
  showActionModal.value = true;
};

const promoteStatus = async (status, payload = {}) => {
  const id = activeSubmissionId.value;
  if (!id) {
    toast.error("រកមិនឃើញលេខសម្គាល់សិស្សនោះទេ");
    return;
  }
  isUpdating.value = true;
  try {
    let response;
    try {
      response = await submissionService.promoteStatus(id, { status, ...payload });
    } catch (err) {
      if (status === "SUBMITTED") {
        response = await submissionService.promoteStatus(id, { status: "SUBMIT", ...payload });
      } else if (status === "SUBMIT") {
        response = await submissionService.promoteStatus(id, { status: "SUBMITTED", ...payload });
      } else {
        throw err;
      }
    }

    if (response?.data?.success || response?.status === 200) {
      toast.success("ស្ថានភាពត្រូវបានផ្លាស់ប្តូរដោយជោគជ័យ");
      router.back();
    }
  } catch (error) {
    console.error("Error updating status:", error);
    toast.error(error?.response?.data?.message || "មានបញ្ហាក្នុងការកែប្រែស្ថានភាព");
  } finally {
    isUpdating.value = false;
  }
};

const submitActionModal = async () => {
  await promoteStatus(actionType.value);
  if (!isUpdating.value) {
    showActionModal.value = false;
  }
};

const getBlacklistReason = (submission) => {
  return (
    submission?.blacklistReason ||
    submission?.reason ||
    submission?.statusReason ||
    submission?.rejectReason ||
    submission?.rejectionReason ||
    submission?.blacklist?.reason ||
    submission?.narrative?.reason ||
    submission?.comments ||
    ""
  );
};

const getBlacklistNote = (submission) => {
  return (
    submission?.blacklistNote ||
    submission?.note ||
    submission?.notes ||
    submission?.blacklist?.note ||
    ""
  );
};

const getBlacklistedDate = (submission) => {
  const d = submission?.blacklistedAt || submission?.updatedAt || submission?.createdAt;
  if (!d) return "";
  try {
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return d;
    return dt.toLocaleDateString("km-KH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return d;
  }
};
</script>

<style scoped>
.blacklist-reason-box {
  background-color: #fef2f2;
  border: 1px solid #fecaca;
}

.btn-action {
  font-weight: 600;
  font-size: 0.88rem;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.btn-submit {
  color: #4b5563;
  background-color: #f3f4f6;
  border: 1px solid #d1d5db;
}

.btn-submit:hover:not(:disabled) {
  background-color: #e5e7eb;
  color: #1f2937;
  border-color: #9ca3af;
}

.btn-shortlist {
  color: #0284c7;
  background-color: #f0f9ff;
  border: 1px solid #bae6fd;
}

.btn-shortlist:hover:not(:disabled) {
  background-color: #0284c7;
  color: #ffffff;
  border-color: #0284c7;
}

.btn-pass {
  color: #ffffff;
  background-color: #357867;
  border: 1px solid #357867;
}

.btn-pass:hover:not(:disabled) {
  color: #ffff;
  background-color: #2b6355;
  border-color: #2b6355;
}
</style>
