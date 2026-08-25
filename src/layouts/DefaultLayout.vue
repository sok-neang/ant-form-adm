<template>
  <div class="dashboard-layout">

    <!-- Sidebar -->
    <Sidebar />

    <!-- Main Wrapper -->
    <div class="dashboard-wrapper">

      <!-- Navbar -->
      <Navbar />

      <!-- Page Content -->
      <main class="dashboard-content">
        <router-view />
      </main>

    </div>

    <!-- Mobile Overlay -->
    <div
      v-if="layoutStore.isMobileSidebarOpen"
      class="drawer-overlay"
      @click="layoutStore.closeMobileSidebar"
    ></div>

  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from "vue";
import Sidebar from "@/components/layouts/Sidebar.vue";
import Navbar from "@/components/layouts/Navbar.vue";
import { useLayoutStore } from "@/stores/layout";

const layoutStore = useLayoutStore();

const handleResize = () => {
  if (window.innerWidth >= 992) {
    layoutStore.closeMobileSidebar();
  }
};

onMounted(() => {
  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

<style scoped>
.dashboard-layout {
  min-height: 100vh;
  display: flex;
  background: #f8f9fa;
}

.dashboard-wrapper {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.dashboard-content {
  flex: 1;
  padding: 24px;
  background: #f8f9fa;
}

.drawer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1040;
}

@media (max-width: 991.98px) {
  .dashboard-content {
    padding: 16px;
  }
}
</style>