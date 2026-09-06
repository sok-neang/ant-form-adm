<template>
  <div class="profile-container py-4">
    <template v-if="profileData">
      <div class="container-fluid px-md-4">
      <div class="row g-4">
        <div class="col-12 col-xl-4 col-lg-5">
          <div class="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden text-center profile-card">
            <div class="profile-cover">
                <img :src="profileBanner" class="object-fit-cover bg-primary" alt="Profile Banner">
            </div>
            <div class="card-body pt-0 pb-4 px-4">
              <div class="position-relative d-inline-block profile-avatar-container">
                <div class="avatar-wrapper rounded-circle p-1 bg-white shadow-sm">
                  <div class="position-relative w-100 h-100 rounded-circle overflow-hidden">
                    <img
                      :src="profileData.avatarPath"
                      alt="Profile Avatar"
                      class="profile-avatar object-fit-cover w-100"
                    />                    
                    <div class="avatar-overlay"></div>
                  </div>
                </div>
                <div class="avatar-actions position-absolute d-flex flex-column gap-2">
                  <button @click="showDeleteAvatarModal = true" class="btn btn-light btn-sm rounded-circle shadow-sm border avatar-action-btn delete-avatar-btn text-danger">
                    <i class="bi bi-trash"></i>
                  </button>
                  <input type="file" ref="fileInputRef" class="d-none" accept="image/*" @change="onFileSelected" />
                  <button @click="triggerFileInput" class="btn btn-light btn-sm rounded-circle shadow-sm border avatar-action-btn edit-avatar-btn text-teal">
                    <i class="bi bi-camera"></i>
                  </button>
                </div>
              </div>
              <h5 class="fw-700 mb-1 mt-3">{{ profileData.name || '-' }}</h5>
              <div class="role-badge rounded-pill px-3 py-1 fw-700 d-inline-flex align-items-center gap-2" style="font-size: 10px;">
                <span class="badge-dot"></span> {{ profileData.role || '-' }}
              </div>
            </div>
          </div>

          <div class="card border-0 shadow-sm rounded-4">
            <div class="card-body p-4">
              <ul class="list-unstyled mb-0 d-flex flex-column gap-3 info-list">
                <li class="d-flex align-items-center gap-3">
                  <div class="icon-box rounded-3 d-flex align-items-center justify-content-center flex-shrink-0">
                    <i class="bi bi-envelope fs-6"></i>
                  </div>
                  <span class="text-secondary fw-500">{{ profileData.email || '-' }}</span>
                </li>
                <li class="d-flex align-items-center gap-3">
                  <div class="icon-box rounded-3 d-flex align-items-center justify-content-center flex-shrink-0">
                    <i class="bi bi-telephone fs-6"></i>
                  </div>
                  <span class="text-secondary fw-500">{{ profileData.phone || '-' }}</span>
                </li>
                <li class="d-flex align-items-center gap-3">
                  <div class="icon-box rounded-3 d-flex align-items-center justify-content-center flex-shrink-0">
                    <i class="bi bi-calendar3 fs-6"></i>
                  </div>
                  <span class="text-secondary fw-500">បង្កើតថ្ងៃទី {{ normalDate(profileData.createdAt) }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

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
                <div class="d-flex gap-3">
                  <BaseButton 
                    @click="toggleEdit"
                    :variant="isEditing ? 'bg-primary' : 'outline-primary'" 
                    :is-loading="authStore.isUpdateProfileLoading"
                    :customClass="isEditing ? 'rounded-3 px-4 py-2 fw-500 border text-white' : 'btn-edit-profile rounded-3 px-4 py-2 fw-500 border bg-white text-primary'" 
                    iconPosition="left">
                    <template v-if="!authStore.isUpdateProfileLoading" #icon>
                      <i class="bi" :class="isEditing ? 'bi-pencil-square' : 'bi-pencil-square'"></i>
                    </template>
                    {{ isEditing ? 'រក្សាទុក' : 'កែប្រែ' }}
                  </BaseButton>

                  <BaseButton 
                    v-if="isEditing"
                    @click="cancelEdit"
                    :variant="'outline-secondary'" 
                    :customClass="'rounded-3 px-4 py-2 fw-500 border bg-white text-secondary'" 
                    iconPosition="left">
                    <template #icon>
                      <i class="bi bi-x-lg"></i>
                    </template>
                    បោះបង់
                  </BaseButton>
                </div>
              </div>

              <!-- Form -->
              <div class="row g-4 mb-2">
                <div class="col-md-6">
                  <BaseInput
                    :modelValue="profileData.name || (!isEditing ? '-' : '')"
                    @update:modelValue="val => profileData.name = val"
                    label="ឈ្មោះពេញ"
                    :readonly="!isEditing"
                    :inputClass="getInputClass"
                  />
                </div>
                <div class="col-md-6">
                  <BaseInput v-if="!isEditing"
                    :modelValue="profileData.gender || '-'"
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
                    :modelValue="profileData.email || '-'"
                    label="អ៊ីមែល"
                    readonly
                    :inputClass="readOnlyClass"
                  />
                </div>
                <div class="col-md-6">
                  <BaseInput
                    :modelValue="profileData.phone || (!isEditing ? '-' : '')"
                    @update:modelValue="val => profileData.phone = val"
                    label="លេខទូរស័ព្ទ"
                    :readonly="!isEditing"
                    :inputClass="getInputClass"
                  />
                </div>
                <div class="col-md-6">
                  <div v-if="isEditing">
                    <label class="form-label">
                      ថ្ងៃ ខែ ឆ្នាំកំណើត
                    </label>
                    <el-date-picker 
                      v-model="profileData.dateOfBirth" 
                      type="date" 
                      format="DD MMM YYYY" 
                      value-format="YYYY-MM-DD"
                      :placeholder="''" 
                      :disabled="!isEditing" 
                      :clearable="true"
                      class="w-100 dob-picker" 
                      popper-class="dob-popper" 
                      :disabled-date="disableFutureDates" 
                    />
                  </div>
                  <div v-else>
                    <label class="form-label">
                      ថ្ងៃ ខែ ឆ្នាំកំណើត
                    </label>
                    <BaseInput
                      :modelValue="normalDate(profileData.dateOfBirth)"
                      :enable-time-picker="false"
                      :input-class-name="getInputClass"
                    />
                  </div>
                </div>
                <div class="col-md-6 d-flex flex-column justify-content-end mt-4 mt-md-0">
                  <label class="form-label d-none d-md-block mb-2">&nbsp;</label>
                  <BaseButton variant="danger" :is-loading="authStore.isLogoutLoading" @click="onLogout" customClass="w-100 rounded-3 py-2 fw-500 justify-content-between px-4 text-white" iconPosition="right">
                    <template v-if="!authStore.isLogoutLoading" #icon>
                      <i class="bi bi-arrow-right-circle fs-5"></i>
                    </template>
                    Logout
                  </BaseButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Avatar Edit Modal -->
    <AvatarCropperModal
      v-model:show="showAvatarModal"
      :isLoading="authStore.isUploadAvatarLoading"
      :src="selectedImageSrc"
      @save="onSaveAvatar"
    />

    <!-- Confirm Delete Avatar Modal -->
    <BaseModal  v-model:show="showDeleteAvatarModal" :hideCloseBtn="true">
      <template #header>
        <h5 class="mb-3">លុប រូបភាព?</h5>
      </template>
      <div class="text-center text-dark">
        <i class="bi bi-trash fs-1 text-danger mb-3"></i>
        <p>តើអ្នកពិតជាចង់លុប រូបភាពនេះមែនទេ?</p>
      </div>
      <template #footer>
        <div class="d-flex w-100 gap-3 justify-content-end">
          <BaseButton @click="showDeleteAvatarModal = false" customClass="px-4 py-2 rounded-pill fw-500 border-0 bg-light text-secondary">បោះបង់</BaseButton>
          <BaseButton @click="onDeleteAvatar" :is-loading="authStore.isDeleteAvatarLoading" variant="danger" customClass="px-4 py-2 rounded-pill fw-500 text-white">លុប</BaseButton>
        </div>
      </template>
    </BaseModal>
    </template>

    <!-- Skeleton Loading State -->
    <template v-else>
      <div class="container-fluid px-md-4">
        <div class="row g-4">
          <div class="col-12 col-xl-4 col-lg-5">
            
            <div class="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden text-center profile-card">
              <div class="profile-cover">
                <BaseSkeleton width="100%" height="120px" radius="0" />
              </div>
              <div class="card-body pt-0 pb-4 px-4">
                <div class="position-relative d-inline-block profile-avatar-container">
                  <div class="avatar-wrapper rounded-circle p-1 shadow-sm" style="margin-top: -20px; position: relative; z-index: 1;">
                    <BaseSkeleton width="120px" height="120px" circle />
                  </div>
                </div>
                <div class="d-flex flex-column align-items-center mt-3 gap-2">
                  <BaseSkeleton width="50%" height="24px" radius="6px" class="mb-1" />
                  <BaseSkeleton width="35%" height="28px" radius="50rem" />
                </div>
              </div>
            </div>

            <div class="card border-0 shadow-sm rounded-4">
              <div class="card-body p-4">
                <ul class="list-unstyled mb-0 d-flex flex-column gap-3">
                  <li v-for="i in 3" :key="i" class="d-flex align-items-center gap-3">
                    <BaseSkeleton width="40px" height="40px" radius="8px" class="flex-shrink-0" />
                    <BaseSkeleton width="70%" height="20px" radius="6px" />
                  </li>
                </ul>
              </div>
            </div>
            
          </div>

          <div class="col-12 col-xl-8 col-lg-7">
            <div class="card border-0 shadow-sm rounded-4 h-100">
              <div class="card-body p-4 p-md-5">
                
                <div class="d-flex flex-wrap justify-content-between align-items-start mb-5 gap-3">
                  <div class="d-flex align-items-center gap-3 flex-grow-1" style="max-width: 400px;">
                    <BaseSkeleton width="48px" height="48px" radius="8px" class="flex-shrink-0" />
                    <div class="w-100">
                      <BaseSkeleton width="40%" height="24px" radius="6px" class="mb-2" />
                      <BaseSkeleton width="65%" height="16px" radius="6px" />
                    </div>
                  </div>
                  <div class="d-flex gap-3">
                    <BaseSkeleton width="110px" height="40px" radius="8px" />
                  </div>
                </div>

                <div class="row g-4 mb-2">
                  <div class="col-md-6" v-for="i in 5" :key="'input-skel-' + i">
                    <BaseSkeleton width="25%" height="16px" radius="4px" class="mb-2" />
                    <BaseSkeleton width="100%" height="42px" radius="8px" />
                  </div>
                  
                  <div class="col-md-6 d-flex flex-column justify-content-end mt-4 mt-md-0">
                    <label class="form-label d-none d-md-block mb-2">&nbsp;</label>
                    <BaseSkeleton width="100%" height="42px" radius="8px" />
                  </div>
                </div>
              </div>
            </div>
          </div> 
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import BaseButton from '@/components/ui/base/BaseButton.vue'
import BaseInput from '@/components/ui/base/BaseInput.vue'
import BaseSelect from '@/components/ui/base/BaseSelect.vue'
import BaseSkeleton from '@/components/ui/base/BaseSkeleton.vue'
import AvatarCropperModal from '@/components/ui/profile/AvatarCropperModal.vue'
import { genderOptions } from '@/constants/options'
import profileBanner from "@/assets/images/img/profile_banner.png"

import { useAppToast } from "@/composable/useAppToast";
import { useAuthStore } from '@/stores/useAuthStore'
import { normalDate } from '@/utils/dateFormat'
import BaseModal from '@/components/ui/base/BaseModal.vue'

const toast = useAppToast();
const authStore = useAuthStore()

onMounted(async () => {
  await authStore.getProfile();
})
const profileData = computed(() => authStore.user)

const isEditing = ref(false)
const cancelEdit = () => {
  isEditing.value = false
}

const showAvatarModal = ref(false)
const showDeleteAvatarModal = ref(false)
const fileInputRef = ref(null)
const selectedImageSrc = ref('')

//---------> cropper image
const triggerFileInput = () => {
  fileInputRef.value?.click()
}

const onFileSelected = (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  selectedImageSrc.value = URL.createObjectURL(file)
  showAvatarModal.value = true
  event.target.value = ''
}

//----------> handle update avatar
const onSaveAvatar = async (canvas) => {
  try {
    if (!canvas) {
      toast.error("បរាជ័យក្នុងការកាត់រូបភាព")
      return
    }
    canvas.toBlob(
      async (blob) => {
        if (!blob) {
          toast.error("បរាជ័យក្នុងការបង្កើតរូបភាព")
          return
        }
        const file = new File([blob],"avatar.jpg",{type: "image/jpeg"})
        const formData = new FormData()
        formData.append('avatar', file)

        const response = await authStore.uploadAvatar(formData)
        if (response?.success) {
          toast.success("Profile picture updated successfully")
          selectedImageSrc.value = canvas.toDataURL("image/jpeg")
          showAvatarModal.value = false
        } else {
          toast.error(response?.message || "បរាជ័យក្នុងការកែប្រែរូបភាព")
        }

      },
      "image/jpeg",0.9
    )

  } catch (error) {
    toast.error("Failed to update profile picture")
  }
}

//----------> handle delete avatar
const onDeleteAvatar = async () => {
  try {
    const response = await authStore.deleteAvatar()
    if (response?.success) {
      toast.success("Profile picture deleted successfully")
      selectedImageSrc.value = ''
      showDeleteAvatarModal.value = false
    } else {
      toast.error(response?.message || "Failed to delete profile picture")
    }
  } catch (error) {
    toast.error("Failed to delete profile picture")
  }
}

//----------> handle update profile
const toggleEdit = async () => {
  if (isEditing.value) {
    try {
      const payload = {
        name: profileData.value.name,
        phone: profileData.value.phone,
        gender: profileData.value.gender,
        dateOfBirth: profileData.value.dateOfBirth
      };
      const response = await authStore.updateProfile(payload);
      if (response?.success) {
        toast.success("កែប្រែទម្រង់ប្រវត្តិរូបភាពដោយជោគជ័យ");
      }
    } catch (error) {
      toast.error("បរាជ័យក្នុងការកែប្រែប្រវត្តិរូបភាព");
    }
  }
  isEditing.value = !isEditing.value;
}

//----------> handle logout
const onLogout = async () => {
  try {
    const response = await authStore.logout();

    if (response?.success) {
      router.push("/auth/login");
    }
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

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

<style>
/* Unscoped styles are necessary because Element Plus date picker popups are rendered directly in the <body> */
.dob-popper, .dob-picker {
  --el-color-primary: var(--bs-primary) !important;
}

.dob-popper .el-date-table td.current:not(.disabled) .el-date-table-cell__text {
  background-color: var(--el-color-primary) !important;
}

.dob-picker{
  height: 45px !important;
}
</style>