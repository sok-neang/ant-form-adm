<template>
  <div class="w-100 mt-4">
    <div class="d-flex align-items-center justify-content-between mb-2">
      <h6 class="fw-bold text-muted mb-0">ចំនួនសិស្ស - តាមភេទ & ឆ្នាំសិក្សា</h6>
    </div>
    
    <div class="chart-wrapper">
      <apexchart
        type="bar"
        height="250"
        :options="chartOptions"
        :series="chartSeries"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  categories: { type: Array, default: () => ["ឆ្នាំទី ៣", "ឆ្នាំទី ៤"] },
  series1Name: { type: String, default: "Web" },
  series1Data: { type: Array, default: () => [] },
  series1Color: { type: String, default: "#f59e0b" },
  series2Name: { type: String, default: "Mobile" },
  series2Data: { type: Array, default: () => [] },
  series2Color: { type: String, default: "#357867" },
});

const chartSeries = computed(() => [
  { name: props.series1Name, data: props.series1Data },
  { name: props.series2Name, data: props.series2Data },
]);

const chartOptions = computed(() => ({
  chart: {
    type: "bar",
    toolbar: { show: false },
    fontFamily: "inherit",
  },
  colors: [props.series1Color, props.series2Color],
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "40%",
      borderRadius: 4,
      borderRadiusApplication: "end",
      dataLabels: { position: "top" },
    },
  },
  dataLabels: {
    enabled: true,
    offsetY: -20,
    style: {
      fontSize: "13px",
      fontWeight: 600,
      colors: [props.series1Color, props.series2Color],
    },
  },
  stroke: { show: true, width: 2, colors: ["transparent"] },
  xaxis: {
    categories: props.categories,
    axisBorder: { show: true, color: "#e2e8f0" },
    axisTicks: { show: false },
    labels: {
      style: { colors: "#64748b", fontSize: "13px", fontWeight: 500 },
    },
  },
  yaxis: {
    show: true,
    labels: { style: { colors: "#94a3b8", fontSize: "12px" } },
  },
  grid: {
    borderColor: "#f1f5f9",
    strokeDashArray: 4,
    yaxis: { lines: { show: true } },
    xaxis: { lines: { show: false } },
  },
  legend: {
    position: 'right',
    offsetY: 40,
    markers: { radius: 12 },
  },
  tooltip: {
    theme: "light",
    y: { formatter: (val) => `${val} នាក់` },
  },
}));
</script>
