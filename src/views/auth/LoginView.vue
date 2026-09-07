<template>
  <AuthLayout>
    <!-- LEFT -->
    <template #left>
      <div class="auth-image d-flex justify-content-center align-items-center">
        <img
          src="/src/assets/images/auth/img-login.png"
          alt="ANT Login"
        />
      </div>
    </template>

    <!-- RIGHT -->
    <div class="d-flex align-items-center justify-content-center">
      <div class="login-form w-100">

        <!-- Logo -->
        <div class="logo-login mb-2 text-center">
          <img
            src="/src/assets/logo.png"
            alt="ANT"
          />
        </div>

        <!-- Heading -->
        <div class="login-heading mb-4 text-center">
          <h2 class="fw-bold mb-3">
            ចូលប្រើប្រាស់
          </h2>

          <h5 class="lh-lg mb-3 text-muted">
            ចូលប្រើប្រាស់ប្រព័ន្ធប្រកបដោយមានសុវត្ថិភាពខ្ពស់ក្នុងរយៈពេលដ៏ខ្លី
          </h5>
        </div>

        <form @submit.prevent="handleLogin">

          <!-- Email -->
          <BaseInput
            class="mb-3"
            v-model="formData.email"
            label="អុីម៉ែល *"
            type="email"
            placeholder="example@gmail.com"
            input-class="py-2"
            :error="errors.email"
            @input="onInput('email')"
            @blur="onBlur('email')"
          >
            <i class="bi bi-envelope"></i>
          </BaseInput>

          <!-- Password -->
          <BaseInput
            v-model="formData.password"
            label="ពាក្យសម្ងាត់ *"
            :type="showPassword ? 'text' : 'password'"
            placeholder="*******"
            autocomplete="current-password"
            input-class="py-2 rounded-0"
            :error="errors.password"
            @input="onInput('password')"
            @blur="onBlur('password')"
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

          <!-- Login Button -->
          <BaseButton
            type="submit"
            variant="bg-primary"
            custom-class="w-100 py-2 mt-4 bg-primary text-light"
            :is-loading="authStore.loading"
            loading-text="កំពុងដំណើរការ..."
          >
            ចូលប្រើប្រាស់គណនី
          </BaseButton>
        </form>
      </div>
    </div>
  </AuthLayout>
</template>
<script setup>
import AuthLayout from "@/layouts/AuthLayout.vue";
import BaseInput from "@/components/ui/base/BaseInput.vue";
import BaseButton from "@/components/ui/base/BaseButton.vue";

import { useRouter } from "vue-router";
import { ref, reactive } from "vue";
import { useValidation } from "@/composable/useValidation";
import { loginSchema } from "@/schemas/authSchema";
import { useAuthStore } from "@/stores/useAuthStore";
import { useAppToast } from "@/composable/useAppToast";

const authStore = useAuthStore();
const router = useRouter();
const toast = useAppToast();
const showPassword = ref(false);

const formData = reactive({
  email: "",
  password: "",
});

const { errors, validateForm, onInput, onBlur, resetValidation, applyBackendErrors,} = useValidation(loginSchema, formData);
const handleLogin = async () => {
  const isValid = validateForm();
  if (!isValid) {
    return;
  }
  try {
    const response = await authStore.login(formData);

    if (response.success && response.data?.step === "verify_2fa") {
      const setupTotp = response.data.setupTotp;
      // First login
      if (setupTotp) {
        router.push("/auth/2fa");
        return;
      }
      // Existing user
      router.push("/auth/verify-code");
      return;
    }
  } catch (error) {
  console.log(error);
  
  const backendData = error.response?.data;
  // Field-level validation errors
  if (backendData?.errors) {
    applyBackendErrors(backendData.errors);
  }
  // General backend error
  const errorMessages = {
    "Invalid email or password.": "អុីម៉ែល ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវ សូមព្យាយាមម្តងទៀត",
    // "Account is inactive.": "គណនីរបស់អ្នកត្រូវបានបិទដំណើរការ",
    // "Account is suspended.": "គណនីរបស់អ្នកត្រូវបានផ្អាក",
    // "Too many login attempts.": "ការព្យាយាមចូលប្រើប្រាស់ច្រើនដងពេក",
  };

    const message = errorMessages[backendData?.message] || backendData?.message || "ការចូលប្រើប្រាស់បរាជ័យ"; 
    toast.error(message);
  }
};
</script>