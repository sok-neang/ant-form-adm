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
            src="/src/assets/images/img/handcoding-cuate.png"
            alt="Welcome"
            class="welcome-image"
          />
        </div>
      </div>
    </div>
    <!-- Top Stats -->
    <div class="row g-3 mb-4">
      <div class="col-12 col-md-3">
        <BaseStatCard 
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
      </div>
      <div class="col-12 col-md-3">
        <BaseStatCard 
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
      </div>
      <div class="col-12 col-md-3">
        <BaseStatCard 
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
      </div>
      <div class="col-12 col-md-3">
        <BaseStatCard 
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
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="d-flex justify-content-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    
    <!-- Chart -->
    <div v-else-if="statsData">
      <!-- Tabs (Outer) -->
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
          <!-- Card Header -->
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
              <GenderDonutChart 
                title="Web Development"
                :total="chartData.webTotal"
                :maleCount="chartData.webMale"
                :femaleCount="chartData.webFemale"
              />
            </div>
            <div class="col-md-6 d-flex justify-content-center">
              <GenderDonutChart 
                title="Mobile App"
                :total="chartData.mobileTotal"
                :maleCount="chartData.mobileMale"
                :femaleCount="chartData.mobileFemale"
              />
            </div>
          </div>

          <!-- Year Bar Chart -->
          <YearBarChart 
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
          <div class="col-12 col-md-4">
            <BaseStatCard 
              label="សិស្សទាំងអស់" 
              :value="statsData.submissions?.total || 0" 
              valueClass="text-dark"
              icon="bi bi-people-fill"
              iconBgClass="bg-success bg-opacity-10"
              iconColor="#198754"
              :stats="[
                { label: 'ជាប់', value: statsData.shortlist?.passed.total},
                { label: 'ធ្លាក់', value: statsData.shortlist?.failed.total}
              ]"
            />
          </div>
          <div class="col-12 col-md-4">
            <BaseStatCard 
              label="Web Development" 
              :value="statsData.submissions?.web || 0" 
              valueClass="text-dark"
              icon="bi bi-book-half"
              iconBgClass="bg-success bg-opacity-10"
              iconColor="#198754"
              :stats="[
                { label: 'ជាប់', value: statsData.shortlist?.passed.web || 0},
                { label: 'ធ្លាក់', value: statsData.shortlist?.failed.web || 0}
              ]"
            />
          </div>
          <div class="col-12 col-md-4">
            <BaseStatCard 
              label="Mobile App" 
              :value="statsData.submissions?.mobile || 0" 
              valueClass="text-dark"
              icon="bi bi-code-slash"
              iconBgClass="bg-success bg-opacity-10"
              iconColor="#198754"
              :stats="[
                { label: 'ជាប់', value: statsData.shortlist?.passed.mobile || 0},
                { label: 'ធ្លាក់', value: statsData.shortlist?.failed.mobile || 0}
              ]"
            />
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
          <div class="col-12 col-md-4">
            <BaseStatCard 
              label="សិស្សទាំងអស់" 
              :value="statsData.shortlist?.passed?.total || 0" 
              valueClass="text-dark"
              icon="bi bi-people-fill"
              iconBgClass="bg-success bg-opacity-10"
              iconColor="#198754"
              :stats="[
                { label: 'ជាប់', value: statsData.evaluation?.passed.total || 0 },
                { label: 'ធ្លាក់', value: statsData.evaluation?.failed.total || 0 }
              ]"
            />
          </div>
          <div class="col-12 col-md-4">
            <BaseStatCard 
              label="Web Development" 
              :value="statsData.shortlist?.passed?.web || 0" 
              valueClass="text-dark"
              icon="bi bi-book-half"
              iconBgClass="bg-success bg-opacity-10"
              iconColor="#198754"
              :stats="[
                { label: 'ជាប់', value: statsData.evaluation?.passed.web || 0 },
                { label: 'ធ្លាក់', value: statsData.evaluation?.failed.web || 0 }
              ]"
            />
          </div>
          <div class="col-12 col-md-4">
            <BaseStatCard 
              label="Mobile App" 
              :value="statsData.shortlist?.passed?.mobile || 0" 
              valueClass="text-dark"
              icon="bi bi-code-slash"
              iconBgClass="bg-success bg-opacity-10"
              iconColor="#198754"
              :stats="[
                { label: 'ជាប់', value: statsData.evaluation?.passed?.mobile || 0 },
                { label: 'ធ្លាក់', value: statsData.evaluation?.failed?.mobile || 0 }
              ]"
            />
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
          <div class="col-12 col-md-4">
            <BaseStatCard 
              label="សិស្សទាំងអស់" 
              :value="statsData.evaluation?.passed?.total || 0" 
              valueClass="text-dark"
              icon="bi bi-people-fill"
              iconBgClass="bg-success bg-opacity-10"
              iconColor="#198754"
              :stats="[
                { label: 'ជាប់', value: (statsData.evaluation?.passed?.total) - (statsData.reserved?.total) || 0},
                { label: 'បម្រុង', value: statsData.reserved?.total || 0 }
              ]"
            />
          </div>
          <div class="col-12 col-md-4">
            <BaseStatCard 
              label="Web Development" 
              :value="statsData.evaluation?.passed?.web || 0" 
              valueClass="text-dark"
              icon="bi bi-book-half"
              iconBgClass="bg-success bg-opacity-10"
              iconColor="#198754"
              :stats="[
                { label: 'ជាប់', value: (statsData.evaluation?.passed?.web) - (statsData.reserved?.web) || 0},
                { label: 'បម្រុង', value: statsData.reserved?.web || 0 }
              ]"
            />
          </div>
          <div class="col-12 col-md-4">
            <BaseStatCard 
              label="Mobile App" 
              :value="statsData.evaluation?.passed?.mobile || 0" 
              valueClass="text-dark"
              icon="bi bi-code-slash"
              iconBgClass="bg-success bg-opacity-10"
              iconColor="#198754"
              :stats="[
                { label: 'ជាប់', value: (statsData.evaluation?.passed?.mobile) - (statsData.reserved?.mobile) || 0},
                { label: 'បម្រុង', value: statsData.reserved?.mobile || 0 }
              ]"
            />
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
  if (!statsData.value) return null;
  let dataGroup = statsData.value.submissions;
  let title = 'សិស្សស្នើសុំទាំងអស់';
  
  if (activeChartTab.value === 'shortlist') {
    dataGroup = statsData.value.shortlist?.passed;
    title = 'សិស្ស (short list)';
  }
  if (activeChartTab.value === 'evaluation') {
    dataGroup = statsData.value.evaluation?.passed;
    title = 'សិស្ស (Final Result)';
  }
  
  if (!dataGroup) return null;
  // Donut Charts Data (Web vs Mobile by Gender)
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
  
  // Bar Chart Data (Year 1 to Year 5 by Gender)
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

onMounted(() => {
  getStatsUser();
})
</script>

<style scoped>
.border-3 {
  border-width: 3px !important;
}
</style>
