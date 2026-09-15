<template>
  <div class="dashboard-content p-4 bg-light min-vh-100">
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
            src="/src/assets/images/img/handcoding-cuate.webp"
            alt="Welcome"
            class="welcome-image"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </div>

    <!-- Top Stats -->
    <div class="row g-3 mb-4">
      <!-- Card 1 -->
      <div class="col-12 col-md-3">
        <BaseStatCard v-if="!loading"
          label="សិស្សស្នើសុំទាំងអស់" 
          :value="statsData?.submissions?.total || 0" 
          valueClass="text-dark"
          icon="bi bi-people-fill"
          iconBgClass="bg-success bg-opacity-10"
          iconColor="#198754"
          :stats="[
            { label: 'ប្រុស', value: getGenderCount(statsData?.submissions?.byGender, 'MALE') },
            { label: 'ស្រី', value: getGenderCount(statsData?.submissions?.byGender, 'FEMALE') }
          ]"
        />
        <div v-else class="card border-0 shadow-sm rounded-4 p-3 h-100">
          <div class="d-flex align-items-center justify-content-between mb-3 gap-3">
            <div class="bg-success bg-opacity-10 rounded p-2 d-flex align-items-center justify-content-center" style="width: 48px; height: 48px;">
              <i class="bi bi-people-fill fs-4" style="color: #198754"></i>
            </div>
            <BaseSkeleton width="50%" height="32px" class="mb-3" />
          </div>
          <span class="text-muted fw-bold">សិស្សស្នើសុំទាំងអស់</span>
          <hr>
          <div class="d-flex justify-content-between align-items-center gap-4 mt-auto">
            <div class="d-flex align-items-center gap-2"><span class="small text-muted">ប្រុស</span><BaseSkeleton width="50px" height="16px" /></div>
            <div class="d-flex align-items-center gap-2"><span class="small text-muted">ស្រី</span><BaseSkeleton width="50px" height="16px" /></div>
          </div>
        </div>
      </div>
      
      <!-- Card 2 -->
      <div class="col-12 col-md-3">
        <BaseStatCard v-if="!loading"
          label="សិស្សជ្រើសសម្រាំង (Short list)" 
          :value="statsData?.shortlist?.passed?.total || 0" 
          valueClass="text-dark"
          icon="bi bi-book-half"
          iconBgClass="bg-warning bg-opacity-10"
          iconColor="#f59e0b"
          :stats="[
            { label: 'ប្រុស', value: getGenderCount(statsData?.shortlist?.passed?.byGender, 'MALE') },
            { label: 'ស្រី', value: getGenderCount(statsData?.shortlist?.passed?.byGender, 'FEMALE') }
          ]"
        />
        <div v-else class="card border-0 shadow-sm rounded-4 p-3 h-100">
          <div class="d-flex align-items-center justify-content-between mb-3 gap-3">
            <div class="bg-warning bg-opacity-10 rounded p-2 d-flex align-items-center justify-content-center" style="width: 48px; height: 48px;">
              <i class="bi bi-book-half fs-4" style="color: #f59e0b"></i>
            </div>
            <BaseSkeleton width="50%" height="32px" class="mb-3" />
          </div>
          <span class="text-muted fw-bold">សិស្សជ្រើសសម្រាំង (Short list)</span>
          <hr>
          <div class="d-flex justify-content-between align-items-center gap-4 mt-auto">
            <div class="d-flex align-items-center gap-2"><span class="small text-muted">ប្រុស</span><BaseSkeleton width="50px" height="16px" /></div>
            <div class="d-flex align-items-center gap-2"><span class="small text-muted">ស្រី</span><BaseSkeleton width="50px" height="16px" /></div>
          </div>
        </div>
      </div>

      <!-- Card 3 -->
      <div class="col-12 col-md-3">
        <BaseStatCard v-if="!loading"
          label="សិស្សជ័យលាភី (Final Result)" 
          :value="statsData?.evaluation?.passed?.total || 0" 
          valueClass="text-dark"
          icon="bi bi-trophy-fill"
          iconBgClass="bg-primary-subtle"
          iconColor="#0d6efd"
          :stats="[
            { label: 'ប្រុស', value: getGenderCount(statsData?.evaluation?.passed?.byGender, 'MALE') },
            { label: 'ស្រី', value: getGenderCount(statsData?.evaluation?.passed?.byGender, 'FEMALE') }
          ]"
        />
        <div v-else class="card border-0 shadow-sm rounded-4 p-3 h-100">
          <div class="d-flex align-items-center justify-content-between mb-3 gap-3">
            <div class="bg-primary-subtle rounded p-2 d-flex align-items-center justify-content-center" style="width: 48px; height: 48px;">
              <i class="bi bi-trophy-fill fs-4" style="color: #0d6efd"></i>
            </div>
            <BaseSkeleton width="50%" height="32px" class="mb-3" />
          </div>
          <span class="text-muted fw-bold">សិស្សជ័យលាភី (Final Result)</span>
          <hr>
          <div class="d-flex justify-content-between align-items-center gap-4 mt-auto">
            <div class="d-flex align-items-center gap-2"><span class="small text-muted">ប្រុស</span><BaseSkeleton width="50px" height="16px" /></div>
            <div class="d-flex align-items-center gap-2"><span class="small text-muted">ស្រី</span><BaseSkeleton width="50px" height="16px" /></div>
          </div>
        </div>
      </div>

      <!-- Card 4 -->
      <div class="col-12 col-md-3">
        <BaseStatCard v-if="!loading"
          label="សិស្សបញ្ជីខ្មៅ (Black List)" 
          :value="statsData?.blacklist?.total || 0" 
          valueClass="text-dark"
          icon="bi bi-x-circle-fill"
          iconBgClass="bg-danger bg-opacity-10"
          iconColor="#dc3545"
          :stats="[
            { label: 'ប្រុស', value: getGenderCount(statsData?.blacklist?.byGender, 'MALE') },
            { label: 'ស្រី', value: getGenderCount(statsData?.blacklist?.byGender, 'FEMALE') }
          ]"
        />
        <div v-else class="card border-0 shadow-sm rounded-4 p-3 h-100">
          <div class="d-flex align-items-center justify-content-between mb-3 gap-3">
            <div class="bg-danger bg-opacity-10 rounded p-2 d-flex align-items-center justify-content-center" style="width: 48px; height: 48px;">
              <i class="bi bi-x-circle-fill fs-4" style="color: #dc3545"></i>
            </div>
            <BaseSkeleton width="50%" height="32px" class="mb-3" />
          </div>
          <span class="text-muted fw-bold">សិស្សបញ្ជីខ្មៅ (Black List)</span>
          <hr>
          <div class="d-flex justify-content-between align-items-center gap-4 mt-auto">
            <div class="d-flex align-items-center gap-2"><span class="small text-muted">ប្រុស</span><BaseSkeleton width="50px" height="16px" /></div>
            <div class="d-flex align-items-center gap-2"><span class="small text-muted">ស្រី</span><BaseSkeleton width="50px" height="16px" /></div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Always render layout, toggle inner content based on loading -->
    <div>
      <!-- Tabs (Outer) - Always Visible -->
      <div class="d-flex border-bottom mb-4" style="gap: 2rem;">
        <button class="btn btn-link text-decoration-none fw-bold px-3 py-3 rounded-0 border-0" 
          :class="activeChartTab === 'submissions' ? 'text-dark border-bottom border-primary border-3' : 'text-muted'"
          @click="activeChartTab = 'submissions'"
          style="margin-bottom: -1px; background-color: transparent; border-radius: 0;">
          សិស្សស្នើសុំទាំងអស់
        </button>
        <button class="btn btn-link text-decoration-none fw-bold px-3 py-3 rounded-0 border-0" 
          :class="activeChartTab === 'shortlist' ? 'text-dark border-bottom border-primary border-3' : 'text-muted'"
          @click="activeChartTab = 'shortlist'"
          style="margin-bottom: -1px; background-color: transparent; border-radius: 0;">
          សិស្ស (short list)
        </button>
        <button class="btn btn-link text-decoration-none fw-bold px-3 py-3 rounded-0 border-0" 
          :class="activeChartTab === 'evaluation' ? 'text-dark border-bottom border-primary border-3' : 'text-muted'"
          @click="activeChartTab = 'evaluation'"
          style="margin-bottom: -1px; background-color: transparent; border-radius: 0;">
          សិស្ស (Final Result)
        </button>
      </div>

      <!-- Chart Section -->
      <div class="card border-0 shadow-sm rounded-4 p-5 mb-5 mx-auto">
        <div v-if="chartData">
          <!-- Card Header - Always Visible -->
          <div class="d-flex align-items-center justify-content-between mb-4">
            <div class="d-flex align-items-center gap-2">
              <div class="bg-primary rounded-circle" style="width: 14px; height: 14px; background-color: #0d6efd !important;"></div>
              <h5 class="fw-bold mb-0 text-dark">{{ chartData.title }}</h5>
            </div>
            <div class="d-flex align-items-center gap-3">
              <div class="d-flex align-items-center gap-1">
                <span style="background-color: #f59e0b; width: 10px; height: 10px; border-radius: 2px;"></span>
                <span class="text-muted small fw-medium">ប្រុស</span>
              </div>
              <div class="d-flex align-items-center gap-1">
                <span style="background-color: #357867; width: 10px; height: 10px; border-radius: 2px;"></span>
                <span class="text-muted small fw-medium">ស្រី</span>
              </div>
            </div>
          </div>

          <!-- Gender Donut Charts -->
          <h6 class="fw-bold text-muted mb-4 mt-2">ចំនួនសិស្ស - តាមភេទ</h6>
          <div class="row align-items-center justify-content-center mb-5 gx-0">
            <div class="col-md-6 d-flex justify-content-center border-end">
              <BaseSkeleton v-if="loading" width="220px" height="220px" circle />
              <GenderDonutChart v-else
                title="Web Development"
                :total="chartData.webTotal"
                :maleCount="chartData.webMale"
                :femaleCount="chartData.webFemale"
              />
            </div>
            <div class="col-md-6 d-flex justify-content-center">
              <BaseSkeleton v-if="loading" width="220px" height="220px" circle />
              <GenderDonutChart v-else
                title="Mobile App"
                :total="chartData.mobileTotal"
                :maleCount="chartData.mobileMale"
                :femaleCount="chartData.mobileFemale"
              />
            </div>
          </div>

          <!-- Year Bar Chart -->
          <BaseSkeleton v-if="loading" width="100%" height="300px" radius="8px" />
          <YearBarChart v-else
            :categories="chartData.yearCategories"
            :series1Name="'ប្រុស'"
            :series1Data="chartData.yearMaleData"
            :series1Color="'#f59e0b'"
            :series2Name="'ស្រី'"
            :series2Data="chartData.yearFemaleData"
            :series2Color="'#357867'"
          />
        </div>
      </div>

      <!-- Detailed Stats Title -->
      <div class="mb-4">
        <h5 class="fw-bold mb-1 d-flex align-items-center gap-2">
          <i class="bi bi-bar-chart-fill text-success fs-4"></i> ស្ថិតិសិស្សតាមដំណាក់កាលនីមួយៗ
        </h5>
        <p class="text-muted small ms-4 ps-2 mb-0">សិស្សទូទៅ វិទ្យាសាស្រ្តកុំព្យូទ័រ ANT-Form</p>
      </div>

      <!-- Submissions -->
      <div class="card border-0 shadow-sm rounded-4 p-4 mb-4">
        <div class="d-flex align-items-center gap-2 mb-3">
          <div class="bg-primary rounded-circle" style="width: 12px; height: 12px; background-color: #0d6efd !important;"></div>
          <h6 class="fw-bold mb-0">សិស្សដែលបានដាក់ពាក្យទាំងអស់</h6>
        </div>
        
        <div class="row g-3">
          <!-- Submission Cards -->
          <div class="col-12 col-md-4" v-for="(cardData, idx) in submissionsCardsList" :key="'sub-'+idx">
            <BaseStatCard v-if="!loading"
              :label="cardData.label" 
              :value="cardData.value()" 
              valueClass="text-dark"
              :icon="cardData.icon"
              iconBgClass="bg-success bg-opacity-10"
              iconColor="#198754"
              :stats="cardData.stats()"
            />
            <div v-else class="card border-0 shadow-sm rounded-4 p-3 h-100">
              <div class="d-flex align-items-center mb-3 gap-3">
                <div class="bg-success bg-opacity-10 rounded p-2 d-flex align-items-center justify-content-center" style="width: 48px; height: 48px;">
                  <i :class="cardData.icon" class="fs-4" style="color: #198754"></i>
                </div>
                <span class="text-muted fw-bold">{{ cardData.label }}</span>
              </div>
              <BaseSkeleton width="50%" height="32px" class="mb-3" />
              <div class="d-flex gap-4 mt-auto">
                <div class="d-flex align-items-center gap-2"><span class="small text-muted">ជាប់</span><BaseSkeleton width="24px" height="16px" /></div>
                <div class="d-flex align-items-center gap-2"><span class="small text-muted">ធ្លាក់</span><BaseSkeleton width="24px" height="16px" /></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Shortlist -->
      <div class="card border-0 shadow-sm rounded-4 p-4 mb-4">
        <div class="d-flex align-items-center gap-2 mb-3">
          <div class="bg-warning rounded-circle" style="width: 12px; height: 12px;"></div>
          <h6 class="fw-bold mb-0">សិស្សដែលបានជាប់សម្រាំង ( short List )</h6>
        </div>
        
        <div class="row g-3">
          <!-- Shortlist Cards -->
          <div class="col-12 col-md-4" v-for="(cardData, idx) in shortlistCardsList" :key="'short-'+idx">
            <BaseStatCard v-if="!loading"
              :label="cardData.label" 
              :value="cardData.value()" 
              valueClass="text-dark"
              :icon="cardData.icon"
              iconBgClass="bg-success bg-opacity-10"
              iconColor="#198754"
              :stats="cardData.stats()"
            />
            <div v-else class="card border-0 shadow-sm rounded-4 p-3 h-100">
              <div class="d-flex align-items-center mb-3 gap-3">
                <div class="bg-success bg-opacity-10 rounded p-2 d-flex align-items-center justify-content-center" style="width: 48px; height: 48px;">
                  <i :class="cardData.icon" class="fs-4" style="color: #198754"></i>
                </div>
                <span class="text-muted fw-bold">{{ cardData.label }}</span>
              </div>
              <BaseSkeleton width="50%" height="32px" class="mb-3" />
              <div class="d-flex gap-4 mt-auto">
                <div class="d-flex align-items-center gap-2"><span class="small text-muted">ជាប់</span><BaseSkeleton width="24px" height="16px" /></div>
                <div class="d-flex align-items-center gap-2"><span class="small text-muted">ធ្លាក់</span><BaseSkeleton width="24px" height="16px" /></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Final Result -->
      <div class="card border-0 shadow-sm rounded-4 p-4 mb-4">
        <div class="d-flex align-items-center gap-2 mb-3">
          <div class="bg-success rounded-circle" style="width: 12px; height: 12px;"></div>
          <h6 class="fw-bold mb-0">លទ្ធផលចុងក្រោយ ( Final Result )</h6>
        </div>
        
        <div class="row g-3">
          <!-- Final Cards -->
          <div class="col-12 col-md-4" v-for="(cardData, idx) in finalCardsList" :key="'final-'+idx">
            <BaseStatCard v-if="!loading"
              :label="cardData.label" 
              :value="cardData.value()" 
              valueClass="text-dark"
              :icon="cardData.icon"
              iconBgClass="bg-success bg-opacity-10"
              iconColor="#198754"
              :stats="cardData.stats()"
            />
            <div v-else class="card border-0 shadow-sm rounded-4 p-3 h-100">
              <div class="d-flex align-items-center mb-3 gap-3">
                <div class="bg-success bg-opacity-10 rounded p-2 d-flex align-items-center justify-content-center" style="width: 48px; height: 48px;">
                  <i :class="cardData.icon" class="fs-4" style="color: #198754"></i>
                </div>
                <span class="text-muted fw-bold">{{ cardData.label }}</span>
              </div>
              <BaseSkeleton width="50%" height="32px" class="mb-3" />
              <div class="d-flex gap-4 mt-auto">
                <div class="d-flex align-items-center gap-2"><span class="small text-muted">ជាប់</span><BaseSkeleton width="24px" height="16px" /></div>
                <div class="d-flex align-items-center gap-2"><span class="small text-muted">បម្រុង</span><BaseSkeleton width="24px" height="16px" /></div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import BaseStatCard from '@/components/ui/base/BaseStatCard.vue'
