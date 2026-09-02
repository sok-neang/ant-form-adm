import { reactive, ref, computed, toRaw } from "vue";
import { normalizeValue, isEmpty } from "@/utils/validationUtils";

export function useValidation(schema, formData) {
  const fieldNames = Object.keys(formData);

  const fieldSchemas = Object.fromEntries(
    fieldNames.map((field) => [
      field,
      schema.shape?.[field],
    ])
  );

  const errors = reactive(
    Object.fromEntries(
      fieldNames.map((field) => [field, ""])
    )
  );

  const touched = reactive(
    Object.fromEntries(
      fieldNames.map((field) => [field, false])
    )
  );

  const submitted = ref(false);

  const initialValues = reactive({
    ...formData,
  });

  const modifiedFields = reactive({});

  const isDirty = computed(
    () => Object.keys(modifiedFields).length > 0
  );

  const isFormValid = computed(() => {
    const normalizedForm = Object.fromEntries(
      fieldNames.map((field) => [
        field,
        normalizeValue(formData[field]),
      ])
    );

    return schema.safeParse(normalizedForm).success;
  });

  // ---------------- Helpers ----------------

  function updateDirty(field) {
    const currentValue = toRaw(formData[field]);
    const initialValue = toRaw(initialValues[field]);

    if (
      JSON.stringify(currentValue) !==
      JSON.stringify(initialValue)
    ) {
      modifiedFields[field] = Array.isArray(currentValue)
        ? [...currentValue]
        : currentValue;
    } else {
      delete modifiedFields[field];
    }
  }

  function clearError(field) {
    if (field in errors) {
      errors[field] = "";
    }
  }

  function clearErrors() {
    Object.keys(errors).forEach((field) => {
      errors[field] = "";
    });
  }

  function resetTouched() {
    Object.keys(touched).forEach((field) => {
      touched[field] = false;
    });
  }

  function clearModifiedFields() {
    Object.keys(modifiedFields).forEach((field) => {
      delete modifiedFields[field];
    });
  }

  function shouldValidate(field) {
    return submitted.value || touched[field];
  }

  // ---------------- Validation ----------------

  function validateField(field) {
    const fieldSchema = fieldSchemas[field];

    if (!fieldSchema) {
      clearError(field);
      return true;
    }

    const value = normalizeValue(formData[field]);

    const result = fieldSchema.safeParse(value);

    if (result.success) {
      clearError(field);
      return true;
    }

    errors[field] =
      result.error.issues?.[0]?.message ||
      "Invalid value";

    return false;
  }

  function validateForm() {
    submitted.value = true;
    const normalizedForm = Object.fromEntries(
      fieldNames.map((field) => [
        field,
        normalizeValue(formData[field]),
      ])
    );

    const result = schema.safeParse(normalizedForm);

    fieldNames.forEach((field) => {
      touched[field] = true;
      updateDirty(field);
    });

    clearErrors();

    if (result.success) {
      return true;
    }

    result.error.issues.forEach((issue) => {
      const field = issue.path[0];

      if (field in errors) {
        errors[field] = issue.message;
      }
    });

    return false;
  }

  // ---------------- Input / Blur ----------------

  function onBlur(field) {
    updateDirty(field);

    const value = formData[field];

    if (!submitted.value && isEmpty(value)) {
      touched[field] = false;
      clearError(field);
      return;
    }

    touched[field] = true;

    validateField(field);
  }

  function onInput(field) {
    updateDirty(field);

    const value = formData[field];

    if (!submitted.value && isEmpty(value)) {
      touched[field] = false;
      clearError(field);
      return;
    }

    if (shouldValidate(field)) {
      validateField(field);
    }
  }

  // ---------------- Reset ----------------

  function resetValidation() {
    clearErrors();
    resetTouched();

    submitted.value = false;

    clearModifiedFields();

    fieldNames.forEach((field) => {
      initialValues[field] = cloneValue(
        formData[field]
      );
    });
  }

  function cloneValue(value) {
    const raw = toRaw(value);

    if (
      raw === null ||
      typeof raw !== "object"
    ) {
      return raw;
    }

    return JSON.parse(JSON.stringify(raw));
  }

  // ---------------- Backend Errors ----------------

  function applyBackendErrors(backendErrors = {}) {
    clearErrors();

    Object.entries(backendErrors).forEach(
      ([field, messages]) => {
        if (!messages?.length) return;

        if (field in errors) {
          errors[field] = messages[0];
          touched[field] = true;
        }
      }
    );
  }

  return {
    errors,
    touched,
    submitted,
    modifiedFields,
    isDirty,
    isFormValid,
    isEmpty,
    validateField,
    validateForm,
    onInput,
    onBlur,
    resetValidation,
    applyBackendErrors,
  };
}