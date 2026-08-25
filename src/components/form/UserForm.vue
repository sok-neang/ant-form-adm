<template>
    <form @submit.prevent="handleSubmit">
        <!-- Khmer Name -->
         <div class="col-md-12 my-3">
             <BaseInput
               class="my-2"
               v-model="form.khmer_name"
               label="ឈ្មោះពេញ​(ខ្មែរ) *"
               placeholder="យឹម ស្រីយ៉ឺ"
           >
           <i class="bi bi-person"></i>
           </BaseInput>

         </div>


        <!-- English Name -->
          <!-- <BaseInput
            v-model="form.name"
            label="ឈ្មោះជាភាសាអង់គ្លេស"
            placeholder="បញ្ចូលឈ្មោះជាភាសាអង់គ្លេស"
          /> -->

        <!-- Email -->
          <div class="col-md-12 my-3">
              <BaseInput
                  v-model="form.email"
                  type="email"
                  label="អ៊ីមែល *"
                  placeholder="example@gmail.com"
                >
            <i class="bi bi-envelope"></i>
              </BaseInput>
          </div>


        <!-- Gender -->
          <div class="col-md-12 my-3">
              <BaseSelect
                v-model="form.gender"
                label="ភេទ *"
                :options="genderOptions"
                option-label="label"
                option-value="value"
                placeholder="ជ្រើសរើសភេទ"
                :clearable="false"
                icon="bi bi-gender-ambiguous"
              >
            </BaseSelect>

          </div>


        <!-- Role -->
          <div class="col-md-12 my-3">
              <BaseSelect
                v-model="form.role"
                label="តួនាទី *"
                :options="roleOptions"
                option-label="label"
                option-value="value"
                placeholder="ជ្រើសរើសតួនាទី "
                :clearable="false"
                icon="bi bi-person-badge"
              >
            </BaseSelect>
          </div>

        <!-- type subject -->
          <div class="col-md-12 my-3" v-if="form.role == 'Teacher'">
              <BaseSelect
                v-model="form.type_course"
                label="អាហារូបករណ៍ *"
                :options="typeCourseOptions"
                option-label="label"
                option-value="value"
                placeholder="ជ្រើសរើសអាហារូបករណ៍ "
                :clearable="false"
                icon="bi bi-person-badge"
              >
            </BaseSelect>
          </div>

    </form>
</template>
<script setup>
import BaseInput from '../ui/base/BaseInput.vue';
import BaseSelect from '../ui/base/BaseSelect.vue';

defineProps({
    form: {
        type: Object,
        default: {},
    },
    genderOptions:{
        type:Array,
        default:[]
    },
    roleOptions:{
        type:Array,
        default:[]
    },
    typeCourseOptions:{
        type:Array,
        default:[]
    }


});
</script>