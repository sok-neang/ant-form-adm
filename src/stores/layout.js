import { defineStore } from "pinia";
import { ref } from "vue";

export const useLayoutStore = defineStore("layout", () => {
  const isAsideOpen = ref(true);

  const openAside = () => {
    isAsideOpen.value = true;
  };

  const closeAside = () => {
    isAsideOpen.value = false;
  };

  const toggleAside = () => {
    isAsideOpen.value = !isAsideOpen.value;
  };

  return {
    isAsideOpen,
    openAside,
    closeAside,
    toggleAside,
  };
});