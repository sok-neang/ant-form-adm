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
        <!-- Icon -->
        <div
          class="d-flex align-items-center justify-content-center rounded-3"
          style="
            width: 44px;
            height: 44px;
            background-color: rgba(255, 179, 31, 0.12);
            color: #FFB31F;"
        >
           <i class="bi bi-lock fs-4"></i>
        </div>
        <!-- Title -->
        <div>
          <h5 class="modal-title fw-bold mb-1">
            កំណត់ពាក្យសម្ងាត់ឡើងវិញ
          </h5>
          <p class="text-muted mb-0 small">
            បង្កើតពាក្យសម្ងាត់ថ្មីសម្រាប់គណនីអ្នកប្រើប្រាស់
          </p>
        </div>
      </div>
    </template>
    <!-- ================= BODY ================= -->
    <div>
      <!-- User Information -->
      <div class="bg-light rounded-3 p-3 mb-4">
        <div class="d-flex align-items-center gap-3">
          <!-- Avatar -->
          <div
            class="rounded-circle bg-primary-subtle text-primary
                   d-flex align-items-center justify-content-center"
            style="width: 48px; height: 48px;"
          >
            <i class="bi bi-person-fill fs-4"></i>
          </div>

          <div>
            <h6 class="fw-bold mb-1">
              យឹម ស្រីយ៉ឺ
            </h6>

            <span class="badge bg-primary-subtle text-primary">
              <i class="bi bi-shield-check me-1"></i>
              Admin
            </span>
          </div>

        </div>

      </div>

       <!-- info -->
      <div class="alert alert-success d-flex align-items-start gap-2 mb-0">
        <i class="bi bi-info-circle me-1"></i>
        <div class="small">
          បញ្ចូលអ៊ីមែលរបស់អ្នកប្រើ ដើម្បីបញ្ជាក់ ហើយប្រព័ន្ធនឹងបង្កើតពាក្យសម្ងាត់ថ្មីដោយស្វ័យប្រវត្តិ
        </div>
      </div>
      <!-- Email -->
      <div class="my-3">
           <BaseInput
                class="mb-4"
                label="អុីម៉ែល"
                type="email"
                placeholder="example@gmail.com"
                input-class="py-2"
                >
                <i class="bi bi-envelope"></i>
            </BaseInput>
      </div>
    </div>
    <!-- ================= FOOTER ================= -->
    <template #footer>
      <div class="d-flex justify-content-end gap-2 w-100">
         <BaseButton
          type="submit"
          variant=""
          custom-class="btn-light px-4 bg-secondary-subtle py-2 w-50"
          @click="handleClose"
        >
          បោះបង់
        </BaseButton>
        <BaseButton
          type="submit"
          variant=""
          custom-class="w-50 py-2 text-light fw-bold bg-primary"
          :is-loading="loading"
          loading-text="Signing in..."
         @click="handleChangePassword"
        >
          ប្តូរពាក្យសម្ងាត់
        </BaseButton>
      </div>
    </template>
  </BaseModal>

  <!-- =========================================================
     GENERATED PASSWORD MODAL
========================================================= -->
<BaseModal
  :show="showGeneratedPassword"
  size="md"
  :showClose="true"
  @close="closeGeneratedPassword"
