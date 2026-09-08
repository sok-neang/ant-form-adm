<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import TomSelect from "tom-select";

const props = defineProps({
  modelValue: {
    type: [String, Number, Array, null],
    default: null,
  },

  options: {
    type: Array,
    default: () => [],
  },

  optionLabel: {
    type: String,
    default: "label",
  },

  optionValue: {
    type: String,
    default: "value",
  },

  optionImage: {
    type: String,
    default: "",
  },

  multiple: {
    type: Boolean,
    default: false,
  },

  searchable: {
    type: Boolean,
    default: true,
  },

  placeholder: {
    type: String,
    default: "Select...",
  },

  disabled: {
    type: Boolean,
    default: false,
  },

  label: {
    type: String,
    default: "",
  },

  icon: {
    type: String,
    default: "",
  },

  clearable: {
    type: Boolean,
    default: true,
  },

  error: {
    type: String,
    default: "",
  },

  loadOptions: {
    type: Function,
    default: null,
  },
});

const emit = defineEmits([
  "update:modelValue",
  "change",
  "focus",
  "blur",
]);

const selectRef = ref(null);

const isFocused = ref(false);
const isOpen = ref(false);
const hasValue = ref(false);
const tomReady = ref(false);

let tom = null;

const showClear = computed(() => {
  return (
    !props.multiple &&
    props.clearable &&
    hasValue.value &&
    !props.disabled
  );
});

/**
 * Check whether select has value
 */
function updateHasValue() {
  if (!tom) {
    hasValue.value = false;
    return;
  }

  const value = tom.getValue();

  if (props.multiple) {
    hasValue.value = Array.isArray(value)
      ? value.length > 0
      : value !== "";
  } else {
    hasValue.value = value !== "" && value != null;
  }
}

/**
 * Convert TomSelect value
 * to the original option value
 */
function normalizeOutgoing(value) {
  const findOption = (raw) => {
    const option = props.options.find(
      (item) =>
        String(item[props.optionValue]) === String(raw)
    );

    return option
      ? option[props.optionValue]
      : raw;
  };

  if (props.multiple) {
    if (!value) return [];

    const values = Array.isArray(value)
      ? value
      : value.split(",").filter(Boolean);

    return values.map(findOption);
  }

  return value === ""
    ? ""
    : findOption(value);
}

/**
 * Convert API option to TomSelect option
 */
function mapOption(option) {
  return {
    value: option[props.optionValue],
    text: option[props.optionLabel],

    image: props.optionImage
      ? option[props.optionImage]
      : null,

    searchText: [
      option[props.optionLabel],
      option.name_en,
      option.student_number,
    ]
      .filter(Boolean)
      .join(" "),

    raw: option,
  };
}

/**
 * Sync options from Vue
 * to TomSelect
 */
function syncOptions() {
  if (!tom) return;

  tom.clearOptions();

  props.options.forEach((option) => {
    tom.addOption(mapOption(option));
  });

  tom.refreshOptions(false);

  const desired =
    props.modelValue ??
    (props.multiple ? [] : "");

  tom.setValue(desired, true);

  updateHasValue();
}

/**
 * Clear selected value
 */
function clearSelection() {
  if (!tom) return;

  tom.clear();
  tom.close();

  const value = props.multiple
    ? []
    : null;

  emit("update:modelValue", value);
  emit("change", value);

  updateHasValue();
}

/**
 * Build TomSelect
 */
function buildTomSelect() {
  if (!selectRef.value) return;

  const settings = {
    plugins: [
      ...(props.multiple
        ? ["remove_button"]
        : []),
    ],

    placeholder: props.placeholder,

    maxItems: props.multiple
      ? null
      : 1,

    create: false,

    valueField: "value",
    labelField: "text",
    searchField: ["text", "searchText"],

    loadThrottle: 300,

    ...(props.searchable === false && {
      controlInput: null,
    }),

    ...(props.loadOptions && {
      preload: false,

      load: async (query, callback) => {
        try {
          const result =
            await props.loadOptions(query);

          const data =
            result?.data ?? result ?? [];

          callback(data.map(mapOption));
        } catch (error) {
          console.error(
            "Failed to load options:",
            error
          );

          callback();
        }
      },
    }),

    render: {
      option(data, escape) {
        return `
          <div class="d-flex align-items-center gap-2">
            ${
              data.image
                ? `
                  <img
                    src="${escape(data.image)}"
                    class="rounded-circle"
                    width="32"
                    height="32"
                  >
                `
                : ""
            }

            <span>
              ${escape(data.text)}
            </span>
          </div>
        `;
      },

      item(data, escape) {
        return `
          <div class="d-flex align-items-center gap-2">
            ${
              data.image
                ? `
                  <img
                    src="${escape(data.image)}"
                    class="rounded-circle"
                    width="24"
                    height="24"
                  >
                `
                : ""
            }

            <span>
              ${escape(data.text)}
            </span>
          </div>
        `;
      },
    },
  };

  tom = new TomSelect(
    selectRef.value,
    settings
  );

  syncOptions();

  /**
   * Change
   */
  tom.on("change", (value) => {
    const normalized =
      normalizeOutgoing(value);

    emit(
      "update:modelValue",
      normalized
    );

    emit("change", normalized);

    updateHasValue();
  });

  /**
   * Focus
   */
  tom.on("focus", () => {
    isFocused.value = true;

    emit("focus");
  });

  /**
   * Blur
   */
  tom.on("blur", () => {
    isFocused.value = false;

    emit("blur");
  });

  /**
   * Dropdown open
   */
  tom.on("dropdown_open", () => {
    isOpen.value = true;
  });

  /**
   * Dropdown close
   */
  tom.on("dropdown_close", () => {
    isOpen.value = false;
  });

  if (props.disabled) {
    tom.disable();
  }

  updateHasValue();

  tomReady.value = true;
}

