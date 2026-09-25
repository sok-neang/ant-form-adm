<template>
  <div>
    <!-- Loading State -->
    <div
      v-if="loading || !currentRole"
      class="d-flex justify-content-center align-items-center flex-grow-1 py-5"
      style="min-height: 400px;"
    >
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">កំពុងផ្ទុក...</span>
      </div>
    </div>

    <!-- Teacher Role Dashboard -->
    <TeacherDashboardView v-else-if="currentRole === 'TEACHER'" />

    <!-- Super Admin Role Dashboard -->
    <SuperAdminDashboardView v-else-if="currentRole === 'SUPER_ADMIN'" />

    <!-- Admin Role Dashboard -->
    <AdminDashboardView v-else-if="currentRole === 'ADMIN'" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import TeacherDashboardView from "@/views/pages/Teacher/dashboard/TeacherDashboardView.vue";
import SuperAdminDashboardView from "@/views/pages/super-admin/SuperAdminDashboardView.vue";
import AdminDashboardView from "@/views/pages/admin/AdminDashboard.vue";
import { useAuthStore } from "@/stores/useAuthStore";

const authStore = useAuthStore();
const loading = ref(!authStore.user);

const currentRole = computed(() => {
  return authStore.user?.role || null;
});

onMounted(async () => {
  if (!authStore.user) {
    loading.value = true;
    try {
      await authStore.getProfile();
    } catch (err) {
      console.error("Error loading user profile in DashboardView:", err);
    } finally {
      loading.value = false;
    }
  }
});
</script>