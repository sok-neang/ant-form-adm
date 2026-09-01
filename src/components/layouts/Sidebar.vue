<template>
    <aside class="dashboard-sidebar" :class="{
        'sidebar-collapsed': !layoutStore.isAsideOpen,
        'sidebar-open': layoutStore.isAsideOpen
    }">
        <div>
            <!-- Logo -->
            <div class="sidebar-logo">
                <RouterLink to="/">
                    <!-- Full Logo -->
                    <img v-if="layoutStore.isAsideOpen" src="/src/assets/logo.png" alt="ANT Logo" class="logo-full" />

                    <!-- Small Logo -->
                    <img v-else src="/src/assets/logo.png" alt="ANT Logo" class="logo-small" />
                </RouterLink>
            </div>

            <!-- Menu -->
            <nav class="sidebar-menu">
                <div v-for="item in sidebarMenu" :key="item.label" class="menu-item">
                    <RouterLink :to="item.to" class="menu-link" exact-active-class="active"
                        :title="!layoutStore.isAsideOpen ? item.label : ''">
                        <span class="menu-icon">
                            <i :class="item.icon"></i>
                        </span>

                        <span v-show="layoutStore.isAsideOpen" class="menu-title">
                            {{ item.label }}
                        </span>
                    </RouterLink>
                </div>
            </nav>
        </div>

        <div ref="dropdownRef" class="pb-3">
            <!-- images -->
            <div class="img-sidebar text-center px-3">
                <img src="/src/assets/images/img/sidebar.png" alt="Sidebar" class="img-fluid rounded-3" />
            </div>
        </div>
    </aside>
</template>

<script setup>
import { computed } from "vue";
import { useLayoutStore } from "@/stores/layout";
const layoutStore = useLayoutStore();
const sidebarMenu = computed(() => {
    return [
        {
            label: "ផ្ទាំងគ្រប់គ្រង",
            to: "/",
            icon: "bi bi-grid",
        },

        {
            label: "អ្នកប្រើប្រាស់",
            to: "users",
            icon: "bi bi-people",
        },

        {
            label: "កំណត់ហេតុ",
            to: "/activity-logs",
            icon: "bi bi-journal-text",
        },
        {
            label: "បញ្ជីអ្នកដាក់ពាក្យ",
            to: "application",
            icon: "bi bi-file-earmark-text",
        },
        {
            label: "បញ្ជីសម្រាំង",
            to: "shortlisted",
            icon: "bi bi-person-check",
        },
        {
            label: "បញ្ជីខ្មៅ",
            to: "blacklisted",
            icon: "bi bi-person-x",
        },
        {
            label: "លទ្ធផលចុងក្រោយ",
            to: "final-results",
            icon: "bi bi-trophy",
        },
        {
            label: "បញ្ជីសិស្ស",
            to: "student-lists",
            icon: "bi bi-mortarboard-fill",
        },
  



    ];
});


</script>
<style scoped></style>