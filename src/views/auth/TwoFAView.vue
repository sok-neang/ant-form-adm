<template>
  <div class="two-factor-page">
    <div class="two-factor-card">
      <!-- Header -->
      <div class="text-center mb-4">
        <!-- Icon -->
        <div class="security-icon mx-auto mb-3">
          <i class="bi bi-shield-lock"></i>
        </div>
        <h4 class="fw-bold mb-2">
          ការផ្ទៀងផ្ទាត់ពីរជាន់
        </h4>
        <p class="text-muted small mb-0 lh-lg">
          សូមស្កេន QR Code ដើម្បីភ្ជាប់
          Google Authenticator ជាមួយគណនីរបស់អ្នក។
        </p>

      </div>

      <!-- QR CODE -->
      <div class="qr-section text-center">
        <h6 class="fw-bold mb-3">
          ស្កេន QR Code
        </h6>
        <div class="qr-wrapper">
          <img
            src="/src/assets/images/auth/qr-example.png"
            alt="2FA QR Code"
            class="qr-image"
          />
        </div>
      </div>

      <!-- SECRET KEY -->
      <div class="secret-section mt-4">
        <p class="text-muted small mb-2">
          ឬ បញ្ចូល Secret Key ខាងក្រោមដោយដៃ៖
        </p>
        <div class="secret-key-wrapper">
          <div class="secret-key">
            ABCD EFGH IJKL MNOP
          </div>

          <button
            type="button"
            class="copy-btn"
          >
            <i class="bi bi-copy"></i>
          </button>

        </div>

      </div>
      <!-- BUTTON -->
      <BaseButton
        type="button"
        variant="primary"
        custom-class="w-100 py-2 bg-primary mt-4"
        @click="goToVerifyCode"
      >
        បន្ត
        <template #icon>
          <i class="bi bi-arrow-right"></i>
        </template>
      </BaseButton>
    </div>
  </div>
</template>
<script setup>
import { useRouter } from "vue-router";
import BaseButton from "@/components/ui/base/BaseButton.vue";
const router = useRouter();
const goToVerifyCode = () => {
  router.push("/auth/verify-code");
};
</script>