/**
 * Normalize value
 * for comparison
 */
function normalizeValue(value) {
  if (props.multiple) {
    return (
      Array.isArray(value)
        ? value
        : []
    )
      .map(String)
      .sort();
  }

  return value == null
    ? ""
    : String(value);
}

/**
 * Watch v-model
 */
watch(
  () => props.modelValue,
  (value) => {
    if (!tom) return;

    const current =
      normalizeValue(
        tom.getValue()
      );

    const incoming =
      normalizeValue(
        value ??
          (props.multiple
            ? []
            : "")
      );

    if (
      JSON.stringify(current) !==
      JSON.stringify(incoming)
    ) {
      tom.setValue(
        value ??
          (props.multiple
            ? []
            : ""),
        true
      );
    }

    updateHasValue();
  }
);

/**
 * Watch options
 */
watch(
  () => props.options,
  () => {
    syncOptions();
  },
  {
    deep: true,
  }
);

/**
 * Watch disabled
 */
watch(
  () => props.disabled,
  (disabled) => {
    if (!tom) return;

    if (disabled) {
      tom.disable();
    } else {
      tom.enable();
    }
  }
);

/**
 * Mounted
 */
onMounted(() => {
  buildTomSelect();
});

/**
 * Destroy
 */
onBeforeUnmount(() => {
  if (tom) {
    tom.destroy();
    tom = null;
  }
});
</script>

<template>
  <div>
    <!-- Label -->
    <label
      v-if="label"
      class="form-label"
    >
      {{ label }}
    </label>

    <div
      class="base-select"
      :class="{
        'is-disabled': disabled,
        'is-focused': isFocused,
        'is-open': isOpen,
        'has-value': hasValue,
        'is-ready': tomReady,
        'is-invalid': error,
      }"
    >
      <div class="base-select__group">

        <!-- Icon -->
        <span
          v-if="$slots.icon || icon"
          class="base-select__icon"
        >
          <slot name="icon">
            <i :class="icon"></i>
          </slot>
        </span>

        <!-- Native select -->
        <select
          ref="selectRef"
          class="base-select__native"
          :multiple="multiple"
          :disabled="disabled"
        >
          <option
            v-if="!multiple"
            value=""
          ></option>

          <option
            v-for="option in options"
            :key="option[optionValue]"
            :value="option[optionValue]"
          >
            {{ option[optionLabel] }}
          </option>
        </select>

        <!-- Custom placeholder -->
        <span
          v-if="!searchable && !hasValue"
          class="base-select__placeholder"
          :class="{
            'no-icon': !icon
          }"
        >
          {{ placeholder }}
        </span>

        <!-- Clear -->
        <span
          v-if="showClear"
          class="base-select__clear"
          aria-label="Clear selection"
          @mousedown.prevent="clearSelection"
        >
          <svg
            viewBox="0 0 24 24"
            width="12"
            height="12"
          >
            <path
              d="M6 6l12 12M18 6L6 18"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>

        <!-- Chevron -->
        <span
          v-else
          class="base-select__chevron"
          :class="{
            'is-open': isOpen
          }"
        >
          <svg
            viewBox="0 0 24 24"
            width="14"
            height="14"
          >
            <path
              d="M6 9l6 6 6-6"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
      </div>
    </div>

    <!-- Error -->
    <div
      v-if="error"
      class="invalid-feedback d-block ms-13"
    >
      {{ error }}
    </div>
  </div>
</template>

<style scoped>
.base-select {
  --bs-border: #d8dce2;
  /* --bs-border-hover: #EEFFF7; */
  --bs-focus:#4A9982;
  --bs-focus-ring: #EEFFF7;
  /* --bs-bg: #EEFFF7; */
  --bs-icon: #8a93a3;
  --bs-clear-hover: #4a5162;
  --bs-text: #1f2430;
  --bs-radius: 8px;
  --bs-invalid: #dc3545;
  --bs-invalid-ring: rgba(220, 53, 69, 0.105);
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  font-family: inherit;
  position: relative;
}

