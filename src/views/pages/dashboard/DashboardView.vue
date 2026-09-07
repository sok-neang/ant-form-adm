<template>
  <div>
    <!-- Teacher Role Dashboard -->
    <TeacherDashboardView v-if="currentRole === 'TEACHER'" />

    <!-- Super Admin Role Dashboard -->
    <SuperAdminDashboardView v-else-if="currentRole === 'SUPER_ADMIN'" />

    <!-- Fallback / Default Dashboard -->
    <TeacherDashboardView v-else />
  </div>
</template>

<script setup>
import { computed } from "vue";
import TeacherDashboardView from "@/views/pages/Teacher/dashboard/TeacherDashboardView.vue";
import SuperAdminDashboardView from "@/views/pages/super-admin/SuperAdminDashboardView.vue";

const currentRole = computed(() => {
  try {
    const rawUser = sessionStorage.getItem("user");
    return rawUser ? JSON.parse(rawUser).role : null;
  } catch (err) {
    console.error("Error reading user role:", err);
    return null;
  }
});
</script>