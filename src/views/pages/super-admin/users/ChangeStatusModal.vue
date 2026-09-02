<template>
  <BaseModal
    :show="props.show"
    size="md"
    :showClose="true"
    @close="handleClose"
  >
    <!-- ================= HEADER ================= -->
    <template #header>
      <div class="d-flex align-items-center gap-3">
        <div
          class="d-flex align-items-center justify-content-center rounded-3"
          style="
            width: 44px;
            height: 44px;
            background-color: rgba(13, 110, 253, 0.1);
          "
        >
          <i class="bi bi-person-check-fill fs-4 text-primary"></i>
        </div>

        <div>
          <h5 class="modal-title fw-bold mb-1">
            ផ្លាស់ប្តូរស្ថានភាព
          </h5>

          <p class="text-muted mb-0 small">
            ជ្រើសរើសស្ថានភាពសម្រាប់គណនីអ្នកប្រើប្រាស់
          </p>
        </div>
      </div>
    </template>

    <!-- ================= BODY ================= -->
    <div>

      <!-- User Information -->
      <div class="bg-light rounded-3 p-3 mb-4">
        <div class="d-flex align-items-center gap-3">
          
          <div
            class="rounded-circle bg-primary-subtle text-primary
                   d-flex align-items-center justify-content-center"
            style="width: 48px; height: 48px;"
          >
            <i class="bi bi-person-fill fs-4"></i>
          </div>

          <div>
            <h6 class="fw-bold mb-1">
              {{ props.user.name }}
            </h6>

            <span class="text-muted small">
              {{ props.user.email }}
            </span>
          </div>
        </div>
      </div>

      <!-- Current Status -->
      <div class="mb-3">
        <label class="form-label fw-semibold">
          ស្ថានភាពគណនី
        </label>

        <div class="status-options">

          <!-- ACTIVE -->
          <button
            type="button"
            class="status-option"
            :class="{ active: selectedStatus === 'ACTIVE' }"
            @click="selectedStatus = 'ACTIVE'"
          >
            <div
              class="status-icon bg-success-subtle text-success"
            >
              <i class="bi bi-check-circle-fill"></i>
            </div>

            <div class="text-start flex-grow-1">
              <div class="fw-bold">
                សកម្ម
              </div>

              <small class="text-muted">
                ACTIVE
              </small>
            </div>

            <i
              v-if="selectedStatus === 'ACTIVE'"
              class="bi bi-check-circle-fill text-success fs-5"
            ></i>
          </button>

          <!-- INACTIVE -->
          <button
            type="button"
            class="status-option"
            :class="{ active: selectedStatus === 'INACTIVE' }"
            @click="selectedStatus = 'INACTIVE'"
          >
            <div
              class="status-icon bg-danger-subtle text-danger"
            >
              <i class="bi bi-x-circle-fill"></i>
            </div>

            <div class="text-start flex-grow-1">
              <div class="fw-bold">
                អសកម្ម
              </div>

              <small class="text-muted">
                INACTIVE
              </small>
            </div>

            <i
              v-if="selectedStatus === 'INACTIVE'"
              class="bi bi-check-circle-fill text-danger fs-5"
            ></i>
          </button>

          <!-- SUSPENDED -->
          <button
            type="button"
            class="status-option"
            :class="{ active: selectedStatus === 'SUSPENDED' }"
            @click="selectedStatus = 'SUSPENDED'"
          >
            <div
              class="status-icon bg-warning-subtle text-warning"
            >
              <i class="bi bi-pause-circle-fill"></i>
            </div>

            <div class="text-start flex-grow-1">
              <div class="fw-bold">
                ផ្អាក
              </div>

              <small class="text-muted">
                SUSPENDED
              </small>
            </div>

            <i
              v-if="selectedStatus === 'SUSPENDED'"
              class="bi bi-check-circle-fill text-warning fs-5"
            ></i>
          </button>

        </div>
      </div>
    </div>

    <!-- ================= FOOTER ================= -->
    <template #footer>
      <div class="d-flex justify-content-end gap-2 w-100">

        <BaseButton
          type="button"
          variant=""
          custom-class="btn-light px-4 bg-secondary-subtle py-2 w-50"
          @click="handleClose"
        >
          បោះបង់
        </BaseButton>

        <BaseButton
          type="button"
          variant=""
          custom-class="w-50 py-2 bg-primary text-light fw-bold"
          :is-loading="loading"
          :disabled="!selectedStatus"
          @click="handleSubmit"
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
      status: "",
    }),
  },

  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits([
  "close",
  "change",
]);

const selectedStatus = ref("");

watch(
  () => props.show,
  (show) => {
    if (show) {
      selectedStatus.value = props.user.status || "";
    }
  }
);


const handleClose = () => {
  selectedStatus.value = "";
  emit("close");
};

const handleSubmit = () => {
  if (!selectedStatus.value) {
    return;
  }

  emit("change", {
    id: props.user.id,
    status: selectedStatus.value,
  });
};
</script>


