<template>
    <aside class="dashboard-sidebar" :class="{
        'sidebar-collapsed': !layoutStore.isAsideOpen,
        'sidebar-open': isSidebarOpen
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
                            :class="{ active: isChildActive(item) }"
                            :title="!layoutStore.isAsideOpen ? item.label : ''" 
                            @click="toggleDropdown(item.label)">
                            <span class="menu-icon">
                                <i :class="item.icon"></i>
                            </span>
                            <span v-show="layoutStore.isAsideOpen" class="menu-title">
                                {{ item.label }}
                            </span>

                            <i v-show="layoutStore.isAsideOpen" 
                               class="bi bi-chevron-down ms-auto transition-transform" 
                               :style="{ transform: openDropdownMenu === item.label ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }"
                            ></i>
                        </button>

                        <div class="submenu" :class="{ 'submenu-open': openDropdownMenu === item.label }">
                            <RouterLink v-for="child in item.children" :key="child.label" :to="child.to"
                                class="submenu-link" exact-active-class="active"
                                :title="!layoutStore.isAsideOpen ? child.label : ''">
                                <span class="submenu-icon">
                                    <i :class="child.icon"></i>
                                </span>
                                <span v-show="layoutStore.isAsideOpen" class="submenu-title">
                                    {{ child.label }}
                                </span>
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
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { useLayoutStore } from "@/stores/layout";
import { useAuthStore } from "@/stores/useAuthStore";

const route = useRoute();
const layoutStore = useLayoutStore();
const authStore = useAuthStore();

const openDropdownMenu = ref(null);

const toggleDropdown = (label) => {
    openDropdownMenu.value = openDropdownMenu.value === label ? null : label;
};

const isSidebarOpen = computed(() => {
    if (typeof window !== "undefined" && window.innerWidth < 992) {
        return layoutStore.isMobileSidebarOpen;
    }
    return layoutStore.isAsideOpen;
});

const isChildActive = (item) => {
    if (!item.children) return false;
    return item.children.some(child => {
        if (!child.to) return false;
        return route.path === child.to || (child.to !== '/' && route.path.startsWith(child.to + '/'));
    });
};

const currentRole = computed(() => {
    if (authStore.user?.role) return authStore.user.role;
    try {
        const stored = sessionStorage.getItem("user");
        if (stored) {
            const parsed = JSON.parse(stored);
            return parsed?.role || "";
        }
    } catch (e) {
        console.warn("Failed to parse user from sessionStorage:", e);
    }
    return "";
});

const sidebarMenu = computed(() => {
    const role = currentRole.value;
    const menus = [
        {
            label: "ផ្ទាំងគ្រប់គ្រង",
            to: "/",
            icon: "bi bi-grid",
            roles: ["SUPER_ADMIN", "ADMIN", "TEACHER"],
        },
        {
            label: "អ្នកប្រើប្រាស់",
            to: "/users",
            icon: "bi bi-people",
            roles: ["SUPER_ADMIN"],
        },
        {
            label: "កំណត់ហេតុ",
            to: "/activity-logs",
            icon: "bi bi-journal-text",
            roles: ["SUPER_ADMIN"],
        },
        {
            label: "បញ្ជីអ្នកដាក់ពាក្យ",
            icon: "bi bi-file-earmark-text",
            roles: ["ADMIN"],
            children: [
                {
                    label: "ទាំងអស់",
                    to: "/all-application",
                    icon: "bi bi-files",
                },
                {
                    label: "ជាប់",
                    to: "/all-application/passed",
                    icon: "bi bi-file-earmark-check",
                },
                {
                    label: "ធ្លាក់",
                    to: "/all-application/failed",
                    icon: "bi bi-file-earmark-x",
                },
            ],
        },
        {
            label: "បញ្ជីសម្រាំង",
            to: "/all-shortlisted",
            icon: "bi bi-person-check",
            roles: ["ADMIN"],
            children: [
                {
                    label: "ទាំងអស់",
                    to: "/all-shortlist",
                    icon: "bi bi-people",
                },
                {
                    label: "ជាប់",
                    to: "/all-shortlist/passed",
                    icon: "bi bi-person-check-fill",
                },
                {
                    label: "ធ្លាក់",
                    to: "/all-shortlist/failed",
                    icon: "bi bi-person-x-fill",
                },
            ],
        },
        {
            label: "លទ្ធផលចុងក្រោយ",
            to: "/final-results",
            icon: "bi bi-trophy",
            roles: ["ADMIN"],
            children: [
                {
                    label: "ទាំងអស់",
                    to: "/final-results",
                    icon: "bi bi-award",
                },
                {
                    label: "ជាប់",
                    to: "/final-results/passed",
                    icon: "bi bi-patch-check",
                },
                {
                    label: "បម្រុង",
                    to: "/final-results/reserve",
                    icon: "bi bi-bookmark-star",
                },
            ],
        },
        {
            label: "បញ្ជីខ្មៅ",
            to: "/blacklisted",
            icon: "bi bi-person-x",
            roles: ["ADMIN"],
        },
        {
            label: "សិស្សដែលបោះបង់",
            to: "/drop-out",
            icon: "bi bi-person-dash",
            roles: ["ADMIN"],
        },
        {
            label: "បញ្ជីសិស្ស",
            to: "/student-lists",
            icon: "bi bi-mortarboard-fill",
            roles: ["TEACHER"],
        },
    ];

    return menus.filter(item => {
        if (!item.roles) return true;
        return item.roles.includes(role);
    });
});
</script>
<style scoped></style>