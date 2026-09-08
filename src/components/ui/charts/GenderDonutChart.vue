<template>
  <div class="d-flex flex-column align-items-center w-100">
    <div class="d-flex align-items-center gap-4 w-100 justify-content-center">
      <!-- Donut Chart -->
      <div class="position-relative">
        <apexchart
          type="donut"
          width="200"
          :options="chartOptions"
          :series="chartSeries"
        />
      </div>

      <!-- Legends -->
      <div class="d-flex flex-column gap-2">
        <div class="legend-pill d-flex align-items-center justify-content-between p-2 px-3 rounded-pill" style="min-width: 160px; background-color: #f8fafc;">
          <div class="d-flex align-items-center gap-2">
            <span class="legend-dot" style="background-color: #357867;"></span>
            <span class="fw-semibold text-dark small">ស្រី {{ femaleCount }}នាក់</span>
          </div>
          <span class="fw-bold" style="color: #357867; font-size: 0.85rem;">{{ femalePercent }}%</span>
        </div>

        <div class="legend-pill d-flex align-items-center justify-content-between p-2 px-3 rounded-pill" style="min-width: 160px; background-color: #f8fafc;">
          <div class="d-flex align-items-center gap-2">
            <span class="legend-dot" style="background-color: #f59e0b;"></span>
            <span class="fw-semibold text-dark small">ប្រុស {{ maleCount }}នាក់</span>
          </div>
          <span class="fw-bold" style="color: #f59e0b; font-size: 0.85rem;">{{ malePercent }}%</span>
        </div>
      </div>
    </div>
    <h6 class="mt-3 fw-bold text-dark">{{ title }}</h6>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  title: String,
  total: { type: Number, default: 0 },
  maleCount: { type: Number, default: 0 },
  femaleCount: { type: Number, default: 0 },
});

const malePercent = computed(() => props.total > 0 ? Math.round((props.maleCount / props.total) * 100) : 0);
const femalePercent = computed(() => props.total > 0 ? Math.round((props.femaleCount / props.total) * 100) : 0);

const chartSeries = computed(() => {
  if (props.maleCount === 0 && props.femaleCount === 0) return [1, 1];
  return [props.femaleCount, props.maleCount]; 
});

const chartOptions = computed(() => ({
  chart: {
    type: "donut",
    fontFamily: "inherit",
    animations: { enabled: true, easing: "easeinout", speed: 600 },
  },
  colors: ["#357867", "#f59e0b"],
  labels: ["ស្រី", "ប្រុស"],
  stroke: { width: 0 },
  dataLabels: { enabled: false },
  legend: { show: false },
  tooltip: {
    theme: "light",
    y: { formatter: (val) => `${val} នាក់` },
  },
  plotOptions: {
    pie: {
      donut: {
        size: "72%",
        labels: {
          show: true,
          name: { show: false },
          value: {
            show: true,
            fontSize: "22px",
            fontWeight: 700,
            color: "#357867",
            offsetY: 0,
            formatter: () => String(props.total),
          },
          total: {
            show: true,
            showAlways: true,
            label: "",
            formatter: () => String(props.total),
          },
        },
      },
    },
  },
}));
</script>

<style scoped>
.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}
</style>
