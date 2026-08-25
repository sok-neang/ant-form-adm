<template>
  <AuthLayout>
    <!-- LEFT -->
    <template #left>
      <div class="auth-image d-flex justify-content-center align-items-center">
        <img
          src="/src/assets/images/auth/img-reset-password.png"
          alt="Reset Password"
        />
      </div>
    </template>
    <!-- RIGHT -->
    <div class="login-form w-100">
      <!-- Logo -->
      <div class="logo mb-3">
        <img
          src="/src/assets/logo.png"
          alt="ANT"
        />
      </div>
      <!-- Heading -->
      <div class="login-heading mb-4">
        <h4 class="fw-bold mb-2">
          ពាក្យសម្ងាត់ថ្មី
        </h4>
        <h6 class="lh-lg mb-0 text-muted">
          បង្កើតពាក្យសម្ងាត់ថ្មីរឹងមាំ
          សម្រាប់ការការពារគណនីរបស់អ្នក
        </h6>
      </div>
      <!-- FORM -->
      <form @submit.prevent = "handleResetPassword">
        <!-- New Password -->
        <BaseInput
          class="mb-4"
          v-model="password"
          label="ពាក្យសម្ងាត់ថ្មី"
          :type="showPassword ? 'text' : 'password'"
          placeholder="*******"
          autocomplete="new-password"
          input-class="py-2 rounded-0"
        >
          <i class="bi bi-lock"></i>
          <template #append>
            <button
              type="button"
              class="btn p-0"
              @click="showPassword = !showPassword"
            >
              <i
                :class="
                  showPassword
                    ? 'bi bi-eye-slash'
                    : 'bi bi-eye'
                "
              ></i>
            </button>
          </template>
        </BaseInput>
        <!-- Confirm Password -->
        <BaseInput
          class="mb-4"
          v-model="confirmPassword"
          label="បញ្ជាក់ពាក្យសម្ងាត់ថ្មី"
          :type="showConfirmPassword ? 'text' : 'password'"
          placeholder="*******"
          autocomplete="new-password"
          input-class="py-2 rounded-0"
        >
          <i class="bi bi-lock"></i>
          <template #append>
            <button
              type="button"
              class="btn p-0"
              @click="
                showConfirmPassword = !showConfirmPassword
              "
            >
              <i
                :class="
                  showConfirmPassword
                    ? 'bi bi-eye-slash'
                    : 'bi bi-eye'
                "
              ></i>
            </button>
          </template>
        </BaseInput>
        <!-- Submit -->
        <BaseButton
          type="submit"
          variant="primary"
          custom-class="w-100 mt-4 bg-primary "
        >
          ផ្លាស់ប្តូរពាក្យសម្ងាត់
          <template #icon>
            <i class="bi bi-check2-circle"></i>
          </template>
        </BaseButton>
      </form>
    </div>
  </AuthLayout>
</template>
<script setup>
import { ref } from "vue";
import AuthLayout from "@/layouts/AuthLayout.vue";
import BaseInput from "@/components/ui/base/BaseInput.vue";
import BaseButton from "@/components/ui/base/BaseButton.vue";
import { useRouter } from "vue-router";
const router = useRouter();
const password = ref("");
const confirmPassword = ref("");
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const handleResetPassword = () =>{
  router.push("/auth/login")
}
</script>