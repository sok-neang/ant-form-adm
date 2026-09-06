<template>
    <div>
        <label v-if="label" :class="['form-label', { 'text-gray-400': disabled }]">
            {{ label }}
            <span v-if="labelHint" class="fw-normal text-muted">
                {{ labelHint }}
            </span>
        </label>

        <!-- INPUT -->
        <div v-if="tag === 'input'" :class="['input-group', { 'has-validation': error }]">
            <span v-if="$slots.default" class="input-group-text px-3">
                <slot></slot>
            </span>
            <input :value="modelValue" :type="type" :min="min" :max="max" :placeholder="placeholder" class="p-2"
                :class="['form-control', inputClass, { 'is-invalid': error }]" @input="onInput" @blur="onBlur"
                :disabled="disabled" :readonly="readonly" />

            <span v-if="$slots.append" class="input-group-text box-icon-password">
                <slot name="append" />
            </span>

            <div v-if="error" class="invalid-feedback ms-12">
                {{ error }}
            </div>
        </div>

        <!-- TEXTAREA -->
        <div v-else class="position-relative">
            <textarea :value="modelValue" :placeholder="placeholder" :rows="rows"
                :class="['form-control  no-resize', inputClass, { 'is-invalid': error }, { 'pb-4': maxlength }]"
                @input="onInput" @blur="onBlur" :disabled="disabled" :readonly="readonly"
                :maxlength="maxlength"></textarea>

            <div v-if="error" class="invalid-feedback">
                {{ error }}
            </div>

            <span v-if="maxlength && modelValue?.length > 0" class="character-counter">
                {{ modelValue?.length || 0 }} / {{ maxlength }}
            </span>
        </div>

        <div v-if="tag === 'textarea' && formHint" class="form-text mt-2">
            {{ formHint }}
        </div>
        <div v-else-if="tag === 'input' && formHint && !error" class="form-text mt-2">
            {{ formHint }}
        </div>
    </div>
</template>

<script setup>

const props = defineProps({
    modelValue: String,
    label: String,
    labelHint: String,
    placeholder: String,
    error: String,
    formHint: String,

    tag: {
        type: String,
        default: "input",
    },

    type: {
        type: String,
        default: "text",
    },

    rows: {
        type: Number,
        default: 3,
    },

    inputClass: {
        type: String,
        default: "",
    },

    maxlength: {
        type: Number,
        default: null,
    },

    min: {
        type: [Number, String],
        default: null,
    },

    max: {
        type: [Number, String],
        default: null,
    },

    numeric: {
        type: Boolean,
        default: false,
    },

    disabled: Boolean,
    readonly: Boolean,
});

const emit = defineEmits(["update:modelValue", "blur"]);

const onInput = (e) => {
  let value = e.target.value;

  if (props.numeric) {
    value = value.replace(/\D/g, "");
    e.target.value = value;
  }

  emit("update:modelValue", value);
};

const onBlur = (e) => {
    emit("blur", e.target.value);
};
</script>

<style scoped>
.character-counter {
    position: absolute;
    bottom: 8px;
    right: 10px;
    font-size: 0.75rem;
    color: #94a3b8;
    pointer-events: none;
}


</style>