import GenderDonutChart from '@/components/ui/charts/GenderDonutChart.vue'
import YearBarChart from '@/components/ui/charts/YearBarChart.vue'
// Import Skeleton Component
import BaseSkeleton from '@/components/ui/base/BaseSkeleton.vue' 
import { useStatistic } from '@/composable/dashboard/useStatistic.js';

const { loading, statsData, getStatsUser } = useStatistic();
const activeChartTab = ref('submissions')

const getEstimatedGenderForYear = (yearStats, genderStats) => {
  if (!yearStats || !genderStats) return { male: 0, female: 0 };
  
  const maleStats = genderStats.find(g => g.gender === 'MALE') || {};
  const femaleStats = genderStats.find(g => g.gender === 'FEMALE') || {};
  
  const totalWeb = (maleStats.web || 0) + (femaleStats.web || 0) || 1;
  const totalMobile = (maleStats.mobile || 0) + (femaleStats.mobile || 0) || 1;
  
  const maleWebRatio = (maleStats.web || 0) / totalWeb;
  const maleMobileRatio = (maleStats.mobile || 0) / totalMobile;
  
  const yearWeb = yearStats.web || 0;
  const yearMobile = yearStats.mobile || 0;
  
  const male = Math.round(yearWeb * maleWebRatio) + Math.round(yearMobile * maleMobileRatio);
  const female = (yearStats.total || 0) - male;
  return { male, female: female < 0 ? 0 : female };
}

