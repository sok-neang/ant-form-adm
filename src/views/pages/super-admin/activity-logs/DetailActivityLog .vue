<script setup>
import BaseModal from "@/components/ui/base/BaseModal.vue";
import BaseButton from "@/components/ui/base/BaseButton.vue";
import { formatDate } from "@/utils/dateFormat.js";
import { computed } from "vue";

const props = defineProps({
  show: { type: Boolean, default: false },
  log: { type: Object, default: () => ({}) },
  type: { type: String, default: "" },
});

const emit = defineEmits(["close"]);
const handleClose = () => {
  emit("close");
};

const actionClass = computed(() => {
  switch (props.log?.action) {
    case "CREATE":
      return "bg-success-subtle text-success";
    case "UPDATE":
      return "bg-primary-subtle text-primary";
    case "DELETE":
      return "bg-danger-subtle text-danger";
    case "RESTORE":
      return "bg-warning-subtle text-warning";
    case "LOGIN":
      return "bg-info-subtle text-info";
    default:
      return "bg-secondary-subtle text-secondary";
  }
});

// Helper to safely parse JSON or object
const parseValue = (val) => {
  if (val === null || val === undefined) return null;
  if (typeof val === "object") return val;
  try {
    return JSON.parse(val);
  } catch {
    return val;
  }
};

const parsedBefore = computed(() => parseValue(props.log?.beforeValue));
const parsedAfter = computed(() => parseValue(props.log?.afterValue));

const isObject = (val) => val !== null && typeof val === "object" && !Array.isArray(val);

const diffKeys = computed(() => {
  const b = isObject(parsedBefore.value) ? parsedBefore.value : {};
  const a = isObject(parsedAfter.value) ? parsedAfter.value : {};
  const keys = new Set([...Object.keys(b), ...Object.keys(a)]);
  return Array.from(keys);
});

const isFieldChanged = (key) => {
  const bVal = parsedBefore.value?.[key];
  const aVal = parsedAfter.value?.[key];
  return JSON.stringify(bVal) !== JSON.stringify(aVal);
};

const formatFieldValue = (val) => {
  if (val === undefined || val === null) return "—";
  if (typeof val === "boolean") return val ? "true" : "false";
  if (typeof val === "object") return JSON.stringify(val);
  return String(val);
};

const hasChanges = computed(() => {
  return parsedBefore.value !== null || parsedAfter.value !== null;
});
</script>

