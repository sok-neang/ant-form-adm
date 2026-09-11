<template>
  <DetailStudent :banner-src="bannerBlacklistBg">
    <!-- Badge -->
    <template #badge>
      <span class="badge rounded-pill px-3 py-2 fw-semibold" style="background-color: #fee2e2; color: #dc2626; font-size: 0.85rem;">
        បោះបង់
      </span>
    </template>

    <!-- Dropout Reason Card -->
    <template #extra-sections="{ submission }">
      <div class="card border-0 rounded-4 shadow-sm bg-white p-4">
        <div class="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
          <div class="d-flex align-items-center gap-2">
            <div class="rounded-3 d-flex align-items-center justify-content-center">
              <i class="bi bi-person-dash fs-5 text-danger"></i>
            </div>
            <h5 class="fw-bold text-dark mb-0">មូលហេតុនៃការបោះបង់</h5>
          </div>
          <span v-if="getDropoutDate(submission)" class="text-muted small">
            <i class="bi bi-calendar-event me-1"></i>{{ getDropoutDate(submission) }}
          </span>
        </div>

        <div class="rounded-4 p-4 dropout-reason-box">
          <div class="d-flex align-items-start gap-3">
            <div class="flex-grow-1">
              <div class="fw-bold text-danger mb-1">មូលហេតុ (Reason)</div>
              <p class="mb-0 text-dark lh-base fs-6">
                {{ getDropoutReason(submission) || "មិនមានការបញ្ជាក់ពីមូលហេតុជាក់លាក់នោះទេ" }}
              </p>
              <div v-if="getDropoutNote(submission)" class="mt-3 pt-3 border-top border-danger-subtle">
                <span class="fw-semibold text-secondary small d-block mb-1">កំណត់ចំណាំបន្ថែម (Note):</span>
                <span class="text-muted small">{{ getDropoutNote(submission) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Footer Actions -->
    <template #footer-actions="{ goBack }">
      <button type="button" class="btn btn-light border px-4" @click="goBack">
        <i class="bi bi-arrow-left me-2"></i>
        ត្រឡប់
      </button>

      <div class="d-flex align-items-center gap-2">
        <span class="badge bg-danger-subtle text-danger px-3 py-2 rounded-pill">
          <i class="bi bi-person-dash me-1"></i>សិស្សនេះបានបោះបង់
        </span>
      </div>
    </template>
  </DetailStudent>
</template>

<script setup>
import DetailStudent from "@/components/ui/detailStudent.vue";
import bannerBlacklistBg from "@/assets/images/img/banner_blacklist.png";

const getDropoutReason = (submission) => {
  return (
    submission?.dropoutReason ||
    submission?.reason ||
    submission?.statusReason ||
    submission?.rejectReason ||
    submission?.rejectionReason ||
    submission?.dropout?.reason ||
    submission?.narrative?.reason ||
    submission?.comments ||
    ""
  );
};

const getDropoutNote = (submission) => {
  return (
    submission?.dropoutNote ||
    submission?.note ||
    submission?.notes ||
    submission?.dropout?.note ||
    ""
  );
};

const getDropoutDate = (submission) => {
  const d = submission?.dropoutAt || submission?.updatedAt || submission?.createdAt;
  if (!d) return "";
  try {
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return d;
    return dt.toLocaleDateString("km-KH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return d;
  }
};
</script>

<style scoped>
.dropout-reason-box {
  background-color: #fef2f2;
  border: 1px solid #fecaca;
}
</style>
