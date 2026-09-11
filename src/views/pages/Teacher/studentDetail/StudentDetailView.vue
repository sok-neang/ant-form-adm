<template>
  <DetailStudent
    :show-top-header="true"
    :show-footer="false"
    evaluation-title="លទ្ធផលពិន្ទុ"
  >
    <!-- Avatar Edit Button -->
    <template #avatar-actions>
      <button
        type="button"
        class="btn btn-edit-eval rounded-3 d-inline-flex align-items-center gap-2 px-3 py-2 text-white fw-semibold"
        @click="goToEvaluation"
      >
        <i class="bi bi-pencil-square"></i>
        <span>ធ្វើការកែប្រែ</span>
      </button>
    </template>
  </DetailStudent>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import DetailStudent from "@/components/ui/detailStudent.vue";

const route = useRoute();
const router = useRouter();
const submissionId = route.params.submissionId || route.params.id;

const goToEvaluation = () => {
  router.push({
    name: "student-evaluation",
    params: { submissionId },
  });
};
</script>

<style scoped>
.btn-edit-eval {
  background-color: #ff9800;
  border: none;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(255, 152, 0, 0.3);
}

.btn-edit-eval:hover {
  background-color: #f57c00;
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(255, 152, 0, 0.4);
}
</style>
