<template>
  <div class="verify-code-page">

    <!-- CARD -->
    <div class="verify-code-card">
      <!-- Security Icon -->
      <div class="text-center mb-4">

        <div class="security-icon mx-auto mb-3">
          <i class="bi bi-shield-check"></i>
        </div>

        <h4 class="fw-bold mb-2">
          ផ្ទៀងផ្ទាត់លេខកូដ
        </h4>

        <p class="text-muted small lh-lg mb-0">
          សូមបញ្ចូលលេខកូដ 6 ខ្ទង់
          ដែលបង្ហាញនៅក្នុង Google Authenticator
          របស់អ្នក។
        </p>

      </div>

      <!-- FORM -->
      <form @submit.prevent="handleVerify">

        <!-- OTP -->
        <div class="mb-4">

          <label class="form-label fw-medium">
            លេខកូដផ្ទៀងផ្ទាត់
          </label>

          <!-- OTP BOXES -->
          <div class="otp-container">

            <input
              v-for="(digit, index) in otp"
              :key="index"
              v-model="otp[index]"
              type="text"
              inputmode="numeric"
              maxlength="1"
              class="otp-box"
              @input="handleInput($event, index)"
            />

          </div>

        </div>

        <!-- VERIFY BUTTON -->
        <BaseButton

          type="submit"
          variant="primary"
          custom-class="w-100 py-2 bg-primary"
        >
          ផ្ទៀងផ្ទាត់

          <template #icon>
            <i class="bi bi-arrow-right"></i>
          </template>
        </BaseButton>

      </form>

      <!-- BACK -->
      <div class="text-center mt-3">

        <button
          type="button"
          class="btn btn-link text-muted text-decoration-none small"
        >
          <i class="bi bi-arrow-left me-1"></i>
          ត្រឡប់ក្រោយ
        </button>

      </div>

    </div>

  </div>
</template>

<script setup>
import { ref } from "vue";
import BaseButton from "@/components/ui/base/BaseButton.vue";
import {useRouter} from "vue-router";
const router = useRouter()
const otp = ref([
  "",
  "",
  "",
  "",
  "",
  "",
]);

const handleInput = (event, index) => {
  let value = event.target.value;

  // Design stage only:
  // allow only numbers
  value = value.replace(/\D/g, "");

  otp.value[index] = value;
};

const handleVerify = () => {
  router.push("/auth/reset-password")
  
};
</script>