const chartData = computed(() => {
  let title = 'សិស្សស្នើសុំទាំងអស់';
  if (activeChartTab.value === 'shortlist') title = 'សិស្ស (short list)';
  if (activeChartTab.value === 'evaluation') title = 'សិស្ស (Final Result)';

  // Always return base structure so chart wrapper/titles can render during loading
  if (!statsData.value) {
    return {
      title,
      webTotal: 0, webMale: 0, webFemale: 0,
      mobileTotal: 0, mobileMale: 0, mobileFemale: 0,
      yearCategories: [], yearMaleData: [], yearFemaleData: []
    }
  }

  let dataGroup = statsData.value.submissions;
  if (activeChartTab.value === 'shortlist') dataGroup = statsData.value.shortlist?.passed;
  if (activeChartTab.value === 'evaluation') dataGroup = statsData.value.evaluation?.passed;
  
  if (!dataGroup) return null;

  const webTotal = dataGroup.web || 0;
  const mobileTotal = dataGroup.mobile || 0;
  
  let webMale = 0, webFemale = 0;
  let mobileMale = 0, mobileFemale = 0;
  
  if (dataGroup.byGender) {
    const maleStats = dataGroup.byGender.find(g => g.gender === 'MALE') || {};
    const femaleStats = dataGroup.byGender.find(g => g.gender === 'FEMALE') || {};
    webMale = maleStats.web || 0;
    webFemale = femaleStats.web || 0;
    mobileMale = maleStats.mobile || 0;
    mobileFemale = femaleStats.mobile || 0;
  }
  
  let yearCategories = [];
  let yearMaleData = [];
  let yearFemaleData = [];
  
  if (dataGroup.byYearOfStudy) {
    const yearKeys = ['YEAR_1', 'YEAR_2', 'YEAR_3', 'YEAR_4', 'YEAR_5'];
    const khmerYears = ['ឆ្នាំទី ១', 'ឆ្នាំទី ២', 'ឆ្នាំទី ៣', 'ឆ្នាំទី ៤', 'ឆ្នាំទី ៥'];
    yearKeys.forEach((key, index) => {
      const yearStats = dataGroup.byYearOfStudy.find(y => y.yearOfStudy === key);
      const est = getEstimatedGenderForYear(yearStats, dataGroup.byGender);
      yearCategories.push(khmerYears[index]);
      yearMaleData.push(est.male);
      yearFemaleData.push(est.female);
    });
  }

  return {
    title,
    webTotal, webMale, webFemale,
    mobileTotal, mobileMale, mobileFemale,
    yearCategories,
    yearMaleData,
    yearFemaleData,
  }
})

