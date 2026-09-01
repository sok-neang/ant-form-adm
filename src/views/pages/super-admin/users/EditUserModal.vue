<template>
  <BaseModal
    :show="props.show"
    size="lg"
    :showClose="true"
    :close-on-backdrop="!loading"
    @close="handleClose"
  >
    <!-- ================= HEADER ================= -->
    <template #header>
      <div class="d-flex align-items-center gap-3">
        <div
          class="d-flex align-items-center justify-content-center
                 bg-primary-subtle text-primary rounded-3"
          style="width: 42px; height: 42px;"
        >
          <i class="bi bi-pencil-square fs-5"></i>
        </div>

        <div>
          <h5 class="modal-title fw-bold mb-1">
            កែប្រែគណនី
          </h5>

          <p class="text-muted mb-0 small">
            កែប្រែព័ត៌មានអ្នកប្រើប្រាស់
          </p>
        </div>
      </div>
    </template>

    <!-- ================= BODY ================= -->
    <div>
      <!-- Loading -->
      <div
        v-if="loadingUser"
        class="d-flex justify-content-center align-items-center py-5"
      >
        <div class="spinner-border text-primary">
          <span class="visually-hidden">
            Loading...
          </span>
        </div>
      </div>

      <!-- Form -->
      <UserForm
        v-else
        :form="form"
        :errors="errors"
        :genderOptions="genderOptions"
        :roleOptions="roleOptions"
        :typeCourseOptions="specializationOptions"
        mode="edit"
        @blur="onBlur"
        @input="onInput"
      />
    </div>

    <!-- ================= FOOTER ================= -->
    <template #footer>
      <div class="d-flex justify-content-end gap-2 w-100">
        <!-- Cancel -->
        <BaseButton
          type="button"
          variant=""
          custom-class="btn-light px-4 bg-secondary-subtle py-2 w-50"
          :disabled="loading"
          @click="handleClose"
        >
          បោះបង់
        </BaseButton>

        <!-- Update -->
        <BaseButton
          type="button"
          variant="bg-primary"
          custom-class="w-50 py-2 bg-primary text-light"
          :is-loading="loading"
          loading-text="Updating..."
          :disabled="loadingUser"
          @click="handleUpdate"
        >
          រក្សាទុក
        </BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, watch } from "vue";

import BaseModal from "@/components/ui/base/BaseModal.vue";
import BaseButton from "@/components/ui/base/BaseButton.vue";
import UserForm from "@/components/form/UserForm.vue";

import { useUserForm } from "@/composable/user/useUserForm";
import userService from "@/services/user.service";
import { useAppToast } from "@/composable/useAppToast";

import {specializationOptions,roleOptions,genderOptions} from "@/constants/options";
const toast = useAppToast();

const props = defineProps({
  show: { type: Boolean, default: false},
  userId: {
    type: [Number, String],
    default: null,
  },
});


const emit = defineEmits(["close","updated"]);
const loadingUser = ref(false);
const {form, errors, loading, validateForm,onInput,onBlur,resetForm, populateForm, applyBackendErrors,} = useUserForm("edit");


const getUser = async () => {
  if (!props.userId) {
    console.warn("User ID is missing.");
    return;
  }
  try {
    loadingUser.value = true;
    const response = await userService.getById(props.userId);
    if (response.data?.success) { 
      populateForm(response.data.data);
    }
  } catch (error) {
    console.error("Get user error:",error);
  } finally {
    loadingUser.value = false;
  }
};

watch(
  [() => props.show, () => props.userId],
  ([show, userId]) => {
    if (show && userId) {
      getUser();
    }
  },
  {
    immediate: true,
  }
);


const handleUpdate = async () => {
  // Validate form
  if (!validateForm()) {
    return;
  }
  if (!props.userId) {
    console.error("User ID is missing.");
    return;
  }
  try {
    loading.value = true;

    const payload = {
      name: form.name,
      gender: form.gender,
      role: form.role,
    };
    // Only send teachingSubject
    // when role is TEACHER
    if (form.role === "TEACHER") {
      payload.teachingSubject =
        form.teachingSubject;
    }

    const response = await userService.update( props.userId,payload );
    if (response.data?.success) {
      emit("updated");
      resetForm();
      emit("close");
      toast.success('កែប្រែព័តមានរបស់អ្នកប្រើប្រាស់បានជោគជ័យ')
    }
  } catch (error) {
    // Backend validation errors
    const backendErrors = error.response?.data?.details;
    if (backendErrors && typeof backendErrors === "object") {
      applyBackendErrors(backendErrors);
    }
  } finally {
    loading.value = false;
  }
};

const handleClose = () => {
  if (loading.value) {
    return;
  }
  resetForm();
  emit("close");
};
</script>
