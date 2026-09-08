<template>
  <div class="card border-0 shadow-sm rounded-4 p-3 h-100">
    <!-- Top Section -->
    <div class="d-flex justify-content-between align-items-start mb-3">
      <!-- Icon & Label (For detailed card) -->
      <div v-if="icon" class="d-flex flex-column gap-2">
        <div class="info-icon" :class="iconBgClass">
          <i :class="icon" :style="{ color: iconColor }"></i>
        </div>
        <span class="text-muted small fw-medium">{{ label }}</span>
      </div>
      <!-- Title (For small card) -->
      <div v-else class="text-muted small fw-medium mt-1">
        {{ title }}
      </div>
      <!-- Number -->
      <h3 class="fw-bold mb-0" :class="valueClass">{{ value }}</h3>
    </div>

    <!-- Divider -->
    <div class="border-bottom mb-3" style="border-style: dashed !important; border-color: #dee2e6;"></div>

    <!-- Bottom Section -->
    <div class="d-flex justify-content-around align-items-center text-muted small w-100">
      <template v-for="(stat, index) in stats" :key="index">
        <div class="d-flex align-items-center gap-1">
          <i v-if="stat.icon" :class="stat.icon" :style="{ color: stat.color }"></i>
          <span>{{ stat.label }} ({{ stat.value }})</span>
        </div>
        <div v-if="index < stats.length - 1" class="vr" style="opacity: 0.2;"></div>
      </template>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  label: String,
  value: { type: [Number, String], required: true },
  valueClass: { type: String, default: 'text-dark' },
  icon: String,
  iconBgClass: { type: String, default: 'bg-primary bg-opacity-10' },
  iconColor: { type: String, default: 'var(--bs-primary)' },
  stats: {
    type: Array,
    default: () => []
  }
})
</script>