<template>
  <BaseModal :show="props.show" title="ព័ត៌មានលម្អិតកំណត់ហេតុ" size="lg" @close="handleClose">
    <template #header>
      <div class="d-flex align-items-center gap-3">
        <div class="d-flex align-items-center justify-content-center bg-primary-subtle text-primary rounded-3" style="width: 42px; height: 42px;">
          <i class="bi bi-shield-check fs-3"></i>
        </div>

        <div>
          <h5 class="modal-title fw-bold mb-1">
            កំណត់ហេតុសវនកម្ម
          </h5>
          <p class="text-muted mb-0 small">
            ព័ត៌មានលម្អិតអំពីសកម្មភាពរបស់អ្នកប្រើប្រាស់
          </p>
        </div>
      </div>
    </template>

    <div class="audit-detail">
      <hr />
      <!-- Basic Information -->
      <div class="detail-section">
        <h6 class="section-title">
          ព័ត៌មានទូទៅ
        </h6>

        <div class="row g-3">
          <div class="col-md-6">
            <div class="info-card">
              <span class="label">អ្នកប្រើប្រាស់</span>
              <div class="value">
                {{ props.log?.user?.name || "N/A" }}
                <span class="text-muted small d-block">{{ props.log?.user?.email || "" }}</span>
              </div>
            </div>
          </div>

          <div class="col-md-6">
            <div class="info-card">
              <span class="label">តួនាទី</span>
              <span class="value text-success">
                {{ props.log?.user?.role || "—" }}
              </span>
            </div>
          </div>

          <div class="col-md-6">
            <div class="info-card">
              <span class="label">សកម្មភាព</span>
              <span class="action-badge" :class="actionClass">
                {{ log?.action || "-" }}
              </span>
            </div>
          </div>

          <div class="col-md-6">
            <div class="info-card">
              <span class="label">ពេលវេលា</span>
              <div class="value">
                {{ formatDate(props.log?.createdAt) }}
              </div>
            </div>
          </div>

          <!-- Target Table & ID if available -->
          <div v-if="props.log?.targetTable || props.log?.tableName" class="col-md-6">
            <div class="info-card">
              <span class="label">តារាងគោលដៅ (Target Table)</span>
              <span class="value text-primary font-monospace">
                {{ props.log?.targetTable || props.log?.tableName }}
              </span>
            </div>
          </div>

          <div v-if="props.log?.targetId || props.log?.recordId" class="col-md-6">
            <div class="info-card">
              <span class="label">លេខសម្គាល់កំណត់ត្រា (Record ID)</span>
              <span class="value text-muted font-monospace small">
                {{ props.log?.targetId || props.log?.recordId }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Message -->
      <div v-if="props.log?.message" class="detail-section">
        <h6 class="section-title">
          សារបញ្ជាក់
        </h6>
        <div class="message-box">
          {{ props.log?.message }}
        </div>
      </div>

      <!-- Before / After Changes -->
      <div v-if="hasChanges" class="detail-section">
        <h6 class="section-title">
          ការផ្លាស់ប្តូរទិន្នន័យ
        </h6>

        <div class="row g-3">
          <!-- Before -->
          <div class="col-md-6">
            <div class="change-card h-100">
              <div class="change-header before">
                <i class="bi bi-arrow-left-circle me-2"></i>
                មុនពេលផ្លាស់ប្តូរ (Before)
              </div>

              <div class="change-content">
                <template v-if="parsedBefore && diffKeys.length > 0">
                  <div v-for="key in diffKeys" :key="'before-' + key" class="change-item">
                    <span class="font-monospace text-secondary">{{ key }}</span>
                    <strong :class="{ 'text-danger': isFieldChanged(key) }">
                      {{ formatFieldValue(parsedBefore?.[key]) }}
                    </strong>
                  </div>
                </template>
                <div v-else-if="parsedBefore && typeof parsedBefore !== 'object'" class="text-break font-monospace small">
                  {{ parsedBefore }}
                </div>
                <div v-else class="text-muted p-2 fst-italic">
                  <i class="bi bi-dash-circle me-1"></i>គ្មានទិន្នន័យដើម (កំណត់ត្រាថ្មី)
                </div>
              </div>
            </div>
          </div>

          <!-- After -->
          <div class="col-md-6">
            <div class="change-card h-100">
              <div class="change-header after">
                <i class="bi bi-arrow-right-circle me-2"></i>
                បន្ទាប់ពីផ្លាស់ប្តូរ (After)
              </div>

              <div class="change-content">
                <template v-if="parsedAfter && diffKeys.length > 0">
                  <div v-for="key in diffKeys" :key="'after-' + key" class="change-item">
                    <span class="font-monospace text-secondary">{{ key }}</span>
                    <strong :class="{ 'text-success': isFieldChanged(key) }">
                      {{ formatFieldValue(parsedAfter?.[key]) }}
                    </strong>
                  </div>
                </template>
                <div v-else-if="parsedAfter && typeof parsedAfter !== 'object'" class="text-break font-monospace small">
                  {{ parsedAfter }}
                </div>
                <div v-else class="text-danger p-2 fst-italic">
                  <i class="bi bi-trash me-1"></i>កំណត់ត្រាត្រូវបានលុប
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <template #footer>
      <BaseButton type="button" variant="" custom-class="btn-light px-4 bg-secondary-subtle py-2" @click="handleClose">
        បិទ
      </BaseButton>
    </template>
  </BaseModal>
</template>

<style scoped>

</style>