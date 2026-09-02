import { useToastStore } from "@/stores/toastStore";
export const useAppToast = () => {
    const toastStore = useToastStore();
    const success = (message, options = {}) => {
        return toastStore.success(message, options);
    };
    const error = (message, options = {}) => {
        return toastStore.error(message, options);
    };
    const warning = (message, options = {}) => {
        return toastStore.warning(message, options);
    };
    const info = (message, options = {}) => {
        return toastStore.info(message, options);
    };

    const remove = (id) => {
        toastStore.removeToast(id);
    };
    const clear = () => {
        toastStore.clearAll();
    };
    return {
        success,
        error,
        warning,
        info,
        remove,
        clear,
    };
};