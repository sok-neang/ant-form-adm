<template>
  <div class="profile-container py-4">
    <div class="container-fluid px-md-4">
      <div class="row g-4">
        <!-- Left Column -->
        <div class="col-12 col-xl-4 col-lg-5">
          <!-- Profile Card -->
          <div class="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden text-center profile-card">
            <div class="profile-cover">
                <img :src="profileBanner" class="object-fit-cover bg-primary" alt="Profile Banner">
            </div>
            <div class="card-body pt-0 pb-4 px-4">
              <div class="position-relative d-inline-block profile-avatar-container">
                <div class="avatar-wrapper rounded-circle p-1 bg-white shadow-sm">
                  <div class="position-relative w-100 h-100 rounded-circle overflow-hidden">
                    <img :src="profileData.avatarPath" alt="Profile Avatar" class="profile-avatar w-100 h-100">
                    <div class="avatar-overlay"></div>
                  </div>
                </div>
                <div class="avatar-actions position-absolute d-flex flex-column gap-2">
                  <button class="btn btn-light btn-sm rounded-circle shadow-sm border avatar-action-btn delete-avatar-btn text-danger">
                    <i class="bi bi-trash"></i>
                  </button>
                  <button @click="showAvatarModal = true" class="btn btn-light btn-sm rounded-circle shadow-sm border avatar-action-btn edit-avatar-btn text-teal">
                    <i class="bi bi-camera"></i>
                  </button>
                </div>
              </div>
              <h5 class="fw-700 mb-1 mt-3">{{ profileData.name }}</h5>
              <div class="role-badge rounded-pill px-3 py-1 fw-700 d-inline-flex align-items-center gap-2" style="font-size: 10px;">
                <span class="badge-dot"></span> {{ profileData.role }}
              </div>
            </div>
          </div>

          <!-- Info Card -->
          <div class="card border-0 shadow-sm rounded-4">
            <div class="card-body p-4">
              <ul class="list-unstyled mb-0 d-flex flex-column gap-3 info-list">
                <li class="d-flex align-items-center gap-3">
                  <div class="icon-box rounded-3 d-flex align-items-center justify-content-center flex-shrink-0">
                    <i class="bi bi-envelope fs-6"></i>
                  </div>
                  <span class="text-secondary fw-500">{{ profileData.email }}</span>
                </li>
                <li class="d-flex align-items-center gap-3">
                  <div class="icon-box rounded-3 d-flex align-items-center justify-content-center flex-shrink-0">
                    <i class="bi bi-telephone fs-6"></i>
                  </div>
                  <span class="text-secondary fw-500">{{ profileData.phone }}</span>
                </li>
                <li class="d-flex align-items-center gap-3">
                  <div class="icon-box rounded-3 d-flex align-items-center justify-content-center flex-shrink-0">
                    <i class="bi bi-calendar3 fs-6"></i>
                  </div>
                  <span class="text-secondary fw-500">{{ profileData.createdAt }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Right Column -->
        <div class="col-12 col-xl-8 col-lg-7">
          <div class="card border-0 shadow-sm rounded-4 h-100">
            <div class="card-body p-4 p-md-5">
              <div class="d-flex flex-wrap justify-content-between align-items-start mb-5 gap-3">
                <div class="d-flex align-items-center gap-3">
                  <div class="header-icon-box bg-primary text-white rounded-3 d-flex align-items-center justify-content-center flex-shrink-0">
                    <i class="bi bi-person fs-4"></i>
                  </div>
                  <div>
                    <h5 class="mb-1 fw-700">ព័ត៌មានផ្ទាល់ខ្លួន</h5>
                    <p class="text-secondary mb-0" style="font-size: 0.9rem;">ព័ត៌មានលម្អិតអំពីទំនាក់ទំនងរបស់អ្នក</p>
                  </div>
                </div>
                <BaseButton 
                  @click="toggleEdit"
                  :variant="isEditing ? 'bg-primary' : 'outline-primary'" 
                  :customClass="isEditing ? 'rounded-3 px-4 py-2 fw-500 border text-white' : 'btn-edit-profile rounded-3 px-4 py-2 fw-500 border bg-white text-primary'" 
                  iconPosition="left">
                  <template #icon>
                    <i class="bi" :class="isEditing ? 'bi-pencil-square' : 'bi-pencil-square'"></i>
                  </template>
                  {{ isEditing ? 'រក្សាទុក' : 'កែប្រែ' }}
                </BaseButton>
              </div>

              <!-- Form -->
              <div class="row g-4 mb-2">
                <div class="col-md-6">
                  <BaseInput
                    v-model="profileData.name"
                    label="ឈ្មោះពេញ"
                    :readonly="!isEditing"
                    :inputClass="getInputClass"
                  />
                </div>
                <div class="col-md-6">
                  <BaseInput v-if="!isEditing"
                    v-model="profileData.gender"
                    label="ភេទ"
                    readonly
                    :inputClass="readOnlyClass"
                  />
                  <BaseSelect v-else
                    v-model="profileData.gender"
                    label="ភេទ"
                    :options="genderOptions"
                    optionLabel="label"
                    optionValue="value"
                    :searchable="false"
                  />
                </div>
                <div class="col-md-6">
                  <BaseInput
                    v-model="profileData.email"
                    label="អ៊ីមែល"
                    readonly
                    :inputClass="readOnlyClass"
                  />
                </div>
                <div class="col-md-6">
                  <BaseInput
                    v-model="profileData.phone"
                    label="លេខទូរស័ព្ទ"
                    :readonly="!isEditing"
                    :inputClass="getInputClass"
                  />
                </div>
                <div class="col-md-6">
                  <BaseInput
                    v-model="profileData.dateOfBirth"
                    label="ថ្ងៃ ខែ ឆ្នាំកំណើត"
                    :type="isEditing ? 'date' : 'text'"
                    :readonly="!isEditing"
                    :inputClass="getInputClass"
                  />
                </div>
                <div class="col-md-6 d-flex flex-column justify-content-end mt-4 mt-md-0">
                  <label class="form-label d-none d-md-block mb-2">&nbsp;</label>
                  <BaseButton variant="danger" customClass="w-100 rounded-3 py-2 fw-500 justify-content-between px-4 text-white" iconPosition="right">
                    Logout
                    <template #icon>
                      <i class="bi bi-arrow-right-circle fs-5"></i>
                    </template>
                  </BaseButton>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Avatar Edit Modal -->
    <BaseModal v-model:show="showAvatarModal" size="md">
      <template #header>
        <div class="w-100 position-relative">
          <h5 class="modal-title m-0 fw-bold">កែប្រែរូបភាព</h5>
        </div>
      </template>
      
      <div class="d-flex flex-column align-items-center py-2">
        <!-- Cropper Area -->
        <div class="bg-primary d-flex align-items-center justify-content-center rounded-3 mb-4 w-100 overflow-hidden" style="height: 350px;">
          <Cropper
            ref="cropperRef"
            class="w-100 h-100"
            :src="profileData.avatar"
            :stencil-props="{ aspectRatio: 1 }"
            image-restriction="stencil"
            :canvas="false"
          />
        </div>

        <!-- Slider Area -->
        <div class="d-flex align-items-center w-100 px-4 gap-3 mb-2">
          <i class="bi bi-image text-secondary" style="font-size: 1rem;"></i>
          <input type="range" class="form-range custom-range flex-grow-1" min="10" max="100" v-model="imageScale" @input="onSliderInput">
          <i class="bi bi-image text-secondary" style="font-size: 1.5rem;"></i>
        </div>
      </div>
      
      <template #footer>
        <div class="d-flex w-100 gap-3">
          <BaseButton variant="outline-primary" customClass="flex-grow-1 py-2 rounded-3 fw-500" @click="showAvatarModal = false">បិទ</BaseButton>
          <BaseButton variant="bg-primary" customClass="flex-grow-1 py-2 rounded-3 fw-500 text-white">រក្សាទុក</BaseButton>
        </div>
      </template>
    </BaseModal>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import BaseButton from '@/components/ui/base/BaseButton.vue'
import BaseInput from '@/components/ui/base/BaseInput.vue'
import BaseSelect from '@/components/ui/base/BaseSelect.vue'
import BaseModal from '@/components/ui/base/BaseModal.vue'
import { genderOptions } from '@/constants/options'
import profileBanner from "@/assets/images/img/profile_banner.png"
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'


const profileData = ref({
    "id": 3,
    "name": "ឡាយ​ សុខនាង",
    "email": "laysokneang@gmail.com",
    "role": "SUPER_ADMIN",
    "status": "ACTIVE",
    "teachingSubject": null,
    "gender": "ស្រី",
    "dateOfBirth": "2026-09-02",
    "phone": "011123456",
    "avatarPath": "https://i.pinimg.com/736x/42/44/32/424432f5cf247f4fb03ad1a6da1f0415.jpg",
    "mustChangePass": false,
    "mfaEnabled": true,
    "createdAt": "2026-09-02",
    "updatedAt": "2026-09-02"
})

const isEditing = ref(false)
const showAvatarModal = ref(false)
const cropperRef = ref(null)
const imageScale = ref(50)
let lastScale = 50

const onSliderInput = (e) => {
  if (cropperRef.value) {
    const val = Number(e.target.value)
    const factor = val / lastScale
    cropperRef.value.zoom(factor)
    lastScale = val
  }
}

const toggleEdit = () => {
  if (isEditing.value) {
  } else {
    if (profileData.value.dateOfBirth.includes('/')) {
        const parts = profileData.value.dateOfBirth.split('/');
        if (parts.length === 3) {
             profileData.value.dateOfBirth = `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
    }
  }
  isEditing.value = !isEditing.value;
}

const readOnlyClass = 'bg-light fw-500 text-secondary border px-3 rounded-3 custom-readonly-input'
const editableClass = 'fw-500 border px-3 rounded-3 custom-readonly-input'

const getInputClass = computed(() => {
  return isEditing.value ? editableClass : readOnlyClass;
})

</script>

<style scoped>
.profile-container {
  background-color: #f7f9fc; 
}

.card {
  background-color: #ffffff;
}
.shadow-sm {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.04) !important;
}

.profile-cover {
  height: 120px;
  border-top-left-radius: inherit;
  border-top-right-radius: inherit;
  position: relative;
  overflow: hidden;
}

.profile-cover img{
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-avatar-container {
  margin-top: -55px; 
  z-index: 1;
}

.avatar-wrapper {
  width: 110px;
  height: 110px;
  display: inline-block;
}

.profile-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border: 2px solid transparent;
}

.avatar-actions {
  bottom: 5px;
  right: 0;
  z-index: 10;
}

.avatar-action-btn {
  width: 32px;
  height: 32px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  font-size: 0.9rem;
  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.delete-avatar-btn {
  opacity: 0;
  transform: translateY(15px) scale(0.8);
  pointer-events: none;
}

.profile-avatar-container:hover .delete-avatar-btn {
  opacity: 1;
  transform: translateY(0) scale(1);
  pointer-events: auto;
}

.avatar-overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
  pointer-events: none;
}

.profile-avatar-container:hover .avatar-overlay {
  opacity: 1;
}

.role-badge {
  background-color: var(--bs-color-hover);
  color: var(--bs-primary);
}

.badge-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  background-color: var(--bs-primary);
  border-radius: 50%;
}

.icon-box {
  width: 30px;
  height: 30px;
  background-color: var(--bs-color-hover);
  color: var(--bs-primary);
}

.header-icon-box {
  width: 44px;
  height: 44px;
}

:deep(.custom-readonly-input) {
  padding-left: 1rem !important;
  border-radius: 0.5rem !important;
}

.custom-range::-webkit-slider-thumb {
  background: var(--bs-primary) !important;
}
.custom-range::-moz-range-thumb {
  background: var(--bs-primary) !important;
}

:deep(.modal-header .btn-close) {
  color: var(--bs-primary);
  opacity: 0.8;
}
</style>