<template>
  <div class="container-fluid">
  <div
    class="top-card rounded-4 overflow-hidden position-relative mb-4"
  >
    <div class="row align-items-center g-0">
      <!-- Text -->
      <div class="col-lg-7">
        <div class="p-4 p-lg-5">
          <h1 class="text-white fw-bold mb-3">
            សូមរីករាយជាមួយថ្ងៃនេះរបស់អ្នក
          </h1>
          <p class="text-white opacity-75 fs-5 mb-0">
            សូមស្វាគមន៍មកកាន់ប្រព័ន្ធគ្រប់គ្រងសិស្សអាហារូបករណ៍
          </p>
        </div>
      </div>
      <!-- Illustration -->
      <div class="col-lg-5 text-center">
        <img
          src="/src/assets/images/img/handcoding-cuate.png"
          alt="Welcome"
          class="welcome-image"
        />
      </div>
    </div>
  </div>
  <!-- Information Cards -->
  <div class="row g-3 mb-4">
    <BaseCard v-for="card in dashboardCards" :key="card.en_title">
      <div class="d-flex align-items-center justify-content-between mb-3">
        <div class="info-icon" :class="`bg-${card.color}-subtle text-${card.color}`">
          <i :class="card.icon"></i>
        </div>
        <!-- Value -->
        <BaseSkeleton v-if="isStatsLoading" width="70px" height="32px" radius="8px" />
        <h2 v-else class="fw-bold mb-0 text-success">{{ card.value }}</h2>
      </div>
      <!-- Title -->
      <p class="text-muted mb-1 fw-bold">
        {{ card.en_title }}
      </p>
      <p class="text-muted mb-1">
        {{ card.kh_title }}
      </p>
    </BaseCard>
  </div>

  <!-- Graph Information -->
  <div class="row g-3 mb-4">
    <div class="col-lg-6">
      <SpecializationDonutChart
        :total="stats.totalStudents"
        :web-count="stats.specialization.webCount"
        :web-percent="stats.specialization.webPercent"
        :mobile-count="stats.specialization.mobileCount"
        :mobile-percent="stats.specialization.mobilePercent"
        :loading="isStatsLoading"
      />
    </div>
    <div class="col-lg-6">
      <ShiftBarChart
        :web-morning="stats.shift.web.morning"
        :web-afternoon="stats.shift.web.afternoon"
        :mobile-morning="stats.shift.mobile.morning"
        :mobile-afternoon="stats.shift.mobile.afternoon"
        :loading="isStatsLoading"
      />
    </div>
  </div>

</div>
</template>

<script setup>
import { onMounted } from 'vue';
import BaseCard from '@/components/ui/base/BaseCard.vue';
import BaseSkeleton from '@/components/ui/base/BaseSkeleton.vue';
import SpecializationDonutChart from '@/components/ui/charts/SpecializationDonutChart.vue';
import ShiftBarChart from '@/components/ui/charts/ShiftBarChart.vue';
import { useEvaluationStats } from '@/composable/evaluation/useEvaluationStats';

const { stats, dashboardCards, isStatsLoading, getEvaluationStats } = useEvaluationStats();

onMounted(() => {
  getEvaluationStats();
});
</script>