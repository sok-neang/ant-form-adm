<template>
  <div class="two-factor-page">
    <div class="two-factor-card">
      <!-- Header -->
      <div class="text-center mb-4">
        <div class="security-icon mx-auto mb-3">
          <i class="bi bi-shield-lock"></i>
        </div>

        <h4 class="fw-bold mb-2">
          ការផ្ទៀងផ្ទាត់ 2FA
        </h4>
      </div>
      <!-- QR CODE -->
      <div class="qr-section text-center">
        <h6 class="fw-bold mb-3">
          ស្កេន QR Code
        </h6>

        <div class="qr-wrapper">
          <img v-if="authStore.qrCodeDataUri" :src="authStore.qrCodeDataUri" alt="2FA QR Code" class="qr-image" />

          <div v-else class="text-muted small">
            មិនមាន QR Code
          </div>
        </div>
      </div>

      <!-- SECRET KEY -->
      <div v-if="authStore.totpSecret" class="secret-section mt-4">
        <p class="text-muted small mb-2">
          ឬ បញ្ចូល Secret Key ខាងក្រោមដោយផ្ទាល់៖
        </p>

        <div class="secret-key-wrapper">
          <div class="secret-key">
            {{ authStore.totpSecret }}
          </div>
          <button type="button" class="copy-btn" @click="copySecret" :title="copied ? 'បានចម្លង' : 'ចម្លង Secret Key'">
            <i :class="copied ? 'bi bi-check-lg' : 'bi bi-copy'"></i>
          </button>
        </div>
      </div>

      <!-- BUTTON -->
      <BaseButton type="button" variant="primary" custom-class="w-100 py-2 bg-primary mt-4" @click="goToVerifyCode">
        បន្ត
        <template #icon>
          <i class="bi bi-arrow-right"></i>
        </template>
      </BaseButton>

    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

import BaseButton from "@/components/ui/base/BaseButton.vue";
import { useAuthStore } from "@/stores/useAuthStore";
import { useAppToast } from "@/composable/useAppToast";

const router = useRouter();
const authStore = useAuthStore();
const toast = useAppToast();
const copied = ref(false);

const copySecret = async () => {
  if (!authStore.totpSecret) {
    toast.warning("មិនមាន Secret Key សម្រាប់ចម្លងទេ");
    return;
  }
  try {
    await navigator.clipboard.writeText(authStore.totpSecret);
    copied.value = true;
    toast.success("Secret Key ត្រូវបានចម្លងរួចរាល់");
    setTimeout(() => { copied.value = false; }, 2000);
  } catch (error) {
    console.error("Failed to copy secret:", error);
    toast.error("មិនអាចចម្លង Secret Key បានទេ");
  }
};

const goToVerifyCode = () => {
  if (!authStore.interimToken) {
    toast.error("Session ផ្ទៀងផ្ទាត់មិនត្រឹមត្រូវ");
    return;
  }
  router.push("/auth/verify-code");
};
</script>