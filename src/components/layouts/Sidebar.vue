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
                    <RouterLink v-if="!item.children" :to="item.to" class="menu-link" :class="{ active: isItemActive(item) }"
                        :title="!layoutStore.isAsideOpen ? item.label : ''">
                        <span class="menu-icon">
                            <i :class="item.icon"></i>
                        </span>
                        <span v-show="layoutStore.isAsideOpen" class="menu-title">{{ item.label }}</span>
                    </RouterLink>
                    <!-- Dropdown menu -->
                    <div v-else class="menu-dropdown">
                        <button type="button" class="menu-link dropdown-toggle-btn" :class="{ active: isItemActive(item) }"
                            :title="!layoutStore.isAsideOpen ? item.label : ''" @click="toggleDropdown(item.label)">
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
                                class="submenu-link" :class="{ active: isChildActive(child, item) }">
                                {{ child.label }}
                            </RouterLink>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
        <div ref="dropdownRef" class="sidebar-bottom-section" :class="{ 'img-collapsed': !!openDropdownMenu }" v-show="layoutStore.isAsideOpen">
            <!-- images -->
            <div class="img-sidebar text-center px-3">
                <img src="/src/assets/images/img/sidebar.png" alt="Sidebar" class="img-fluid rounded-3 sidebar-illustration" />
            </div>
        </div>
    </aside>
</template>

<script setup>
import { computed, ref, watch } from "vue";
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

const isItemActive = (item) => {
    const currentPath = route.path;
    const currentName = route.name;

    // Dropdown items
    if (item.children) {
        if (item.label === "បញ្ជីអ្នកដាក់ពាក្យ") {
            return (
                currentPath.startsWith("/all-application") ||
                currentPath.startsWith("/application-review") ||
                currentName === "application-review"
            );
        }
        if (item.label === "បញ្ជីសម្រាំង") {
            return (
                currentPath.startsWith("/all-shortlist") ||
                currentPath.startsWith("/shortlist-detail") ||
                currentName === "shortlist-detail"
            );
        }
        if (item.label === "លទ្ធផលចុងក្រោយ") {
            return (
                currentPath.startsWith("/final-results") ||
                currentPath.startsWith("/final-result-detail") ||
                currentName === "final-result-detail"
            );
        }
        return item.children.some((child) => currentPath === child.to);
    }

    // Normal items
    if (item.to === "/") {
        return currentPath === "/" || currentName === "dashboard";
    }
    if (item.to === "/blacklisted") {
        return (
            currentPath.startsWith("/blacklisted") ||
            currentPath.startsWith("/blacklist-detail") ||
            currentName === "blacklist-detail" ||
            currentName === "blacklisted"
        );
    }
    if (item.to === "/drop-out") {
        return (
            currentPath.startsWith("/drop-out") ||
            currentPath.startsWith("/dropout-detail") ||
            currentName === "dropout-detail" ||
            currentName === "drop-out"
        );
    }
    if (item.to === "/student-lists") {
        return (
            currentPath.startsWith("/student-lists") ||
            currentName === "student-lists" ||
            currentName === "student-detail" ||
            currentName === "student-evaluation"
        );
    }

    return currentPath === item.to || currentPath.startsWith(item.to);
};

const isChildActive = (child, parentItem) => {
    const currentPath = route.path;
    const currentName = route.name;
    const fromQuery = route.query?.from;

    // Normal exact match
    if (currentPath === child.to) {
        return true;
    }

    // Detail page: Application Review
    if (
        currentPath.startsWith("/application-review") ||
        currentName === "application-review"
    ) {
        if (parentItem.label === "បញ្ជីអ្នកដាក់ពាក្យ") {
            if (fromQuery === "passed") return child.to === "/all-application/passed";
            if (fromQuery === "failed") return child.to === "/all-application/failed";
            return child.to === "/all-application";
        }
    }

    // Detail page: Shortlist Detail
    if (
        currentPath.startsWith("/shortlist-detail") ||
        currentName === "shortlist-detail"
    ) {
        if (parentItem.label === "បញ្ជីសម្រាំង") {
            if (fromQuery === "passed") return child.to === "/all-shortlist/passed";
            if (fromQuery === "failed") return child.to === "/all-shortlist/failed";
            return child.to === "/all-shortlist";
        }
    }

    // Detail page: Final Result Detail
    if (
        currentPath.startsWith("/final-result-detail") ||
        currentName === "final-result-detail"
    ) {
        if (parentItem.label === "លទ្ធផលចុងក្រោយ") {
            if (fromQuery === "passed") return child.to === "/final-results/passed";
            if (fromQuery === "reserve") return child.to === "/final-results/reserve";
            return child.to === "/final-results";
        }
    }

    return false;
};

const syncOpenDropdown = () => {
    const currentPath = route.path;
    const currentName = route.name;

    if (
        currentPath.startsWith("/all-application") ||
        currentPath.startsWith("/application-review") ||
        currentName === "application-review"
    ) {
        openDropdownMenu.value = "បញ្ជីអ្នកដាក់ពាក្យ";
    } else if (
        currentPath.startsWith("/all-shortlist") ||
        currentPath.startsWith("/shortlist-detail") ||
        currentName === "shortlist-detail"
    ) {
        openDropdownMenu.value = "បញ្ជីសម្រាំង";
    } else if (
        currentPath.startsWith("/final-results") ||
        currentPath.startsWith("/final-result-detail") ||
        currentName === "final-result-detail"
    ) {
        openDropdownMenu.value = "លទ្ធផលចុងក្រោយ";
    }
};

watch(
    () => route.fullPath,
    () => {
        syncOpenDropdown();
    },
    { immediate: true }
);

const isSidebarOpen = computed(() => {
    if (typeof window !== "undefined" && window.innerWidth < 992) {
        return layoutStore.isMobileSidebarOpen;
    }
    return layoutStore.isAsideOpen;
});

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
                },
                {
                    label: "ធ្លាក់",
                    to: "/all-application/failed",
                },
                {
                    label: "ជាប់",
                    to: "/all-application/passed",
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
                },
                {
                    label: "ធ្លាក់",
                    to: "/all-shortlist/failed",
                },
                {
                    label: "ជាប់",
                    to: "/all-shortlist/passed",
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
                },
                {
                    label: "បម្រុង",
                    to: "/final-results/reserve",
                },
                {
                    label: "ជាប់",
                    to: "/final-results/passed",
                }
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

<style scoped>
.sidebar-illustration {
    max-height: 200px;
    width: auto;
    object-fit: contain;
    transition: max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1), transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.sidebar-bottom-section {
    padding-bottom: 12px;
    transition: padding 0.35s ease;
}

.sidebar-bottom-section.img-collapsed {
    padding-bottom: 4px;
}

.sidebar-bottom-section.img-collapsed .sidebar-illustration {
    max-height: 160px;
    transform: scale(0.95);
}
</style>