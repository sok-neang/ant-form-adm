<template>
  <div class="forbidden-page d-flex align-items-center justify-content-center p-3">
    <div class="forbidden-card text-center p-2 py-5 rounded-4 ">
      
      <img :src="notFoundImage" alt="" width="400">

      <h2 class="fw-bold text-dark mb-2">
        មិនមានទំព័រនេះទេ
      </h2>

      <p class="text-muted mb-4 fs-6 lh-base px-md-3">
        ទំព័រដែលលោកអ្នកកំពុងស្វែងរកមិនមាននៅលើប្រព័ន្ធទេ។
      </p>

      <!-- Action Buttons -->
      <div class="d-flex flex-column flex-sm-row justify-content-center gap-2">
        <button
          type="button"
          class="btn btn-primary d-inline-flex align-items-center justify-content-center gap-2 px-4 py-2 rounded-3"
          @click="goDashboard"
        >
          <span>ត្រឡប់ទៅផ្ទាំងគ្រប់គ្រង</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/useAuthStore";
import notFoundImage from "@/assets/images/auth/404.png";

const router = useRouter();
const authStore = useAuthStore();

const goDashboard = () => {
  router.push("/");
};

const goBack = () => {
  if (window.history.length > 2) {
    router.back();
  } else {
    router.push("/");
  }
};
</script>

<style scoped>
.forbidden-page {
  min-height: calc(100vh - 120px);
  width: 100%;
}

.forbidden-card {
  max-width: 700px;
  width: 100%;
}

.forbidden-icon-wrapper {
  width: 80px;
  height: 80px;
  background-color: #fee2e2;
  border-radius: 50%;
}

.user-role-info {
  border: 1px solid #e9ecef;
}
</style>