>
  <!-- ================= HEADER ================= -->
  <template #header>
    <div class="d-flex align-items-center gap-3">
    <div
        class="d-flex align-items-center justify-content-center rounded-3 bg-success-subtle"
        style="width: 44px; height: 44px;"
        >
        <i class="bi bi-lock-fill fs-4 text-success"></i>
    </div>
      <div>
        <h5 class="modal-title fw-bold mb-1">
          ពាក្យសម្ងាត់ថ្មី
        </h5>

        <p class="text-muted mb-0 small">
          ពាក្យសម្ងាត់ត្រូវបានបង្កើតដោយជោគជ័យ
        </p>
      </div>

    </div>
  </template>

  <!-- ================= BODY ================= -->
  <div>

    <!-- User Information -->
    <div class="bg-light rounded-3 p-3 mb-4">
      <div class="d-flex align-items-center gap-3">
        <!-- Avatar -->
        <div
          class="rounded-circle bg-primary-subtle text-primary
                 d-flex align-items-center justify-content-center"
          style="width: 48px; height: 48px;"
        >
          <i class="bi bi-person-fill fs-4"></i>
        </div>
        <div>
          <h6 class="fw-bold mb-1">
            យឹម ស្រីយ៉ឺ
          </h6>
          <div class="text-muted small">
            admin@example.com
          </div>
        </div>
      </div>
    </div>
    <div class="mb-4">
  <!-- Label -->
  <label class="form-label  mb-2">
    ពាក្យសម្ងាត់ថ្មី
  </label>
  <!-- Password Block -->
  <div
    class="d-flex align-items-center rounded-3 border bg-light overflow-hidden"
    style="min-height: 50px;"
  >
    <!-- Password -->
    <div class="flex-grow-1 px-3">
      <span class="fw-bold ">
        X8kP#92LmQ
      </span>
    </div>
    <!-- Copy Button -->
    <button
      type="button"
      class="btn border-0 rounded-0 px-3 align-self-stretch"
      title="ចម្លងពាក្យសម្ងាត់"
    >
      <i class="bi bi-copy fs-5"></i>
    </button>
  </div>
</div>
    <!-- Warning -->
   <div
  class="d-flex align-items-start gap-3 rounded-3 p-3 mb-4"
  style="
    background-color: rgba(25, 135, 84, 0.08);
    border: 1px solid rgba(25, 135, 84, 0.18);
  "
>
  <!-- Icon -->
  <div
    class="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
    style="
      width: 36px;
      height: 36px;
      background-color: rgba(25, 135, 84, 0.12);
    "
  >
    <i class="bi bi-check-circle-fill text-success fs-5"></i>
  </div>

  <!-- Content -->
  <div>
    <div class="fw-semibold text-success mb-1">
      ពាក្យសម្ងាត់ត្រូវបានបង្កើតដោយជោគជ័យ
    </div>

    <div class="text-muted small">
      សូមរក្សាទុកពាក្យសម្ងាត់នេះ និងផ្តល់ជូនអ្នកប្រើប្រាស់។
    </div>
    <div class="text-muted small mt-1">
      <i class="bi bi-info-circle me-1"></i>
      ពាក្យសម្ងាត់នេះនឹងបាត់បន្ទាប់ពីបិទផ្ទាំងនេះ។
    </div>
  </div>
</div>
  </div>
  <template #footer>
    <div class="d-flex justify-content-end w-100">
      <BaseButton
        type="button"
        variant=""
        custom-class="px-4 py-2 text-light fw-bold bg-primary text-light w-100"
        @click="closeGeneratedPassword"
      >
        រួចរាល់
      </BaseButton>
    </div>
  </template>
</BaseModal>
</template>
<script setup>
import BaseModal from '@/components/ui/base/BaseModal.vue';
import BaseButton from '@/components/ui/base/BaseButton.vue';
import BaseInput from '@/components/ui/base/BaseInput.vue';
import {ref} from "vue"
const loading = ref(false);
const showGeneratedPassword = ref(false);

const props =
 defineProps({
  show: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits([
  "update:show",
  "close",
  "submit",
]);
const handleClose = () => {
  if (loading.value) return;
//   resetForm();
  emit("close");
  emit("update:show", false);
};
const closeGeneratedPassword = () => {
  showGeneratedPassword.value = false;
};

const generatedPassword = ref({
  email: "",
  password: "",
});

const handleChangePassword = async () => {
  if (loading.value) return;

  try {
    loading.value = true;

    // Call your backend API here
    // const response = await changePassword(...)

    // Example backend response
    const response = {
      data: {
        email: "admin@example.com",
        password: "X8kP#92LmQ",
      },
    };

    // Save generated password
    generatedPassword.value = {
      email: response.data.email,
      password: response.data.password,
    };

    // Close first modal
    emit("close");
    emit("update:show", false);

    // Open second modal
    showGeneratedPassword.value = true;

  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};
</script>