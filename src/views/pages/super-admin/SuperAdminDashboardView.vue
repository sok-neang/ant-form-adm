<template>
  <div class="container-fluid">
    <div class="top-card rounded-4 overflow-hidden position-relative mb-4">
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

    <!-- Loading -->
    <div v-if="isUserStatsLoading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <template v-else-if="summaries">
      <!-- Information Cards -->
      <div class="row g-3 mb-4">
        <BaseCard v-for="card in dynamicCards" :key="card.kh_title">
          <div class="d-flex align-items-center justify-content-between mb-3">
              <div class="info-icon" :class="`bg-${card.color}-subtle text-${card.color}`">
                  <i :class="card.icon"></i>
              </div>
              <!-- Value -->
              <h2 class="fw-bold mb-0 text-dark fw-bold">{{ card.value }}</h2>
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
      <div class="row mb-4">
        <!-- Gender Donut Chart -->
        <div class="col-md-6 mb-4 mb-md-0">
          <div class="card border-0 rounded-4 shadow-sm h-100">
            <div class="card-body p-4 text-center d-flex flex-column align-items-center justify-content-center">
              <h6 class="fw-bold mb-4 w-100 text-start text-muted">អ្នកប្រើប្រាស់តាមភេទ</h6>
              <apexchart type="donut" width="100%" height="320" :options="genderOptions" :series="genderSeries"></apexchart>
            </div>
          </div>
        </div>
        <!-- Role Bar Chart -->
        <div class="col-md-6">
          <div class="card border-0 rounded-4 shadow-sm h-100">
            <div class="card-body p-4 text-center d-flex flex-column justify-content-center">
              <h6 class="fw-bold mb-4 w-100 text-start text-muted">អ្នកប្រើប្រាស់តាមតួនាទី</h6>
              <apexchart type="bar" width="100%" height="320" :options="roleOptions" :series="roleSeries"></apexchart>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue';
import BaseCard from '@/components/ui/base/BaseCard.vue';
import dashboardService from '@/services/dashboard.service.js';

const summaries = ref(null);
const isUserStatsLoading = ref(false);

const fetchUserStats = async () => {
  isUserStatsLoading.value = true;
  try {
    const response = await dashboardService.getStatsUser();
    if (response.data?.success) {
      summaries.value = response.data.data;
    }
  } catch (error) {
    console.error("Failed to fetch user stats", error);
  } finally {
    isUserStatsLoading.value = false;
  }
};

onMounted(() => {
  fetchUserStats();
});

// Calculate metrics from summaries
const dynamicCards = computed(() => {
  if (!summaries.value) return [];
  
  const cards = [
    {
      kh_title: "អ្នកប្រើប្រាស់សរុប",
      en_title: "Total Users",
      value: summaries.value.total || 0,
      icon: "bi bi-people-fill",
      color: "primary",
    }
  ];

  if (summaries.value.byRole) {
    summaries.value.byRole.forEach(item => {
      // Skip the Super Admin card as requested
      if (item.role === 'SUPER_ADMIN') return;

      let khTitle = item.role;
      let enTitle = item.role;
      let icon = "bi bi-person-fill";
      let color = "secondary";

      if (item.role === 'ADMIN') {
        khTitle = "អ្នកគ្រប់គ្រង";
        enTitle = "Admin";
        icon = "bi bi-person-check-fill";
        color = "success";
      } else if (item.role === 'TEACHER') {
        khTitle = "គ្រូបង្រៀន";
        enTitle = "Teacher";
        icon = "bi bi-book-fill";
        color = "warning";
      }

      cards.push({
        kh_title: khTitle,
        en_title: enTitle,
        value: item.count,
        icon: icon,
        color: color,
      });
    });
  }

  return cards;
});

// Chart: Gender
const genderSeries = computed(() => {
  if (!summaries.value || !summaries.value.byGender) return [];
  return summaries.value.byGender.map(g => g.count);
});

const genderOptions = computed(() => {
  const labels = summaries.value?.byGender?.map(g => g.gender === 'MALE' ? 'ប្រុស' : 'ស្រី') || [];
  return {
    chart: { type: 'donut', fontFamily: 'inherit' },
    labels: labels,
    colors: ['#FFB31F', '#357867', '#00d492'],
    dataLabels: { enabled: false },
    legend: { position: 'bottom' },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            name: { show: true },
            value: {
              show: true,
              fontSize: '24px',
              fontWeight: 700,
            },
            total: {
              show: true,
              showAlways: true,
              label: 'សរុប',
            }
          }
        }
      }
    }
  };
});

// Chart: Role
const roleSeries = computed(() => {
  if (!summaries.value || !summaries.value.byRole) return [];
  return [{
    name: 'ចំនួនអ្នកប្រើប្រាស់',
    data: summaries.value.byRole.map(r => r.count)
  }];
});

const roleOptions = computed(() => {
  const categories = summaries.value?.byRole?.map(r => r.role) || [];
  return {
    chart: { type: 'bar', toolbar: { show: false }, fontFamily: 'inherit' },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '40%',
        borderRadius: 4,
        distributed: true
      },
    },
    colors: ['#dc3545', '#357867', '#FFB31F', '#0d6efd', '#0dcaf0'],
    dataLabels: { enabled: false },
    xaxis: {
      categories: categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { show: true },
    grid: {
      strokeDashArray: 4,
      borderColor: '#e9ecef',
    },
    legend: { show: false }
  };
});
</script>

<style scoped>
.top-card {
  background: linear-gradient(135deg, #006e4c 0%, #00d492 100%);
  min-height: 220px;
}
.welcome-image {
  width: 100%;
  max-width: 320px;
  height: 220px;
  object-fit: contain;
}
</style>