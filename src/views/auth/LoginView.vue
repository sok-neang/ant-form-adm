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
          ចូលប្រើប្រាស់ប្រព័ន្ធ
        </h4>
        <h6 class="lh-lg mb-0 text-muted">
          ចូលប្រើប្រាស់ប្រព័ន្ធប្រកបដោយមានសុវត្ថិភាពខ្ពស់ក្នុងរយៈពេលដ៏ខ្លី
        </h6>

      </div>
      <!-- Form -->
      <form @submit.prevent="handleLogin">
        <!-- Email -->
        <BaseInput
          class="mb-4"
          v-model="email"
          label="អុីម៉ែល"
          type="email"
          placeholder="example@gmail.com"
          input-class="py-2"
        >
          <i class="bi bi-envelope"></i>
        </BaseInput>

        <!-- Password -->
        <BaseInput
          v-model="password"
          label="ពាក្យសម្ងាត់"
          :type="showPassword ? 'text' : 'password'"
          placeholder="*******"
          autocomplete="current-password"
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

        <!-- Button -->
        <BaseButton
          type="submit"
          variant="bg-primary"
          custom-class="w-100 py-2 mt-4 bg-primary text-light"
          :is-loading="loading"
          loading-text="Signing in..."
        >
          ចូលប្រើប្រាស់គណនី
        </BaseButton>
      </form>
    </div>
  
  </AuthLayout>
</template>
<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import AuthLayout from "@/layouts/AuthLayout.vue";
import BaseInput from "@/components/ui/base/BaseInput.vue";
import BaseButton from "@/components/ui/base/BaseButton.vue";
const email = ref("");
const password = ref("");
const showPassword = ref(false);
const loading = ref(false);
const errorMessage = ref("");
const router = useRouter();

const handleLogin = async () => {
  router.push("/auth/2fa");
  errorMessage.value = "";
  if (!email.value || !password.value) {
    errorMessage.value = "Please enter your email and password.";
    return;
  }

  loading.value = true;

  try {
    // TODO:
    // Connect Pinia + API here

    console.log({
      email: email.value,
      password: password.value,
    });

    // Temporary redirect
    // router.push("/dashboard");

  } catch (error) {
    console.error(error);

    errorMessage.value = "Invalid email or password.";
  } finally {
    loading.value = false;
  }
};
</script>