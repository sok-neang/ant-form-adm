<template>
  <div class="card border-0 rounded-4 shadow-sm h-100 p-4 chart-card">
    <h5 class="fw-bold mb-4 chart-title">ចំនួនសិស្សតាមមុខជំនាញ</h5>

    <div v-if="loading" class="d-flex align-items-center justify-content-center h-100 py-5">
      <BaseSkeleton width="180px" height="180px" circle />
    </div>

    <div v-else class="row align-items-center g-3 my-auto">
      <!-- Donut Chart -->
      <div class="col-sm-7 d-flex justify-content-center">
        <div class="chart-wrapper">
          <apexchart
            type="donut"
            width="250"
            :options="chartOptions"
            :series="chartSeries"
          />
        </div>
      </div>

      <!-- Custom Legends / Pills -->
      <div class="col-sm-5">
        <div class="d-flex flex-column gap-3">
          <div class="legend-pill d-flex align-items-center justify-content-between p-2 px-3 rounded-pill">
            <div class="d-flex align-items-center gap-2">
              <span class="legend-dot bg-teal"></span>
              <span class="fw-semibold text-dark small">Web</span>
            </div>
            <span class="badge-percent text-teal fw-bold">{{ webPercent }}%</span>
          </div>

          <div class="legend-pill d-flex align-items-center justify-content-between p-2 px-3 rounded-pill">
            <div class="d-flex align-items-center gap-2">
              <span class="legend-dot bg-amber"></span>
              <span class="fw-semibold text-dark small">Mobile App</span>
            </div>
            <span class="badge-percent text-amber fw-bold">{{ mobilePercent }}%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  total: {
    type: Number,
    default: 0,
  },
  webCount: {
    type: Number,
    default: 0,
  },
  webPercent: {
    type: Number,
    default: 50,
  },
  mobileCount: {
    type: Number,
    default: 0,
  },
  mobilePercent: {
    type: Number,
    default: 50,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const chartSeries = computed(() => {
  if (props.webCount === 0 && props.mobileCount === 0) {
    return [1, 1];
  }
  return [props.webCount, props.mobileCount];
});

const chartOptions = computed(() => ({
  chart: {
    type: "donut",
    fontFamily: "inherit",
    animations: {
      enabled: true,
      easing: "easeinout",
      speed: 600,
    },
  },
  colors: ["#2e7d6b", "#f59e0b"],
  labels: ["Web", "Mobile App"],
  stroke: {
    width: 0,
  },
  dataLabels: {
    enabled: false,
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
  plotOptions: {
    pie: {
      donut: {
        size: "72%",
        labels: {
          show: true,
          name: {
            show: true,
            fontSize: "13px",
            fontWeight: 500,
            color: "#64748b",
            offsetY: 20,
          },
          value: {
            show: true,
            fontSize: "26px",
            fontWeight: 700,
            color: "#1e293b",
            offsetY: -16,
            formatter: () => String(props.total),
          },
          total: {
            show: true,
            label: "students",
            fontSize: "13px",
            fontWeight: 500,
            color: "#64748b",
            formatter: () => String(props.total),
          },
        },
      },
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

.chart-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.legend-pill {
  background-color: #f8fafc;
  border: 1px solid #f1f5f9;
  transition: all 0.2s ease;
}

.legend-pill:hover {
  background-color: #f1f5f9;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}

.bg-teal {
  background-color: #2e7d6b;
}

.text-teal {
  color: #2e7d6b;
}

.bg-amber {
  background-color: #f59e0b;
}

.text-amber {
  color: #f59e0b;
}

.badge-percent {
  font-size: 0.85rem;
}
</style>
