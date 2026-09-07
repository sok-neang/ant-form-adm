import { defineStore } from "pinia";
import { ref } from "vue";

export const useLayoutStore = defineStore("layout", () => {
  const isAsideOpen = ref(true);
  const isMobileSidebarOpen = ref(false);

  const openAside = () => {
    isAsideOpen.value = true;
  };

  const closeAside = () => {
    isAsideOpen.value = false;
  };

  const toggleAside = () => {
    if (typeof window !== "undefined" && window.innerWidth < 992) {
      isMobileSidebarOpen.value = !isMobileSidebarOpen.value;
    } else {
      isAsideOpen.value = !isAsideOpen.value;
    }
  };

  const openMobileSidebar = () => {
    isMobileSidebarOpen.value = true;
  };

  const closeMobileSidebar = () => {
    isMobileSidebarOpen.value = false;
  };

  const toggleMobileSidebar = () => {
    isMobileSidebarOpen.value = !isMobileSidebarOpen.value;
  };

  return {
    isAsideOpen,
    isMobileSidebarOpen,
    openAside,
    closeAside,
    toggleAside,
    openMobileSidebar,
    closeMobileSidebar,
    toggleMobileSidebar,
  };
});