const getGenderCount = (byGenderArr, gender) => {
  if (!byGenderArr) return 0;
  const item = byGenderArr.find(g => g.gender === gender);
  return item ? item.count || item.total || 0 : 0;
}

// Map configuration array to clean up the detailed stat cards HTML
const submissionsCardsList = computed(() => [
  {
    label: "សិស្សទាំងអស់", icon: "bi bi-people-fill",
    value: () => statsData.value?.submissions?.total || 0,
    stats: () => [
      { label: 'ជាប់', value: statsData.value?.shortlist?.passed?.total || 0},
      { label: 'ធ្លាក់', value: statsData.value?.shortlist?.failed?.total || 0}
    ]
  },
  {
    label: "Web Development", icon: "bi bi-book-half",
    value: () => statsData.value?.submissions?.web || 0,
    stats: () => [
      { label: 'ជាប់', value: statsData.value?.shortlist?.passed?.web || 0},
      { label: 'ធ្លាក់', value: statsData.value?.shortlist?.failed?.web || 0}
    ]
  },
  {
    label: "Mobile App", icon: "bi bi-code-slash",
    value: () => statsData.value?.submissions?.mobile || 0,
    stats: () => [
      { label: 'ជាប់', value: statsData.value?.shortlist?.passed?.mobile || 0},
      { label: 'ធ្លាក់', value: statsData.value?.shortlist?.failed?.mobile || 0}
    ]
  }
]);

