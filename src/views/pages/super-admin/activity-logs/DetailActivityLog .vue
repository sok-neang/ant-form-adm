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
          <p class="text-muted mb-0">
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
              <span class="value text-primary">
                {{ props.log?.targetTable || props.log?.tableName }}
              </span>
            </div>
          </div>

          <div v-if="props.log?.targetId || props.log?.recordId" class="col-md-6">
            <div class="info-card">
              <span class="label">លេខសម្គាល់កំណត់ត្រា (Record ID)</span>
              <span class="value text-muted small">
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