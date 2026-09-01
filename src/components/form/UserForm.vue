<template>
    <form @submit.prevent>
         <div class="col-md-12 my-3">
             <BaseInput
               class="my-2"
               v-model="form.name"
               :error="errors.name"
               label="ឈ្មោះពេញ​ *"
               placeholder="បញ្ចូលឈ្មោះពេញ"
               @blur="$emit('blur', 'name')"
               @input="$emit('input', 'name')">
           <i class="bi bi-person"></i>
           </BaseInput>

         </div>

        <!-- Email -->
          <div class="col-md-12 my-3">
              <BaseInput
                  v-model="form.email"
                  :error="errors.email"
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
                :error="errors.gender"
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
                :error="errors.role"
                option-label="label"
                option-value="value"
                placeholder="ជ្រើសរើសតួនាទី "
                :clearable="false"
                icon="bi bi-person-badge"
              >
            </BaseSelect>
          </div>

        <!-- type subject -->
          <div class="col-md-12 my-3" v-show="form.role == 'TEACHER'">
              <BaseSelect
                v-model="form.teachingSubject"
                label="អាហារូបករណ៍ *"
                :options="typeCourseOptions"
                :error="errors.teachingSubject"
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
const emit = defineEmits(["input", "blur"]);
defineProps({
    form: {
        type: Object,
        default: {},
    },
    errors:{
      type:Object,
      default:{}
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