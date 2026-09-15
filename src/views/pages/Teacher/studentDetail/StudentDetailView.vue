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

      <div class="d-flex align-items-center gap-2 flex-wrap">
        <!-- Teacher Evaluation Button Only -->
        <button
          type="button"
          class="btn shortlist-btn text-success px-4"
          @click="goToEvaluation"
        >
          <i class="bi bi-pencil-square me-2"></i>
          <span>{{ isEvaluated ? 'កែប្រែការវាយតម្លៃ' : 'វាយតម្លៃសិស្ស' }}</span>
        </button>
      </div>
    </template>
  </DetailStudent>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import DetailStudent from "@/components/ui/detailStudent.vue";

const route = useRoute();
const router = useRouter();

const currentSubmission = ref(null);

const activeSubmissionId = computed(() => {
  return route.params.id || route.params.submissionId || currentSubmission.value?.id;
});

const isEvaluated = computed(() => {
  const sub = currentSubmission.value;
  if (!sub) return false;
  return Boolean(sub.isEvaluated) || (Array.isArray(sub.evaluations) && sub.evaluations.length >= 2);
});

const onDataLoaded = ({ submission }) => {
  currentSubmission.value = submission;
};

const goToEvaluation = () => {
  const id = activeSubmissionId.value;
  if (id) {
    router.push({
      name: "student-evaluation",
      params: { submissionId: id },
    });
  }
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
</script>

<style scoped>
.shortlist-btn {
  border: 1px solid #357867;
}

.shortlist-btn:hover {
  background-color: #2e6658 !important;
  color: white !important;
}
</style>