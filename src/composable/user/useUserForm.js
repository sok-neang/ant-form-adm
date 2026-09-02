import { reactive, ref } from "vue";
import userService from "@/services/user.service";
import {createUserSchema,editUserSchema,} from "@/schemas/userSchema";
import { useValidation } from "@/composable/useValidation";

export const useUserForm = (mode = "create") => {
  const loading = ref(false);
  const serverError = ref(null);
  let password  = ref(null);

  const form = reactive({
    name: "",
    email: "",
    gender: "",
    role: "",
    teachingSubject: "",
  });

  // Choose schema based on mode
  const schema = mode === "edit"? editUserSchema: createUserSchema;
  // console.log(form);
  
  const {
    errors,
    isDirty,
    isFormValid,
    modifiedFields,
    onInput,
    onBlur,
    validateForm,
    resetValidation,
    applyBackendErrors,
  } = useValidation(schema, form);

  const populateForm = (data) => {
    form.name = data.name ?? "";
    form.email = data.email ?? "";
    form.gender = data.gender ?? "";
    form.role = data.role ?? "";
    form.teachingSubject = data.teachingSubject ?? "";

    resetValidation();
  };


  const resetForm = () => {
    form.name = "";
    form.email = "";
    form.gender = "";
    form.role = "";
    form.teachingSubject = "";
    serverError.value = null;

    resetValidation();
  };


  return {
    form,

    // State
    loading,
    serverError,

    // Validation
    errors,
    isDirty,
    isFormValid,
    modifiedFields,
    password,
    validateForm,
    onInput,
    onBlur,
    resetValidation,
    applyBackendErrors,
    resetForm,
    populateForm,
  };
};