const shortlistCardsList = computed(() => [
  {
    label: "សិស្សទាំងអស់", icon: "bi bi-people-fill",
    value: () => statsData.value?.shortlist?.passed?.total || 0,
    stats: () => [
      { label: 'ជាប់', value: statsData.value?.evaluation?.passed?.total || 0 },
      { label: 'ធ្លាក់', value: statsData.value?.evaluation?.failed?.total || 0 }
    ]
  },
  {
    label: "Web Development", icon: "bi bi-book-half",
    value: () => statsData.value?.shortlist?.passed?.web || 0,
    stats: () => [
      { label: 'ជាប់', value: statsData.value?.evaluation?.passed?.web || 0 },
      { label: 'ធ្លាក់', value: statsData.value?.evaluation?.failed?.web || 0 }
    ]
  },
  {
    label: "Mobile App", icon: "bi bi-code-slash",
    value: () => statsData.value?.shortlist?.passed?.mobile || 0,
    stats: () => [
      { label: 'ជាប់', value: statsData.value?.evaluation?.passed?.mobile || 0 },
      { label: 'ធ្លាក់', value: statsData.value?.evaluation?.failed?.mobile || 0 }
    ]
  }
]);

const finalCardsList = computed(() => [
  {
    label: "សិស្សទាំងអស់", icon: "bi bi-people-fill",
    value: () => statsData.value?.evaluation?.passed?.total || 0,
    stats: () => [
      { label: 'ជាប់', value: (statsData.value?.evaluation?.passed?.total || 0) - (statsData.value?.reserved?.total || 0)},
      { label: 'បម្រុង', value: statsData.value?.reserved?.total || 0 }
    ]
  },
  {
    label: "Web Development", icon: "bi bi-book-half",
    value: () => statsData.value?.evaluation?.passed?.web || 0,
    stats: () => [
      { label: 'ជាប់', value: (statsData.value?.evaluation?.passed?.web || 0) - (statsData.value?.reserved?.web || 0)},
      { label: 'បម្រុង', value: statsData.value?.reserved?.web || 0 }
    ]
  },
  {
    label: "Mobile App", icon: "bi bi-code-slash",
    value: () => statsData.value?.evaluation?.passed?.mobile || 0,
    stats: () => [
      { label: 'ជាប់', value: (statsData.value?.evaluation?.passed?.mobile || 0) - (statsData.value?.reserved?.mobile || 0)},
      { label: 'បម្រុង', value: statsData.value?.reserved?.mobile || 0 }
    ]
  }
]);

onMounted(() => {
  getStatsUser();
})
</script>

<style scoped>
.border-3 {
  border-width: 3px !important;
}
</style>