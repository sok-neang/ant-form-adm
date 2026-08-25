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
          class="d-flex align-items-center justify-content-center
                bg-primary-subtle text-primary rounded-3"
          style="width: 42px; height: 42px;"
        >
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
     <UserForm 
     :form="form"  
     :genderOptions="genderOptions"
      :roleOptions="roleOptions"
      :typeCourseOptions="typeCourseOptions" />
    
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
          variant="bg-primary"
          custom-class="w-50 py-2 bg-primary text-light"
          :is-loading="loading"
          loading-text="Signing in..."
        >
          បង្កើតគណនី
        </BaseButton>


      </div>
    </template>
  </BaseModal>
</template>

<script setup>
import { reactive, ref, watch } from "vue";
import BaseModal from "@/components/ui/base/BaseModal.vue";
import UserForm from "@/components/form/UserForm.vue";
import BaseButton from "@/components/ui/base/BaseButton.vue";
const props = defineProps({
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

const loading = ref(false);

const form = reactive({
  khmer_name: "",
  name: "",
  email: "",
  gender: null,
  role: null,
  type_course: null,
});

const errors = reactive({
  khmer_name: "",
  name: "",
  email: "",
  gender: "",
  role: "",
});

const genderOptions = [
  {
    value: "MALE",
    label: "ប្រុស",
  },
  {
    value: "FEMALE",
    label: "ស្រី",
  },
];

const roleOptions = [
  {
    value: "ADMIN",
    label: "Admin",
  },
  {
    value: "Teacher",
    label: "Teacher",
  },
];
const typeCourseOptions = [
  {
    value: "Moble App",
    label: "Moble App",
  },
  {
    value: "Web Development",
    label: "Web Development",
  },
];

const resetForm = () => {
  form.khmer_name = "";
  form.name = "";
  form.email = "";
  form.gender = null;
  form.role = null;

  Object.keys(errors).forEach((key) => {
    errors[key] = "";
  });
};

const validate = () => {
  let valid = true;

  Object.keys(errors).forEach((key) => {
    errors[key] = "";
  });

  if (!form.khmer_name.trim()) {
    errors.khmer_name = "សូមបញ្ចូលឈ្មោះជាភាសាខ្មែរ";
    valid = false;
  }

  if (!form.name.trim()) {
    errors.name = "សូមបញ្ចូលឈ្មោះជាភាសាអង់គ្លេស";
    valid = false;
  }

  if (!form.email.trim()) {
    errors.email = "សូមបញ្ចូលអ៊ីមែល";
    valid = false;
  }

  if (!form.gender) {
    errors.gender = "សូមជ្រើសរើសភេទ";
    valid = false;
  }

  if (!form.role) {
    errors.role = "សូមជ្រើសរើសតួនាទី";
    valid = false;
  }

  return valid;
};

const handleSubmit = async () => {
  if (!validate()) return;

  loading.value = true;

  try {
    emit("submit", {
      ...form,
    });
  } finally {
    loading.value = false;
  }
};

const handleClose = () => {
  if (loading.value) return;
  resetForm();
  emit("close");
  emit("update:show", false);
};

watch(
  () => props.show,
  (value) => {
    if (value) {
      resetForm();
    }
  }
);
</script>