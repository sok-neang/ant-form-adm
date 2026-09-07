<template>
  <div class="verify-code-page">
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
      <form @submit.prevent="handleVerifyOTP">
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
              :ref="(el) => setOtpRef(el, index)"
              v-model="otp[index]"
              type="text"
              inputmode="numeric"
              maxlength="1"
              class="otp-box"
              @input="handleInput($event, index)"
              @keydown.backspace="handleBackspace($event, index)"
            />
          </div>
        </div>
        <!-- VERIFY BUTTON -->
        <BaseButton
          type="submit"
          variant="primary"
          custom-class="w-100 py-2 bg-primary"
          :is-loading="authStore.loading"
          loading-text="កំពុងផ្ទៀងផ្ទាត់..."
        >
          ផ្ទៀងផ្ទាត់
          <template #icon>
            <i class="bi bi-arrow-right"></i>
          </template>
        </BaseButton>

      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

import BaseButton from "@/components/ui/base/BaseButton.vue";
import { useAuthStore } from "@/stores/useAuthStore";
import { useAppToast } from "@/composable/useAppToast";

const router = useRouter();
const authStore = useAuthStore();
const toast = useAppToast();
const otpRefs = ref([]);
const otp = ref([
  "",
  "",
  "",
  "",
  "",
  "",
]);

const setOtpRef = (el, index) => {
  if (el) {
    otpRefs.value[index] = el;
  }
};

const otpValue = computed(() => {
  return otp.value.join("");
});

//Handle OTP input
const handleInput = (event, index) => {
  let value = event.target.value;
  // Allow numbers only
  value = value.replace(/\D/g, "");
  otp.value[index] = value;
  // Move to next input
  if (value && index < otp.value.length - 1) {
    otpRefs.value[index + 1]?.focus();
  }
};

const handleBackspace = (event, index) => {
  if (!otp.value[index] && index > 0) {
    otpRefs.value[index - 1]?.focus();
  } else {
    otp.value[index] = "";
  }
};

const handleVerifyOTP = async () => {
   if (otpValue.value.length !== 6) {
    toast.warning("សូមបញ្ចូលលេខកូដ 6 ខ្ទង់");
    return;
  }

  if (!authStore.interimToken) {
    toast.error("Session ផ្ទៀងផ្ទាត់មិនត្រឹមត្រូវ");
    return;
  }

  try {
    const response = await authStore.verifyCodeOtp({
      otp: otpValue.value,
    });

    if (!response.success) {
      return;
    }

    // First Login
    if (response.data?.step === "change_default_password"){
      toast.success("ការផ្ទៀងផ្ទាត់ជោគជ័យ");
      router.push("/auth/reset-password");
      return;
    }

    // Normal Login
    if (response.data?.user && response.data?.accessToken) {
      toast.success("ចូលប្រើប្រាស់បានជោគជ័យ");
        authStore.clearTwoFactor();

      router.push("/");
      return;
    }
    // Unexpected response
    toast.error("ទិន្នន័យផ្ទៀងផ្ទាត់មិនត្រឹមត្រូវ");
  } catch (error) {
    console.log(error.response);
    
    const backendData = error.response?.data;
    toast.error(backendData?.message || "លេខកូដផ្ទៀងផ្ទាត់មិនត្រឹមត្រូវ");
  }
};

</script>