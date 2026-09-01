<template>
    <Teleport to="body">
        <div class="app-toast-container position-fixed bottom-0 start-0 p-3">
            <TransitionGroup name="toast" tag="div">
                <div v-for="toast in toastStore.toasts" :key="toast.id" class="alert shadow-sm rounded-3"
                    :class="alertClass(toast.variant)" role="alert" @mouseenter="toastStore.pauseTimer(toast)"
                    @mouseleave="toastStore.resumeTimer(toast)">
                    <div class="d-flex align-items-center justify-content-between">
                        <div class="d-flex align-items-center justify-content-center gap-2">
                            <i :class="iconClass(toast.variant)" class="fs-4 flex-shrink-0"></i>

                            <span class="fw-semibold text-center">
                                {{ toast.message }}
                            </span>
                        </div>

                        <button type="button" class="btn-close ms-3" aria-label="Close"
                            @click="toastStore.removeToast(toast.id)"></button>
                    </div>
                </div>
            </TransitionGroup>
        </div>
    </Teleport>
</template>

<script setup>
import { useToastStore } from "@/stores/toastStore";
const toastStore = useToastStore();
const variants = {
    success: {
        icon: "bi bi-check-circle-fill text-success",
        alert: "alert-success",
    },

    error: {
        icon: "bi bi-exclamation-circle-fill text-danger",
        alert: "alert-danger",
    },

    warning: {
        icon: "bi bi-exclamation-triangle-fill text-warning",
        alert: "alert-warning",
    },


};

const alertClass = (variant) => {
    return variants[variant]?.alert || variants.info.alert;
};

const iconClass = (variant) => {
    return variants[variant]?.icon || variants.info.icon;
};
</script>

<style scoped>
.app-toast-container {
    z-index: 999999 !important;
}

.alert {
    min-width: 320px;
    max-width: 450px;
    margin-bottom: 1rem;
    padding: 1rem 1.25rem;
}

.toast-enter-active,
.toast-leave-active {
    transition:
        opacity 0.4s ease,
        transform 0.4s ease;
}

.toast-enter-from,
.toast-leave-to {
    opacity: 0;
    transform: translateY(10px);
}

.toast-move {
    transition: transform 0.4s ease;
}
</style>