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
    <BaseCard v-for="card in dashboardCards">
      <div class="d-flex align-items-center justify-content-between mb-3">
          <div class="info-icon" :class="`bg-${card.color}-subtle text-${card.color}`">
              <i :class="card.icon"></i>
          </div>
          <!-- Value -->
          <h2 class="fw-bold mb-0 text-success fw-bold">{{ card.value }}</h2>
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

</div>
</template>

<script setup>
import BaseCard from '@/components/ui/base/BaseCard.vue';
const dashboardCards = [
  {
    kh_title: "សិស្សសរុប",
    en_title: "Total Students",
    value: 1250,
    icon: "bi bi-people-fill",
    color: "primary",
    badge: "+12%",
  },
  {
    kh_title: "កម្មវិធីទូរសព្ទ",
    en_title: "Mobile App",
    value: 35,
    icon: "bi bi-phone-fill",
    color: "success",
    badge: "+8%",
  },
  {
    kh_title: "អភិវឌ្ឍន៍គេហទំព័រ",
    en_title: "Web Development",
    value: 86,
    icon: "bi bi-globe2",
    color: "warning",
    badge: "24",
  },
];
</script>