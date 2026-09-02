<template>
  <AuthLayout>
    <!-- LEFT -->
    <template #left>
      <div
        class="auth-image d-flex justify-content-center align-items-center"
      >
        <img
          src="/src/assets/images/auth/img-reset-password.png"
          alt="Reset Password"
        />
      </div>
    </template>

    <!-- RIGHT -->
     <div class="d-flex align-items-center justify-content-center">
  <div class="login-form w-100">
    <!-- Logo -->
    <div class="logo mb-3 text-center">
      <img
        src="/src/assets/logo.png"
        alt="ANT"
      />
    </div>

    <!-- Heading -->
    <div class="login-heading mb-4 text-center">
      <h4 class="fw-bold mb-2">
        ពាក្យសម្ងាត់ថ្មី
      </h4>

      <h6 class="lh-lg mb-0 text-muted">
        បង្កើតពាក្យសម្ងាត់ថ្មីរឹងមាំ
        សម្រាប់ការពារគណនីរបស់អ្នក
      </h6>
    </div>

    <!-- FORM -->
    <form @submit.prevent="handleResetPassword">

      <!-- New Password -->
      <BaseInput
        class="mb-4"
        v-model="formData.newPassword"
        label="ពាក្យសម្ងាត់ថ្មី *"
        :type="showPassword ? 'text' : 'password'"
        placeholder="*******"
        autocomplete="new-password"
        input-class="py-2 rounded-0"
        :error="errors.newPassword"
        @input="onInput('newPassword')"
        @blur="onBlur('newPassword')"
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
        v-model="formData.confirmNewPassword"
        label="បញ្ជាក់ពាក្យសម្ងាត់ថ្មី *"
        :type="showConfirmPassword ? 'text' : 'password'"
        placeholder="*******"
        autocomplete="new-password"
        input-class="py-2 rounded-0"
        :error="errors.confirmNewPassword"
        @input="onInput('confirmNewPassword')"
        @blur="onBlur('confirmNewPassword')"
      >
        <i class="bi bi-lock"></i>

        <template #append>
          <button
            type="button"
            class="btn p-0"
            @click="showConfirmPassword = !showConfirmPassword"
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
        custom-class="w-100 mt-4 bg-primary"
        :is-loading="authStore.loading"
        loading-text="កំពុងដំណើរការ..."
      >
        ផ្លាស់ប្តូរពាក្យសម្ងាត់

        <template #icon>
          <i class="bi bi-check2-circle"></i>
        </template>
      </BaseButton>

    </form>
  </div>
</div>
  </AuthLayout>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";

import AuthLayout from "@/layouts/AuthLayout.vue";
import BaseInput from "@/components/ui/base/BaseInput.vue";
import BaseButton from "@/components/ui/base/BaseButton.vue";

import { useAuthStore } from "@/stores/useAuthStore";
import { useAppToast } from "@/composable/useAppToast";
import { useValidation } from "@/composable/useValidation";
import { resetPasswordSchema } from "@/schemas/authSchema";

const router = useRouter();
const authStore = useAuthStore();
const toast = useAppToast();

const formData = reactive({
  newPassword: "",
  confirmNewPassword: "",
});

const showPassword = ref(false);
const showConfirmPassword = ref(false);

const {
  errors,
  validateForm,
  onInput,
  onBlur,
  applyBackendErrors,
} = useValidation(
  resetPasswordSchema,
  formData
);

const handleResetPassword = async () => {
  // Frontend validation
  const isValid = validateForm();

  if (!isValid) {
    return;
  }

  // Check interim token
  if (!authStore.interimToken) {
    toast.error(
      "Session ផ្ទៀងផ្ទាត់បានផុតកំណត់។ សូមចូលប្រើប្រាស់ម្តងទៀត។"
    );

    router.push("/auth/login");
    return;
  }

  try {
    const response = await authStore.changeDefaultPassword(formData);

    console.log("RESET PASSWORD RESPONSE:", response);

    if (response.success) {
      toast.success(
        "ពាក្យសម្ងាត់ត្រូវបានផ្លាស់ប្តូរដោយជោគជ័យ"
      );
      authStore.clearTwoFactor();
      router.push("/");
    }
} catch (error) {
  console.log(error);
  
  const backendData = error.response?.data;
  if (backendData?.errors) {
    applyBackendErrors(backendData.errors);
  }
  toast.error(backendData?.message || "មិនអាចផ្លាស់ប្តូរពាក្យសម្ងាត់បានទេ");
}
};
</script>