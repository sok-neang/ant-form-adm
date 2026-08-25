<template>
  <div>
    <BaseButton :to="to" class="btn-secondary">
      <template #icon>
        <i class="bi bi-arrow-left"></i>
      </template>
      ត្រឡប់ក្រោយ
    </BaseButton>
  </div>
</template>

<script setup>
  defineProps({
    to: { type: String, required: true },
  });
</script>

<style scoped>
  .bi::before {
    font-weight: 600 !important;
  }
</style>