.base-select.is-open {
  position: relative;
  z-index: 1050;
}

.base-select.is-open .base-select__group {
  z-index: 1050;
}
.base-select__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  min-width: 42px;
  flex-shrink: 0;
  color: var(--bs-icon);
  font-size: 15px;
  background: #f6f7f9;
  border-top-left-radius: var(--bs-radius);
  border-bottom-left-radius: var(--bs-radius);
  border-right: 1px solid var(--bs-border);
}

.base-select__chevron {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--bs-icon);
  pointer-events: none;
  display: flex;
  align-items: center;
  z-index: 2;
  transition: transform 0.15s ease;
}

.base-select__chevron.is-open {
  transform: translateY(-50%) rotate(180deg);
}

.base-select__clear {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--bs-icon);
  pointer-events: auto;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 4px;
  border-radius: 50%;
  z-index: 2;
  transition:
    color 0.15s ease,
    background 0.15s ease;
}

.base-select__clear:hover {
  color: var(--bs-clear-hover);
  background: #eef0f4;
}

.base-select__native {
  visibility: hidden;
  position: absolute;
}

.base-select__group {
  width: 100%;
  min-width: 0;
  border: 1px solid var(--bs-border);
  border-radius: var(--bs-radius);
  background-color: #fff;
  position: relative;
}


.base-select__group :deep(.ts-control) {
  box-shadow: none !important;
  border: none !important;
  border-radius: var(--bs-radius) !important;
  background: transparent !important;
  min-height: 44px;
  height: 100%;
  padding: 0 30px 0 12px;
  font-size: 16px;
  color: var(--bs-text);
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
}

.base-select__icon ~ :deep(.ts-wrapper) .ts-control {
  border-top-left-radius: 0 !important;
  border-bottom-left-radius: 0 !important;
}

.base-select.is-focused
  .base-select__group {
  border-color: var(--bs-focus);
  outline: 1px solid var(--bs-focus);
  box-shadow: 0 0 0 3px var(--bs-focus-ring);
}

.base-select.is-invalid
  .base-select__group {
  border-color: var(--bs-invalid);
  outline: 1px solid var(--bs-invalid);
}

.base-select.is-invalid.is-focused
  .base-select__group {
  box-shadow:
    0 0 0 3px
    var(--bs-invalid-ring);
}

.base-select.is-disabled
  .base-select__group {
  background: #e9ecef;
  cursor: not-allowed;
  opacity: 0.7;
}

.base-select__group :deep(.ts-dropdown) {
  border: 1px solid var(--bs-border);
  border-radius: var(--bs-radius);
  box-shadow: 0 8px 20px rgba(20, 24, 33, 0.08);
  margin-top: 2px;
  font-size: 14px;
  padding: 10px 5px;
  background: #fff;
  z-index: 1050;
}

.base-select__group
  :deep(.ts-dropdown .option) {
  white-space: nowrap;
}

.base-select__group
  :deep(.ts-dropdown .option.active) {
  background: var(--bs-focus-ring);
  color: var(--bs-text);
}

.base-select__group
  :deep(.ts-control .item) {
  border-radius: 5px;
  color: var(--bs-text);
  padding-right: 15px;
  line-height: normal;
  display: flex;
  align-items: center;
  white-space: nowrap;
}

.base-select__group
  :deep(.ts-control input) {
  color: var(--bs-text);
  caret-color: transparent;
  padding: 0;
  margin: 0;
  line-height: normal;
  height: auto;
  min-width: 0 !important;
}

.base-select__group
  :deep(.ts-dropdown [data-selectable] .highlight) {
  background-color: #8888882c;
  padding: 1px !important;
}

.base-select__placeholder {
  position: absolute;
  left: 55px;
  top: 50%;
  transform: translateY(-50%);
  color: #adb5bd;
  font-weight: 500;
  pointer-events: none;
}

.base-select__placeholder.no-icon {
  left: 15px;
}
.base-select {
  width: 100%;
  min-width: 0;
}

.base-select__group {
  position: relative;
  display: flex;
  align-items: stretch;
  width: 100%;
  min-width: 0;
  min-height: 46px;
  border-radius: var(--bs-radius);
  background: var(--bs-bg);
  border: 1px solid var(--bs-border);
}

.base-select__group :deep(.ts-wrapper) {
  flex: 1 1 auto;
  width: 100%;
  min-width: 0;
  max-width: 100%;
}

.base-select__group :deep(.ts-control) {
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  /* background-color: var(--bs-color-hover)!important; */
}
.ts-dropdown-content{
  font-size: 14px !important;
  padding: 5px !important;
}
</style>