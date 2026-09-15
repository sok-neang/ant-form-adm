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
        :class="[sizeClass, customClass]"
        :style="dialogStyle"
      >
        <div class="modal-content" :style="contentStyle">
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
import { computed, watch, onBeforeUnmount } from "vue";

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

  width: {
    type: String,
    default: "",
  },

  customClass: {
    type: String,
    default: "",
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
    md: "modal-md",
    lg: "modal-lg",
    xl: "modal-xl",
  }[props.size] || (props.size ? `modal-${props.size}` : "modal-md");
});

const dialogStyle = computed(() => {
  const styles = {};
  if (props.width) {
    styles.maxWidth = props.width;
  }
  return styles;
});

const contentStyle = computed(() => {
  const styles = {};
  if (props.width) {
    styles.maxWidth = props.width;
  }
  return styles;
});

const close = () => {
  if (!props.closeOnBackdrop) {
    return;
  }

  emit("close");
  emit("update:show", false);
};

// Prevent background scrolling without layout shift (scrollbar jump)
watch(
  () => props.show,
  (value) => {
    if (value) {
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      if (scrollBarWidth > 0) {
        document.body.style.paddingRight = `${scrollBarWidth}px`;
      }
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.paddingRight = "";
      document.body.style.overflow = "";
    }
  }
);

onBeforeUnmount(() => {
  document.body.style.paddingRight = "";
  document.body.style.overflow = "";
});
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
  margin: auto;
  width: 100%;
  max-width: 550px;
}

.modal-dialog.modal-sm {
  max-width: 400px;
}

.modal-dialog.modal-md {
  max-width: 550px;
}

.modal-dialog.modal-lg {
  max-width: 660px;
}

.modal-dialog.modal-xl {
  max-width: 900px;
}

.btn-close:focus {
  box-shadow: 0 0 0 2px rgba(166, 211, 193, 0.619) !important;
}
.modal-content {
  border: none;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 15px 45px rgba(0, 0, 0, 0.18);
  width: 100%;
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
   MODAL TRANSITION (Smooth Zoom & Fade)
========================= */

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.22s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-enter-active .modal-dialog,
.modal-leave-active .modal-dialog {
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.22s ease;
  will-change: transform, opacity;
}

.modal-enter-from {
  opacity: 0;
}

.modal-enter-from .modal-dialog {
  opacity: 0;
  transform: translateY(-16px) scale(0.96);
}

.modal-enter-to {
  opacity: 1;
}

.modal-enter-to .modal-dialog {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.modal-leave-from {
  opacity: 1;
}

.modal-leave-from .modal-dialog {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.modal-leave-to {
  opacity: 0;
}

.modal-leave-to .modal-dialog {
  opacity: 0;
  transform: translateY(-10px) scale(0.97);
}
</style>