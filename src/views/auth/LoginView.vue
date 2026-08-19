<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import AuthLayout from "@/layouts/AuthLayout.vue";

const router = useRouter();

const email = ref("");
const password = ref("");

const showPassword = ref(false);
const loading = ref(false);
const errorMessage = ref("");

const handleLogin = async () => {
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

const goToForgotPassword = () => {
  router.push("/auth/forgot-password");
};
</script>

<template>
  <AuthLayout>

    <!-- ============================= -->
    <!-- LEFT -->
    <!-- ============================= -->

    <template #left>

      <div class="auth-image">

        <img
          src="/images/auth/login.jpg"
          alt="ANT Login"
        />

        <div class="auth-image-overlay">

          <h1 class="fw-bold">
            ANT Form
          </h1>

          <p>
            Student Registration & Scholarship Application
          </p>

        </div>

      </div>

    </template>

    <!-- ============================= -->
    <!-- RIGHT -->
    <!-- ============================= -->

    <div>

      <!-- Header -->

      <div class="mb-4">

        <h2 class="fw-bold mb-2">
          Welcome Back
        </h2>

        <p class="text-muted mb-0">
          Sign in to access your account.
        </p>

      </div>

      <!-- Error -->

      <div
        v-if="errorMessage"
        class="alert alert-danger"
      >
        {{ errorMessage }}
      </div>

      <!-- Form -->

      <form @submit.prevent="handleLogin">

        <!-- Email -->

        <div class="mb-3">

          <label class="form-label fw-medium">
            Email
          </label>

          <div class="input-group">

            <span class="input-group-text">
              <i class="bi bi-envelope"></i>
            </span>

            <input
              v-model="email"
              type="email"
              class="form-control"
              placeholder="Enter your email"
              autocomplete="email"
            />

          </div>

        </div>

        <!-- Password -->

        <div class="mb-3">

          <label class="form-label fw-medium">
            Password
          </label>

          <div class="input-group">

            <span class="input-group-text">
              <i class="bi bi-lock"></i>
            </span>

            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              class="form-control"
              placeholder="Enter your password"
              autocomplete="current-password"
            />

            <button
              type="button"
              class="btn btn-outline-secondary"
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

          </div>

        </div>

        <!-- Forgot -->

        <div class="d-flex justify-content-end mb-4">

          <button
            type="button"
            class="btn btn-link p-0 text-decoration-none"
            @click="goToForgotPassword"
          >
            Forgot password?
          </button>

        </div>

        <!-- Submit -->

        <button
          type="submit"
          class="btn btn-primary w-100 py-2"
          :disabled="loading"
        >

          <span
            v-if="loading"
            class="spinner-border spinner-border-sm me-2"
          ></span>

          {{ loading ? "Signing in..." : "Sign In" }}

        </button>

      </form>

    </div>

  </AuthLayout>
</template>