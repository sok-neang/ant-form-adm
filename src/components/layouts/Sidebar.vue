<template>
    <aside class="dashboard-sidebar" :class="{
        'sidebar-collapsed': !layoutStore.isAsideOpen,
        'sidebar-open': layoutStore.isAsideOpen
    }">
        <div>
            <!-- Logo -->
            <div class="sidebar-logo">
                <RouterLink to="/">
                    <img v-if="layoutStore.isAsideOpen" src="/src/assets/logo.png" alt="ANT Logo" class="logo-full" />
                    <img v-else src="/src/assets/logo.png" alt="ANT Logo" class="logo-small" />
                </RouterLink>
            </div>

            <nav class="sidebar-menu">
                <div v-for="item in sidebarMenu" :key="item.label" class="menu-item">

                    <!-- Normal menu -->
                    <RouterLink v-if="!item.children" :to="item.to" class="menu-link" exact-active-class="active"
                        :title="!layoutStore.isAsideOpen ? item.label : ''">
                        <span class="menu-icon">
                            <i :class="item.icon"></i>
                        </span>
                        <span v-show="layoutStore.isAsideOpen" class="menu-title">{{ item.label }}</span>
                    </RouterLink>
                    <!-- Dropdown menu -->
                    <div v-else class="menu-dropdown">
                        <button type="button" class="menu-link dropdown-toggle-btn"
                            :title="!layoutStore.isAsideOpen ? item.label : ''"
                            @click="isApplicationOpen = !isApplicationOpen">
                            <span class="menu-icon">
                                <i :class="item.icon"></i>
                            </span>
                            <span v-show="layoutStore.isAsideOpen" class="menu-title">
                                {{ item.label }}
                            </span>

                            <i v-show="layoutStore.isAsideOpen" class="bi ms-auto" :class="isApplicationOpen
                                ? 'bi-chevron-up'
                                : 'bi-chevron-down'
                                "></i>
                        </button>

                        <div class="submenu" :class="{ 'submenu-open': isApplicationOpen }">
                            <RouterLink v-for="child in item.children" :key="child.label" :to="child.to"
                                class="submenu-link" active-class="active">
                                {{ child.label }}
                            </RouterLink>
                        </div>
                    </div>
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
import { ref } from "vue";

const isApplicationOpen = ref(false);
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
            icon: "bi bi-file-earmark-text",
            children: [
                {
                    label: "ទាំងអស់",
                    to: "/all-application",
                },
                {
                    label: "ជាប់",
                    to: "/all-application/passed",
                },
                {
                    label: "ធ្លាក់",
                    to: "/all-application/failed",
                },
            ],
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
<style scoped>

</style>