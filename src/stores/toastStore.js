import { defineStore } from "pinia";
import { ref } from "vue";
export const useToastStore = defineStore("toast", () => {

    const MAX_TOASTS = 5;
    const DEFAULT_DURATION = 3000;
    const toasts = ref([]);
    // Store active timers
    const timers = new Map();
    const generateId = () =>
        `toast-${Date.now()}-${Math.random()
            .toString(36)
            .slice(2, 9)}`;

    const getToast = (id) =>
        toasts.value.find((toast) => toast.id === id);

    const clearToastTimer = (id) => {
        const timerData = timers.get(id);

        if (!timerData) return;

        clearTimeout(timerData.timer);
        timers.delete(id);
    };
    const startTimer = (toast) => {
        if (!toast?.autoDismiss || toast.remaining <= 0) {
            return;
        }
        // Clear existing timer
        clearToastTimer(toast.id);
        const startTime = Date.now();
        const timer = setTimeout(() => {
            removeToast(toast.id);
        }, toast.remaining);

        timers.set(toast.id, {
            timer,
            startTime,
        });

        toast.isPaused = false;
    };
    const pauseTimer = (toast) => {
        if (
            !toast ||
            toast.isPaused ||
            !toast.autoDismiss
        ) {
            return;
        }

        const timerData = timers.get(toast.id);
        if (!timerData) return;
        clearTimeout(timerData.timer);
        const elapsed =
            Date.now() - timerData.startTime;
        toast.remaining = Math.max(0, toast.remaining - elapsed);
        toast.isPaused = true;
        timers.delete(toast.id);
    };
    const resumeTimer = (toast) => {
        if (
            !toast ||
            !toast.isPaused ||
            !toast.autoDismiss
        ) {
            return;
        }

        startTimer(toast);
    };

    const addToast = ({
        message = "",
        variant = "success",
        duration = DEFAULT_DURATION,
        autoDismiss = true,
    } = {}) => {
        // Remove oldest toast if limit reached
        if (toasts.value.length >= MAX_TOASTS) {
            const oldestToast = toasts.value[0];

            if (oldestToast) {
                removeToast(oldestToast.id);
            }
        }

        const toast = {
            id: generateId(),
            message,
            variant,
            duration,
            remaining: duration,
            isPaused: false,
            autoDismiss,
        };

        toasts.value.push(toast);

        if (autoDismiss && duration > 0) {
            startTimer(toast);
        }

        return toast.id;
    };

    const removeToast = (id) => {
        const index = toasts.value.findIndex(
            (toast) => toast.id === id
        );

        if (index === -1) return;

        clearToastTimer(id);

        toasts.value.splice(index, 1);
    };


    const clearAll = () => {
        timers.forEach(({ timer }) => {
            clearTimeout(timer);
        });

        timers.clear();
        toasts.value = [];
    };


    const success = (message, options = {}) => {
        return addToast({
            message,
            variant: "success",
            ...options,
        });
    };

    const error = (message, options = {}) => {
        return addToast({
            message,
            variant: "error",
            ...options,
        });
    };

    const warning = (message, options = {}) => {
        return addToast({
            message,
            variant: "warning",
            ...options,
        });
    };

    const info = (message, options = {}) => {
        return addToast({
            message,
            variant: "info",
            ...options,
        });
    };

    return {
        toasts,
        addToast,
        removeToast,
        pauseTimer,
        resumeTimer,
        clearAll,
        success,
        error,
        warning,
        info,
    };
});