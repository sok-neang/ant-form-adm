<template>
  <!-- Link Button -->
  <RouterLink
    v-if="to"
    :to="to"
    class="btn d-flex align-items-center justify-content-center gap-1 rounded-4 fs-6"
    :class="[btnClass, customClass]"
  >
    <!-- Loading -->
    <div
      v-if="isLoading"
      class="d-flex align-items-center w-100 gap-2 justify-content-center"
    >
      <slot
        v-if="iconPosition === 'left'"
        name="icon"
      />
      <div class="d-flex align-items-center gap-2">
        <span
          class="spinner-border spinner-border-sm"
          role="status"
          aria-hidden="true"
        ></span>

        {{ loadingText }}
      </div>

      <slot
        v-if="iconPosition === 'right'"
        name="icon"
      />
    </div>

    <!-- Default -->
    <span
      v-else
      class="d-flex align-items-center w-100 gap-2 justify-content-center"
    >
      <slot
        v-if="iconPosition === 'left'"
        name="icon"
      />

      <slot />

      <slot
        v-if="iconPosition === 'right'"
        name="icon"
      />
    </span>
  </RouterLink>


  <!-- Normal Button -->
  <button
    v-else
    :type="type"
    class="btn d-flex align-items-center justify-content-center gap-1 rounded-0 fs-6 py-2 h-50"
    :class="[btnClass, customClass]"
    :disabled="disabled || isLoading"
    @click="handleClick"
  >
    <!-- Loading -->
    <div
      v-if="isLoading"
      class="d-flex align-items-center w-100 gap-2 justify-content-center"
    >
      <slot
        v-if="iconPosition === 'left'"
        name="icon"
      />

      <div class="d-flex align-items-center gap-2">
        <span
          class="spinner-border spinner-border-sm"
          role="status"
          aria-hidden="true"
        ></span>

        {{ loadingText }}
      </div>

      <slot
        v-if="iconPosition === 'right'"
        name="icon"
      />
    </div>

    <!-- Default -->
    <span
      v-else
      class="d-flex align-items-center w-100 gap-2 justify-content-center"
    >
      <slot
        v-if="iconPosition === 'left'"
        name="icon"
      />

      <slot />

      <slot
        v-if="iconPosition === 'right'"
        name="icon"
      />
    </span>
  </button>
</template>


<script setup>
import { computed } from "vue";

const props = defineProps({
  type: {
    type: String,
    default: "button",
  },

  variant: {
    type: String,
    default: "primary",
  },

  disabled: {
    type: Boolean,
    default: false,
  },

  isLoading: {
    type: Boolean,
    default: false,
  },

  customClass: {
    type: String,
    default: "",
  },

  loadingText: {
    type: String,
    default: "កំពុងដំណើរការ",
  },

  iconPosition: {
    type: String,
    default: "left",
  },

  to: {
    type: [String, Object],
    default: null,
  },
});

const emit = defineEmits(["click"]);

const btnClass = computed(() => {
  return `btn-${props.variant}`;
});

const handleClick = (event) => {
  if (!props.isLoading && !props.disabled) {
    emit("click", event);
  }
};
</script>


<style scoped>
.btn {
  border-radius: var(--bs-btn-border-radius) !important;
  height: 45px !important;
  border-radius: 5px;
}

.btn-danger-light {
  background-color: #fdeceab9 !important;
  border: 1px solid #dc3545 !important;
  color: #dc3545 !important;
}

.btn-danger-light:hover {
  background-color: #f8d7da !important;
  color: #dc3545 !important;
}
/* --------------------------------------------------- */
/* ---- btn-bg-primary ---- */
.btn-bg-primary {
  background-color: var(--bs-primary) !important;
  border: 1px solid var(--bs-primary) !important;
  color: white !important;
}

.btn-bg-primary:hover {
  background-color: #F59E0B !important;
  border: 1px solid #F59E0B !important;
  color: white !important;
}

.btn-bg-primary .spinner-border {
  color: white !important;
}

.btn-bg-primary.disabled .spinner-border {
  color: white !important;
}

/* ---- btn-outline-primary ---- */
.btn-outline-primary {
  background-color: white !important;
  border: 1px solid var(--bs-primary) !important;
  color: var(--bs-primary) !important;
}

.btn-outline-primary:hover {
  background-color: var(--bs-primary) !important;
  border: 1px solid var(--bs-primary) !important;
  color: white !important;
}

.btn-outline-primary .spinner-border {
  color: var(--bs-primary) !important;
}

.btn-outline-primary.disabled .spinner-border {
  color: var(--bs-primary) !important;
}

/* --------------------------------------------------- */
</style>