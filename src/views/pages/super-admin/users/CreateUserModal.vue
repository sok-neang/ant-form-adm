<template>
  <BaseModal :show="props.show" size="lg" :showClose="true" :close-on-backdrop="!loading" @close="handleClose">
    <!-- ================= HEADER ================= -->
    <template #header>
      <div class="d-flex align-items-center gap-3">
        <!-- Icon -->
        <div class="d-flex align-items-center justify-content-center
                bg-primary-subtle text-primary rounded-3" style="width: 42px; height: 42px;">
          <i class="bi bi-person-plus-fill fs-5"></i>
        </div>
        <!-- Title -->
        <div>
          <h5 class="modal-title fw-bold mb-1">
            បង្កើតគណនី
          </h5>
          <p class="text-muted mb-0 small">
            បញ្ចូលព័ត៌មានអ្នកប្រើប្រាស់ ដើម្បីបង្កើតគណនីថ្មី
          </p>
        </div>
      </div>
    </template>

    <!-- ================= BODY ================= -->
    <UserForm :form="form" :errors="errors" :genderOptions="genderOptions" :roleOptions="roleOptions"
      :typeCourseOptions="specializationOptions" @blur="onBlur" @input="onInput" />

    <!-- ================= FOOTER ================= -->
    <template #footer>
      <div class="d-flex justify-content-end gap-2 w-100">
        <BaseButton type="submit" variant="" custom-class="btn-light px-4 bg-secondary-subtle py-2 w-50"
          @click="handleClose">
          បោះបង់
        </BaseButton>
        <BaseButton type="submit" variant="bg-primary" custom-class="w-50 py-2 bg-primary text-light"
          :is-loading="loading" loading-text="Signing in..." @click="handleCreate">
          បង្កើតគណនី
        </BaseButton>
      </div>
    </template>
  </BaseModal>
</template>
<script setup>
import UserForm from "@/components/form/UserForm.vue";
import BaseButton from "@/components/ui/base/BaseButton.vue";
import BaseModal from "@/components/ui/base/BaseModal.vue";

import { useUserForm } from "@/composable/user/useUserForm";
import userService from "@/services/user.service";

import { specializationOptions, roleOptions, genderOptions, } from "@/constants/options";


const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close", "created",]);
const { form,errors,loading,resetForm, validateForm,onInput,onBlur,resetValidation,applyBackendErrors} = useUserForm("create");
const handleClose = () => {
  if (loading.value) return;
  resetValidation();
  resetForm()
  emit("close");
};

// Create User
const handleCreate = async () => {
  // Validate form first
  if (!validateForm()) {
    return;
  }
  if (loading.value) return;
  loading.value = true;

  try {
    // Prepare Payload
    const payload = {
      name: form.name,
      email: form.email,
      gender: form.gender,
      role: form.role,
    };

    if (form.role === "TEACHER") {
      payload.teachingSubject = form.teachingSubject;
    }

    const response = await userService.create(payload);
    if (response.data?.success) {
      const data = response.data.data;

      const user = {
        id: data.id,
        name: data.name || form.name,
        email: data.email || form.email,
        role: data.role || form.role,
        password: data.plainPassword,
      };
      emit("created", user);
      emit("close");
      resetValidation();
    }
  } catch (err) {
    console.error("Create user error:", err);
    const response = err.response;
    if (response?.status === 409 && response?.data?.message === "Email is already registered.") {
      errors.email = "អ៊ីមែលនេះបានប្រើប្រាស់ររួចម្តងហើយ";
      return;
    }
    const backendErrors = response?.data?.details;
    if (backendErrors && typeof backendErrors === "object" ) {
      applyBackendErrors(backendErrors, mapBackendMessage);
    }
  } finally {
    loading.value = false;
  }
};
</script>