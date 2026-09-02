<template>
  <Transition name="modal">
    <div
      v-show="show"
      class="modal-wrapper"
      tabindex="-1"
      role="dialog"
      aria-modal="true"
      @click.self="close"
    >
      <!-- Backdrop -->
      <div class="modal-backdrop"></div>

      <!-- Modal -->
      <div
        class="modal-dialog modal-dialog-centered d-flex justify-content-center"
        :class="sizeClass"
      >
        <div class="modal-content">
          <!-- Header -->
          <div class="modal-header">
            <slot name="header"></slot>

            <button
              v-if="showClose"
              type="button"
              class="btn-close bg-secondary-subtle p-2"
              aria-label="Close"
              @click="close"
            ></button>
          </div>

          <!-- Body -->
          <div class="modal-body">
            <slot />
          </div>

          <!-- Footer -->
          <div
            v-if="$slots.footer"
            class="modal-footer"
          >
            <slot name="footer" />
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>


<script setup>
import { computed, watch } from "vue";

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },

  title: {
    type: String,
    default: "",
  },

  size: {
    type: String,
    default: "md",
  },

  showClose: {
    type: Boolean,
    default: true,
  },

  closeOnBackdrop: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits([
  "close",
  "update:show",
]);

const sizeClass = computed(() => {
  return {
    sm: "modal-sm",
    md: "",
    lg: "modal-lg",
    xl: "modal-xl",
  }[props.size];
});

const close = () => {
  if (!props.closeOnBackdrop) {
    return;
  }

  emit("close");
  emit("update:show", false);
};

// Prevent background scrolling
watch(
  () => props.show,
  (value) => {
    document.body.style.overflow = value
      ? "hidden"
      : "";
  }
);
</script>


<style scoped>
.modal-wrapper {
  position: fixed;
  inset: 0;
  z-index: 1055;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
  padding: 20px;
}

/* =========================
   BACKDROP
========================= */

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: -1;
}

/* =========================
   MODAL
========================= */

.modal-dialog {
  position: relative;
  z-index: 1;
}

.modal-content {
  border: none;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 15px 45px rgba(0, 0, 0, 0.18);
  width: 550px;
  background: #fff;
}

.modal-header {
  padding: 18px 24px;
}

.modal-body {
  padding: 10px 24px;
}

.modal-footer {
  padding: 0 24px 24px;
  border-top: 0 !important;
}

/* =========================
   MODAL TRANSITION
========================= */

/* Enter */

.modal-enter-active {
  transition:
    opacity 0.25s ease,
    transform 0.35s ease;
}

.modal-enter-from {
  opacity: 0;
}

.modal-enter-from .modal-dialog {
  transform: translateY(-60px);
}

.modal-enter-to {
  opacity: 1;
}

.modal-enter-to .modal-dialog {
  transform: translateY(0);
}


/* Leave */

.modal-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.25s ease;
}

.modal-leave-from {
  opacity: 1;
}

.modal-leave-from .modal-dialog {
  transform: translateY(0);
}

.modal-leave-to {
  opacity: 0;
}

.modal-leave-to .modal-dialog {
  transform: translateY(-30px);
}
</style>