<template>
  <BaseModal
    :show="show"
    @update:show="$emit('update:show', $event)"
    size="md"
  >
    <template #header>
      <h5 class="modal-title m-0 fw-bold">
        កែសម្រួលរូបថត
      </h5>
    </template>

    <div class="d-flex flex-column align-items-center py-2">
      <div
        class="cropper-container position-relative w-100 overflow-hidden rounded-3 mb-4"
      >
        <Cropper
          ref="cropperRef"
          :src="src"
          :stencil-component="CircleStencil"
          :stencil-props="{
            aspectRatio: 1
          }"
          image-restriction="stencil"
          class="cropper"
        />

        <div
          class="crop-controls position-absolute bottom-0 start-50 translate-middle-x mb-3 bg-white rounded-pill shadow-sm d-flex align-items-center px-4 py-2 gap-4"
        >
          <button
            type="button"
            class="btn btn-link p-0 text-secondary"
            @click="zoomIn"
          >
            <i class="bi bi-zoom-in fs-5"></i>
          </button>

          <button
            type="button"
            class="btn btn-link p-0 text-secondary"
            @click="zoomOut"
          >
            <i class="bi bi-zoom-out fs-5"></i>
          </button>

          <div
            class="vr"
            style="height: 20px;"
          ></div>

          <button
            type="button"
            class="btn btn-link p-0 text-secondary"
            @click="rotateLeft"
          >
            <i class="bi bi-arrow-counterclockwise fs-5"></i>
          </button>

          <button
            type="button"
            class="btn btn-link p-0 text-secondary"
            @click="rotateRight"
          >
            <i class="bi bi-arrow-clockwise fs-5"></i>
          </button>
        </div>
      </div>

      <div
        class="d-flex align-items-center text-secondary w-100 px-2"
        style="font-size: 0.9rem;"
      >
        <i class="bi bi-info-circle me-2"></i>

        អូសរូបភាពដើម្បីកំណត់ទីតាំង
        និងប្រើប៊ូតុងដើម្បីពង្រីក ឬបង្វិល។
      </div>

    </div>

    <template #footer>
      <div class="d-flex w-100 gap-3 justify-content-end">

        <BaseButton
          customClass="px-4 py-2 rounded-pill fw-500 border-0 bg-light text-secondary"
          @click="closeModal"
        >
          បោះបង់
        </BaseButton>

        <BaseButton
          variant="bg-primary"
          :is-loading="isLoading"
          customClass="px-4 py-2 rounded-pill fw-500 text-white"
          iconPosition="left"
          @click="handleSave"
        >
          <template #icon>
            <i class="bi bi-check-lg"></i>
          </template>

          រក្សាទុករូបថត
        </BaseButton>

      </div>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref } from "vue";

import BaseModal from "@/components/ui/base/BaseModal.vue";
import BaseButton from "@/components/ui/base/BaseButton.vue";

import {
  Cropper,
  CircleStencil
} from "vue-advanced-cropper";

import "vue-advanced-cropper/dist/style.css";


const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },

  src: {
    type: String,
    required: true
  },

  isLoading: {
    type: Boolean,
    default: false
  }

});


const emit = defineEmits([
  "update:show",
  "save"
]);


const cropperRef = ref(null);

const zoomIn = () => {
  if (!cropperRef.value) return;

  cropperRef.value.zoom(1.1);
};


const zoomOut = () => {
  if (!cropperRef.value) return;

  cropperRef.value.zoom(0.9);
};

const rotateLeft = () => {
  if (!cropperRef.value) return;

  cropperRef.value.rotate(-90);
};

const rotateRight = () => {
  if (!cropperRef.value) return;

  cropperRef.value.rotate(90);
};

const closeModal = () => {
  emit("update:show", false);
};

const handleSave = () => {
  if (!cropperRef.value) {
    console.error("Cropper is not ready");
    return;
  }
  const result = cropperRef.value.getResult();

  if (!result?.canvas) {
    console.error("Cannot get cropped canvas");
    return;
  }
  emit("save", result.canvas);
  emit("update:show", false);
};
</script>


<style scoped>

.cropper-container {
  height: 350px;
  background-color: #b0b4b8;
}

.cropper {
  width: 100%;
  height: 100%;
}

.crop-controls {
  z-index: 10;
}

</style>