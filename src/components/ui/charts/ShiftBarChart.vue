<template>
  <div class="card border-0 rounded-4 shadow-sm h-100 p-4 chart-card">
    <div class="d-flex align-items-center justify-content-between mb-3">
      <h5 class="fw-bold mb-0 chart-title">ចំនួនសិស្សតាមវេនសិក្សា</h5>
      <!-- Custom top-right legend -->
      <div class="d-flex align-items-center gap-3">
        <div class="d-flex align-items-center gap-1">
          <span class="legend-square bg-amber"></span>
          <span class="text-muted small">Morning</span>
        </div>
        <div class="d-flex align-items-center gap-1">
          <span class="legend-square bg-teal"></span>
          <span class="text-muted small">Afternoon</span>
        </div>
      </div>
    </div>

    <div v-if="loading" class="d-flex align-items-center justify-content-center h-100 py-5">
      <BaseSkeleton width="100%" height="200px" radius="12px" />
    </div>

    <div v-else class="chart-wrapper mt-auto">
      <apexchart
        type="bar"
        height="220"
        :options="chartOptions"
        :series="chartSeries"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  webMorning: {
    type: Number,
    default: 0,
  },
  webAfternoon: {
    type: Number,
    default: 0,
  },
  mobileMorning: {
    type: Number,
    default: 0,
  },
  mobileAfternoon: {
    type: Number,
    default: 0,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const chartSeries = computed(() => [
  {
    name: "Morning",
    data: [props.webMorning, props.mobileMorning],
  },
  {
    name: "Afternoon",
    data: [props.webAfternoon, props.mobileAfternoon],
  },
]);

const chartOptions = computed(() => ({
  chart: {
    type: "bar",
    toolbar: {
      show: false,
    },
    fontFamily: "inherit",
    animations: {
      enabled: true,
      easing: "easeinout",
      speed: 600,
    },
  },
  colors: ["#f59e0b", "#2e7d6b"],
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "35%",
      borderRadius: 6,
      borderRadiusApplication: "end",
      dataLabels: {
        position: "top",
      },
    },
  },
  dataLabels: {
    enabled: true,
    offsetY: -20,
    style: {
      fontSize: "12px",
      fontWeight: 600,
      colors: ["#475569"],
    },
    formatter: (val) => (val > 0 ? val : ""),
  },
  stroke: {
    show: true,
    width: 2,
    colors: ["transparent"],
  },
  xaxis: {
    categories: ["Web Dev", "Mobile"],
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    labels: {
      style: {
        colors: "#64748b",
        fontSize: "12px",
        fontWeight: 500,
      },
    },
  },
  yaxis: {
    show: true,
    labels: {
      style: {
        colors: "#94a3b8",
        fontSize: "11px",
      },
    },
  },
  grid: {
    borderColor: "#f1f5f9",
    strokeDashArray: 4,
    yaxis: {
      lines: {
        show: true,
      },
    },
    xaxis: {
      lines: {
        show: false,
      },
    },
    padding: {
      top: 15,
      right: 10,
      bottom: 0,
      left: 10,
    },
  },
  legend: {
    show: false,
  },
  tooltip: {
    theme: "light",
    y: {
      formatter: (val) => `${val} នាក់`,
    },
  },
}));
</script>

<style scoped>
.chart-card {
  background-color: #ffffff;
  border: 1px solid #f1f5f9;
  min-height: 310px;
}

.chart-title {
  color: #1e293b;
  font-size: 1rem;
}

.legend-square {
  width: 10px;
  height: 10px;
  border-radius: 2px;
  display: inline-block;
}

.bg-teal {
  background-color: #2e7d6b;
}

.bg-amber {
  background-color: #f59e0b;
}
</style>
