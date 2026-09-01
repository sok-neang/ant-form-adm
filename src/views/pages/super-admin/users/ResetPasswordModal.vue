<!-- {{props.show}} -->
<template>
  <BaseModal
    :show="props.show"
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

          <!-- User Info -->
          <div>
            <h6 class="fw-bold mb-1">
              {{ props.user.name }}
            </h6>

            <div class="text-muted small">
              {{ props.user.email }}
            </div>
          </div>

        </div>
      </div>

      <!-- Generated Password -->
      <div class="mb-4">

        <label class="form-label mb-2">
          ពាក្យសម្ងាត់ថ្មី
        </label>

        <div
          class="d-flex align-items-center rounded-3 border
                 bg-light overflow-hidden"
          style="min-height: 50px;"
        >

          <!-- Password -->
          <div class="flex-grow-1 px-3">
            <span class="fw-bold">
              {{ props.user.password }}
            </span>
          </div>

          <!-- Copy Button -->
          <button
            type="button"
            class="btn border-0 rounded-0 px-3 align-self-stretch"
            title="ចម្លងពាក្យសម្ងាត់"
            @click="copyPassword"
          >
            <i
              v-if="!copied"
              class="bi bi-copy fs-5"
            ></i>

            <i
              v-else
              class="bi bi-check-lg fs-5 text-success"
            ></i>
          </button>

        </div>

        <!-- Copy message -->
        <small
          v-if="copied"
          class="text-success mt-1 d-block"
        >
          បានចម្លងពាក្យសម្ងាត់
        </small>

      </div>

      <!-- Success Information -->
      <div
        class="d-flex align-items-start gap-3 rounded-3 p-3 mb-4"
        style="
          background-color: rgba(25, 135, 84, 0.08);
          border: 1px solid rgba(25, 135, 84, 0.18);
        "
      >

        <!-- Icon -->
        <div
          class="d-flex align-items-center justify-content-center
                 rounded-circle flex-shrink-0"
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

    <!-- ================= FOOTER ================= -->
    <template #footer>
      <div class="d-flex justify-content-end w-100">
        <BaseButton
          type="button"
          variant=""
          custom-class="px-4 py-2 text-light fw-bold bg-primary w-100"
          @click="closeGeneratedPassword"
        >
          រួចរាល់
        </BaseButton>
      </div>
    </template>

  </BaseModal>
</template>

<script setup>
import { ref } from "vue";

import BaseModal from "@/components/ui/base/BaseModal.vue";
import BaseButton from "@/components/ui/base/BaseButton.vue";

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  user: {
    type: Object,
    default: () => ({
      id: null,
      name: "",
      email: "",
      password: "",
    }),
  },
});

const emit = defineEmits(["close"]);
const copied = ref(false);
const closeGeneratedPassword = () => {
  copied.value = false;
  emit("close");
};

const copyPassword = async () => {
  if (!props.user.password) return;
  try {
    await navigator.clipboard.writeText(props.user.password);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);

  } catch (error) {
    console.error("Copy password error:", error);
  }
};
</script>

