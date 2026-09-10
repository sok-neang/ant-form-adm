<template>
    <header class="app-navbar">
        <div class="container-fluid d-flex align-items-center justify-content-between h-100">
            <div class="d-flex align-items-center">
                <button type="button" class="sidebar-toggle" @click="layoutStore.toggleAside">
                    <i :class="layoutStore.isAsideOpen
                        ? 'bi bi-chevron-left'
                        : 'bi bi-chevron-right'
                        "></i>
                </button>
            </div>
            <div ref="dropdownRef" class="position-relative">
                <button type="button" class="btn p-0 border-0 bg-transparent profile-btn" @click="toggleDropdown">
                    <div class="d-flex align-items-center gap-2">
                        <div class="profile-avatar position-relative">
                            <img :src="getAvatarUrl(authStore.user?.avatarPath)" alt="Profile" width="40" height="40"
                                class="rounded-circle border border-secondary object-fit-cover" @error="handleImageError" />
                            <span class="status-online"></span>
                        </div>
                        <div class="text-start">
                            <div class="fw-semibold text-dark mx-2">
                                {{ authStore.user?.name }}
                            </div>
                        </div>
                        <i class="bi ms-1 text-muted" :class="isOpen ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
                    </div>
                </button>
                <!-- Dropdown -->
                <div v-if="isOpen"
                    class="dropdown-menu show shadow p-2 d-block position-absolute end-0 mt-2 profile-dropdown">
                    <!-- Profile Information -->
                    <div class="px-3 py-2">
                        <div class="d-flex align-items-center gap-3 px-2 py-2">
                            <!-- Avatar -->
                            <div class="flex-shrink-0">
                                <img :src="getAvatarUrl(authStore.user?.avatarPath)" alt="Avatar" width="50" height="50"
                                    class="rounded-2 object-fit-cover border" @error="handleImageError" />
                            </div>
                            <!-- User Information -->
                            <div class="flex-grow-1 min-w-0">
                                <div class="mb-1">
                                    <span class="badge badge-light-success px-2 py-1">
                                        {{ authStore.user?.role }}
                                    </span>
                                </div>
                                <div class="small text-muted text-truncate">
                                    {{ authStore.user?.email }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="dropdown-divider"></div>
                    <!-- Profile -->
                    <RouterLink to="/profile" class="dropdown-item fs-6" @click="closeDropdown">
                        <i class="bi bi-person-circle"></i>
                        គណនីរបស់ខ្ញុំ
                    </RouterLink>

                    <div class="dropdown-divider"></div>

                    <!-- Logout -->
                    <button type="button" class="dropdown-item fs-6 text-danger" @click="onLogout">
                        <i class="bi bi-arrow-left-circle "></i>
                        ចាកចេញ
                    </button>
                </div>
            </div>
        </div>
    </header>
</template>


<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useLayoutStore } from "@/stores/layout";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter } from "vue-router";
import default_avatar from "@/assets/images/img/default_avatar.png"
const router = useRouter()
const authStore = useAuthStore();
const layoutStore = useLayoutStore();

const isOpen = ref(false);
const dropdownRef = ref(null);


// Avatar URL resolver
const getAvatarUrl = (path) => {
    if (!path) return default_avatar;
    if (path.startsWith('http')) return path;
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
    return `${baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
};

// Fallback if image fails to load
const handleImageError = (e) => {
    e.target.src = default_avatar;
};

// Toggle dropdown
const toggleDropdown = () => {
    isOpen.value = !isOpen.value;
};

// Close dropdown
const closeDropdown = () => {
    isOpen.value = false;
};

// Close when clicking outside
const handleClickOutside = (event) => {
    if (
        dropdownRef.value &&
        !dropdownRef.value.contains(event.target)
    ) {
        closeDropdown();
    }
};

const onLogout = async () => {
  closeDropdown();

  try {
    const response = await authStore.logout();

    if (response?.success) {
      router.push("/auth/login");
    }
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

onMounted( async ()  => {
    document.addEventListener("click", handleClickOutside);
    await authStore.getProfile();   
});

onBeforeUnmount(() => {
    document.removeEventListener("click", handleClickOutside);
});

</script>
<style scoped>
.profile-dropdown {
    width: 280px !important;
    min-width: 200px !important;
    z-index: 1055;
}

.profile-btn {
    transition: all 0.2s ease;
}

.profile-btn:hover {
    opacity: 0.85;
}

.profile-avatar {
    position: relative;
    width: 40px;
    height: 40px;
    flex-shrink: 0;
}

.profile-avatar img {
    width: 40px;
    height: 40px;
    object-fit: cover;
}

.status-online {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 11px;
    height: 11px;
    background-color: #198754;
    border: 2px solid #fff;
    border-radius: 50%;
}

.badge-light-success {
    background-color: #e8f8f0;
    color: #198754;
    font-weight: 500;
}

.min-w-0 {
    min-width: 0;
}
</style>
