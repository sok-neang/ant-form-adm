<template>
  <div class="container-fluid shortlist-container">
    <!-- OPTIONAL TOP HEADER (Used in Teacher View) -->
    <div v-if="showTopHeader" class="d-flex align-items-center gap-3 mb-3">
      <button
        type="button"
        class="btn-back d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill bg-white shadow-sm border text-dark fw-semibold"
        @click="goBack"
      >
        <i class="bi bi-chevron-left small"></i>
        <span>ត្រឡប់</span>
      </button>
      <h4 class="fw-bold mb-0 text-dark">{{ topTitle }}</h4>
    </div>

    <div class="shortlist-scroll">
      <!-- LOADING STATE -->
      <div v-if="loading" class="d-flex flex-column gap-4">
        <div class="card border-0 rounded-4 shadow-sm bg-white p-4">
          <BaseSkeleton width="100%" height="160px" radius="16px" class="mb-4" />
          <BaseSkeleton width="60%" height="28px" radius="8px" class="mb-2" />
          <BaseSkeleton width="40%" height="20px" radius="8px" />
        </div>
        <div class="card border-0 rounded-4 shadow-sm bg-white p-4">
          <BaseSkeleton width="100%" height="120px" radius="12px" />
        </div>
      </div>

      <!-- MAIN DETAIL CONTENT -->
      <div v-else class="d-flex flex-column gap-4">
        <div
          class="card border-0 rounded-4 shadow-sm overflow-hidden profile-summary-card"
          :class="[
            bannerClass,
            { 'banner-blacklist-theme': isBlacklistOrDropout || computedBannerBg === bannerBlacklistBg }
          ]"
          :style="{
            backgroundImage: `url(${computedBannerBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }"
        >
          <div class="banner-top-section position-relative d-flex align-items-center justify-content-between px-3 px-sm-4 px-md-5 pt-4 pb-3">
            <div class="d-flex align-items-center gap-3 gap-md-4 min-w-0">
              <div class="banner-avatar-block position-relative flex-shrink-0">
                <div
                  class="avatar-wrapper position-relative z-2"
                  role="button"
                  @click="openAvatarPreview"
                  title="ចុចដើម្បីមើលរូបភាពធំ"
                >
                  <img
                    :src="studentAvatar || defaultAvatar"
                    alt="Student Avatar"
                    class="student-avatar object-fit-cover bg-white"
                    @error="onAvatarError"
                  />
                  <div class="avatar-hover-overlay d-flex align-items-center justify-content-center">
                    <i class="bi bi-arrows-fullscreen text-white fs-5"></i>
                  </div>
                </div>
              </div>

              <!-- Identity Info: Name, Badge, Slogan -->
              <div class="banner-identity-block d-flex flex-column min-w-0">
                <div class="d-flex align-items-baseline gap-2 flex-wrap">
                  <h2 class="banner-student-name mb-0 text-truncate">
                    {{ studentDisplayName }}
                  </h2>
                  <span v-if="studentSecondaryName" class="banner-secondary-name text-truncate">
                    ({{ studentSecondaryName }})
                  </span>
                </div>

                <!-- Status Badge Slot with Leaf Icon -->
                <div class="d-flex align-items-center gap-2 mt-2 mb-1 flex-wrap">
                  <slot name="badge" :submission="submission" :student="student">
                    <span class="badge rounded-pill px-3 py-1 fw-semibold banner-default-badge">
                      {{ programText }}
                    </span>
                  </slot>
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom Section: Contact & Study Info Strip -->
          <div class="banner-info-strip px-3 px-sm-4 px-md-5 py-3">
            <div class="row g-2 g-md-3 align-items-center info-strip-row">
              <!-- 1. Study Shift -->
              <div class="col-6 col-md-4 col-xl banner-col border-divider">
                <div class="d-flex align-items-center gap-2 info-cell">
                  <div class="banner-info-icon-box">
                    <i class="bi bi-clock"></i>
                  </div>
                  <div class="d-flex flex-column min-w-0">
                    <span class="banner-info-label">វេនសិក្សា</span>
                    <span class="banner-info-value text-truncate" :title="shiftText">{{ shiftText }}</span>
                  </div>
                </div>
              </div>

              <!-- 2. Specialization / Program -->
              <div class="col-6 col-md-4 col-xl banner-col border-divider">
                <div class="d-flex align-items-center gap-2 info-cell">
                  <div class="banner-info-icon-box">
                    <i class="bi bi-phone"></i>
                  </div>
                  <div class="d-flex flex-column min-w-0">
                    <span class="banner-info-label">ជំនាញ</span>
                    <span class="banner-info-value text-truncate" :title="programText">{{ programText }}</span>
                  </div>
                </div>
              </div>

              <!-- 3. Email -->
              <div class="col-12 col-md-4 col-xl-auto info-col-email banner-col border-divider">
                <a
                  :href="studentEmailUrl"
                  class="d-flex align-items-center gap-2 text-decoration-none info-cell contact-link"
                  :title="`ផ្ញើអ៊ីម៉ែលទៅកាន់ ${studentEmail}`"
                >
                  <div class="banner-info-icon-box">
                    <i class="bi bi-envelope"></i>
                  </div>
                  <div class="d-flex flex-column min-w-0">
                    <span class="banner-info-label">អ៊ីម៉ែល</span>
                    <span class="banner-info-value text-truncate email-text-val">{{ studentEmail }}</span>
                  </div>
                </a>
              </div>

              <!-- 4. Phone Number -->
              <div class="col-6 col-md-4 col-xl banner-col border-divider">
                <a
                  :href="studentPhoneUrl"
                  class="d-flex align-items-center gap-2 text-decoration-none info-cell contact-link"
                  :title="`ហៅទូរស័ព្ទទៅកាន់ ${studentPhone}`"
                >
                  <div class="banner-info-icon-box">
                    <i class="bi bi-telephone"></i>
                  </div>
                  <div class="d-flex flex-column min-w-0">
                    <span class="banner-info-label">លេខទូរស័ព្ទ</span>
                    <span class="banner-info-value text-truncate">{{ studentPhone }}</span>
                  </div>
                </a>
              </div>

              <!-- 5. Telegram -->
              <div class="col-6 col-md-4 col-xl banner-col">
                <a
                  :href="telegramUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="d-flex align-items-center gap-2 text-decoration-none info-cell contact-link"
                  :title="`បើក ${studentTelegram} ក្នុង Telegram`"
                >
                  <div class="banner-info-icon-box">
                    <i class="bi bi-send"></i>
                  </div>
                  <div class="d-flex flex-column min-w-0">
                    <span class="banner-info-label">តេឡេក្រាម</span>
                    <span class="banner-info-value text-truncate">{{ studentTelegram }}</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        <slot name="extra-sections" :submission="submission" :student="student"></slot>

        <div class="card border-0 rounded-4 shadow-sm bg-white p-3 p-md-4">
          <div class="d-flex align-items-center gap-2 mb-3">
            <i class="bi bi-person fs-5 text-theme-green"></i>
            <h5 class="fw-bold text-dark mb-0">ព័ត៌មានផ្ទាល់ខ្លួន</h5>
          </div>

          <div class="rounded-4 bg-light-soft border p-3 p-md-4">
            <div class="row g-3 g-md-4 personal-info-grid">
              <!-- ឈ្មោះ -->
              <div class="col-12 col-sm-6 col-lg-4">
                <div class="d-flex align-items-baseline gap-2">
                  <span class="text-muted fw-medium text-nowrap">ឈ្មោះ :</span>
                  <span class="fw-bold text-dark text-break">{{ studentKhName || "—" }}</span>
                </div>
              </div>

              <!-- ភេទ -->
              <div class="col-12 col-sm-6 col-lg-4">
                <div class="d-flex align-items-baseline gap-2">
                  <span class="text-muted fw-medium text-nowrap">ភេទ :</span>
                  <span class="fw-bold text-dark">{{ genderText || "—" }}</span>
                </div>
              </div>

              <!-- ថ្ងៃ ខែ ឆ្នាំកំណើត -->
              <div class="col-12 col-sm-6 col-lg-4">
                <div class="d-flex align-items-baseline gap-2">
                  <span class="text-muted fw-medium text-nowrap">ថ្ងៃ ខែ ឆ្នាំកំណើត :</span>
                  <span class="fw-bold text-dark">{{ dateOfBirthText || "—" }}</span>
                </div>
              </div>

              <!-- កម្រិតវប្បធម៌ -->
              <div class="col-12 col-sm-6 col-lg-4">
                <div class="d-flex align-items-baseline gap-2">
                  <span class="text-muted fw-medium text-nowrap">កម្រិតវប្បធម៌ :</span>
                  <span class="fw-bold text-dark">{{ educationLevelText || "—" }}</span>
                </div>
              </div>

              <!-- សិក្សានៅសាលា -->
              <div class="col-12 col-sm-6 col-lg-5">
                <div class="d-flex align-items-baseline gap-2">
                  <span class="text-muted fw-medium text-nowrap">សិក្សានៅសាលា :</span>
                  <span class="fw-bold text-dark text-break">{{ universityText || "—" }}</span>
                </div>
              </div>

              <!-- សិក្សាឆ្នាំទី -->
              <div class="col-12 col-sm-6 col-lg-3">
                <div class="d-flex align-items-baseline gap-2">
                  <span class="text-muted fw-medium text-nowrap">សិក្សាឆ្នាំទី :</span>
                  <span class="fw-bold text-dark">{{ yearOfStudyText || "—" }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 3. ADDRESS CARD -->
        <div class="card border-0 rounded-4 shadow-sm bg-white p-3 p-md-4">
          <div class="d-flex align-items-center gap-2 mb-3">
            <i class="bi bi-geo-alt fs-5 text-theme-green"></i>
            <h5 class="fw-bold text-dark mb-0">អាស័យដ្ឋាន</h5>
          </div>

          <div class="rounded-4 p-3 bg-light-soft border text-muted lh-base">
            {{ addressText }}
          </div>
        </div>

        <!-- 4. ATTACHED DOCUMENTS CARD -->
        <div v-if="submissionFiles.length > 0" class="card border-0 rounded-4 shadow-sm bg-white p-3 p-md-4">
          <div class="d-flex align-items-center gap-2 mb-3">
            <i class="bi bi-paperclip fs-5 text-theme-green"></i>
            <h5 class="fw-bold text-dark mb-0">ឯកសារភ្ជាប់</h5>
          </div>

          <div class="row g-3">
            <div
              v-for="file in submissionFiles"
              :key="file.id"
              class="col-12 col-md-6"
            >
              <div class="d-flex align-items-center justify-content-between p-3 rounded-4 bg-light-soft border">
                <div class="d-flex align-items-center gap-3 overflow-hidden me-2">
                  <div class="file-icon-badge rounded-3 d-flex align-items-center justify-content-center">
                    <i :class="getFileIcon(file.fileType)" class="fs-5 text-theme-green"></i>
                  </div>
                  <div class="d-flex flex-column overflow-hidden">
                    <span class="fw-bold text-dark text-truncate small">
                      {{ getFileTitle(file.fileType) }}
                    </span>
                  </div>
                </div>

                <div class="d-flex align-items-center gap-2 flex-shrink-0">
                  <button
                    type="button"
                    class="btn btn-sm btn-outline-secondary rounded-pill px-3 d-inline-flex align-items-center gap-1"
                    @click="viewFile(file)"
                    :disabled="loadingFileId === file.id"
                  >
                    <span v-if="loadingFileId === file.id" class="spinner-border spinner-border-sm me-1"></span>
                    <i v-else class="bi bi-eye"></i>
                    <span>មើល</span>
                  </button>
                  <button
                    type="button"
                    class="btn btn-sm btn-success-soft rounded-pill px-3 d-inline-flex align-items-center gap-1"
                    @click="downloadFile(file)"
                    :disabled="downloadingFileId === file.id"
                  >
                    <span v-if="downloadingFileId === file.id" class="spinner-border spinner-border-sm me-1"></span>
                    <i v-else class="bi bi-download"></i>
                    <span>ទាញយក</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 5. SUBJECT EVALUATION CARDS -->
        <div v-if="showEvaluations">
          <div
            v-for="subject in subjectEvaluationCards"
            :key="subject.key"
            class="card border-0 rounded-4 shadow-sm bg-white p-3 p-md-4 mb-4"
          >
            <!-- Subject Header -->
            <div class="d-flex align-items-center gap-2 mb-4">
              <img
                v-if="subject.logo === 'cpp'"
                :src="cppLogo"
                alt="C++ Logo"
                width="28"
                height="28"
                class="object-fit-contain"
              />
              <div v-else-if="subject.logo === 'html_css'" class="d-flex align-items-center gap-1">
                <img :src="html5Logo" alt="HTML5" width="24" height="24" class="object-fit-contain" />
                <img :src="css3Logo" alt="CSS3" width="24" height="24" class="object-fit-contain" />
              </div>
              <img
                v-else
                :src="dartLogo"
                alt="Dart Logo"
                width="26"
                height="26"
                class="object-fit-contain"
              />

              <h5 class="fw-bold mb-0 ms-1">
                {{ evaluationTitle }}
              </h5>
            </div>

            <!-- 3 Score Metric Boxes -->
            <div class="row g-3 mb-4">
              <div class="col-md-4">
                <div class="score-box p-3 rounded-4 bg-light-soft border text-center">
                  <span class="text-secondary small fw-medium d-block mb-1">Technical</span>
                  <span class="fs-4 fw-bold text-dark">
                    {{ subject.eval?.technicalScore != null ? subject.eval.technicalScore : "--" }}
                  </span>
                </div>
              </div>

              <div class="col-md-4">
                <div class="score-box p-3 rounded-4 bg-light-soft border text-center">
                  <span class="text-secondary small fw-medium d-block mb-1">Attendance</span>
                  <span class="fs-4 fw-bold text-dark">
                    {{ subject.eval?.attendanceScore != null ? subject.eval.attendanceScore : "--" }}
                  </span>
                </div>
              </div>

              <div class="col-md-4">
                <div class="score-box p-3 rounded-4 bg-light-soft border text-center">
                  <span class="text-secondary small fw-medium d-block mb-1">Average Score</span>
                  <span class="fs-4 fw-bold text-dark">
                    {{ subject.eval?.averageScore != null ? Math.round(subject.eval.averageScore) : "--" }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Comment Box -->
            <div>
              <div class="d-flex align-items-center gap-2 mb-2">
                <i class="bi bi-chat-left-text text-secondary"></i>
                <span class="fw-bold text-dark small">មតិវាយតម្លៃ</span>
              </div>
              <div class="rounded-4 p-3 bg-light-soft border text-muted lh-base small">
                {{ subject.eval?.comment || "មិនទាន់មានការវាយតម្លៃនៅឡើយទេ" }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- FOOTER ACTIONS -->
    <div v-if="showFooter" class="review-actions">
      <slot
        name="footer-actions"
        :submission="submission"
        :student="student"
        :evaluations="evaluations"
        :go-back="goBack"
      >
        <!-- Default Back Button -->
        <button type="button" class="btn btn-light border px-4" @click="goBack">
          <i class="bi bi-arrow-left me-2"></i>
          ត្រឡប់
        </button>
      </slot>
    </div>

    <!-- Teleport Full Image Preview Modal -->
    <Teleport to="body">
      <div
        v-if="previewImageUrl"
        class="modal-backdrop-custom d-flex align-items-center justify-content-center"
        @click.self="closePreview"
      >
        <div class="position-relative bg-white rounded-4 p-2 shadow-lg preview-box" @click.stop>
          <button
            type="button"
            class="btn-close position-absolute top-0 end-0 m-3 z-3 bg-white shadow-sm p-2 rounded-circle"
            @click="closePreview"
            aria-label="Close"
          ></button>
          <img
            :src="previewImageUrl || defaultAvatar"
            alt="Full Size Photo"
            class="img-fluid rounded-3 preview-img"
            @error="onPreviewImageError"
          />
        </div>
      </div>
    </Teleport>

    <!-- Slot for Page Specific Modals -->
    <slot name="modals" :submission="submission" :student="student"></slot>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import BaseSkeleton from "@/components/ui/base/BaseSkeleton.vue";
import evaluationService from "@/services/evaluation.service";
import submissionService from "@/services/submission.service";
import avatarService from "@/services/avatar.service";
import { getSubmissionFileUrl, DEFAULT_AVATAR } from "@/composable/useAvatar";

import cppLogo from "@/assets/images/teacher/cpp.svg";
import dartLogo from "@/assets/images/teacher/dart.svg";
import html5Logo from "@/assets/images/teacher/html5.svg";
import css3Logo from "@/assets/images/teacher/css3.svg";
import defaultAvatar from "@/assets/images/img/default_avatar.png";
import bannerDetailBg from "@/assets/images/img/banner_detail.png";
import bannerBlacklistBg from "@/assets/images/img/banner_blacklist.png";

const props = defineProps({
  submissionId: {
    type: [String, Number],
    default: null,
  },
  showTopHeader: {
    type: Boolean,
    default: false,
  },
  topTitle: {
    type: String,
    default: "ព័ត៌មានលម្អិត",
  },
  bannerSrc: {
    type: String,
    default: "",
  },
  bannerClass: {
    type: String,
    default: "",
  },
  evaluationTitle: {
    type: String,
    default: "លទ្ធផលវាយតម្លៃ",
  },
  showEvaluations: {
    type: Boolean,
    default: true,
  },
  showFooter: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["loaded"]);

const route = useRoute();
const router = useRouter();

// Check if current context or student represents blacklist or drop-out
const isBlacklistOrDropout = computed(() => {
  const routeName = String(route?.name || "").toLowerCase();
  const routePath = String(route?.path || "").toLowerCase();
  if (
    routeName.includes("blacklist") ||
    routeName.includes("dropout") ||
    routeName.includes("drop-out") ||
    routePath.includes("blacklist") ||
    routePath.includes("dropout") ||
    routePath.includes("drop-out")
  ) {
    return true;
  }

  const s = String(submission.value?.status || "").toUpperCase();
  if (["BLACKLIST", "BLACKLISTED", "DROPOUT", "DROP_OUT"].includes(s)) {
    return true;
  }

  if (
    submission.value?.blacklistReason ||
    submission.value?.blacklistedAt ||
    submission.value?.blacklist ||
    submission.value?.dropoutReason ||
    submission.value?.dropoutAt ||
    submission.value?.dropout
  ) {
    return true;
  }

  return false;
});

// Default banner background fallback to banner_detail.png or banner_blacklist.png
const computedBannerBg = computed(() => {
  if (props.bannerSrc) return props.bannerSrc;
  if (isBlacklistOrDropout.value) return bannerBlacklistBg;
  return bannerDetailBg;
});

// ID from prop or router params
const activeId = computed(() => {
  return props.submissionId || route.params.id || route.params.submissionId;
});

const loading = ref(true);
const submission = ref(null);
const student = ref(null);
const evaluations = ref([]);

// Photo / Avatar & Preview state
const studentAvatar = ref(defaultAvatar);
const previewImageUrl = ref(null);
const loadingFileId = ref(null);
const downloadingFileId = ref(null);

const fetchData = async () => {
  const targetId = activeId.value;
  if (!targetId) return;
  loading.value = true;
  try {
    const [evalRes, subRes] = await Promise.allSettled([
      evaluationService.getBySubmissionId(targetId),
      submissionService.getById(targetId),
    ]);

    let finalSubmission = {};
    let finalStudent = {};
    let finalEvaluations = [];

    if (subRes.status === "fulfilled") {
      let subData = subRes.value?.data?.data || subRes.value?.data;
      if (subData?.success) subData = subData.data;

      if (subData) {
        finalSubmission = { ...subData };
        finalStudent = { ...(subData.student || {}) };
        if (subData.evaluations?.length) finalEvaluations = [...subData.evaluations];
      }
    }

    if (evalRes.status === "fulfilled" && evalRes.value?.data?.success) {
      const evalData = evalRes.value.data.data;
      if (evalData) {
        if (evalData.student) finalStudent = { ...finalStudent, ...evalData.student };
        if (evalData.evaluations?.length) {
          finalEvaluations = [...evalData.evaluations];
        } else if (Array.isArray(evalData) && evalData.length > 0) {
          finalEvaluations = [...evalData];
        }
        finalSubmission = { ...evalData, ...finalSubmission };
      }
    }

    if (!finalSubmission.files && subRes.status === "fulfilled") {
      let subData = subRes.value?.data?.data || subRes.value?.data;
      if (subData?.success) subData = subData.data;
      if (subData?.files) finalSubmission.files = subData.files;
    }

    submission.value = finalSubmission;
    student.value = finalStudent;
    evaluations.value = finalEvaluations;

    // Load student photo with Bearer auth
    const photoFile = (finalSubmission.files || []).find(
      (f) => String(f.fileType).toUpperCase() === "PHOTO"
    );
    const photoPath =
      photoFile?.fileUrl ||
      photoFile?.filePath ||
      finalStudent?.avatarPath ||
      finalStudent?.photoUrl;

    if (photoPath) {
      try {
        const url = await getSubmissionFileUrl(photoPath);
        if (!url || url === DEFAULT_AVATAR) {
          studentAvatar.value = defaultAvatar;
        } else {
          studentAvatar.value = url;
        }
      } catch (err) {
        console.warn("Failed to load student photo:", err);
        studentAvatar.value = defaultAvatar;
      }
    } else {
      studentAvatar.value = defaultAvatar;
    }

    emit("loaded", {
      submission: finalSubmission,
      student: finalStudent,
      evaluations: finalEvaluations,
    });
  } catch (err) {
    console.error("Failed to load student detail:", err);
  } finally {
    loading.value = false;
  }
};

// Filter out CV/Resume from attached files
const submissionFiles = computed(() => {
  return (submission.value?.files || []).filter((file) => {
    const type = String(file.fileType || "").toUpperCase();
    const name = String(file.originalFilename || "").toLowerCase();
    const path = String(file.filePath || file.fileUrl || "").toLowerCase();
    if (type === "CV" || type.includes("CV") || type === "RESUME" || type.includes("RESUME")) {
      return false;
    }
    if (name.includes("cv") || name.includes("resume")) {
      return false;
    }
    if (path.includes("/cv") || path.includes("_cv") || path.includes("resume")) {
      return false;
    }
    return true;
  });
});

const onAvatarError = (e) => {
  e.target.src = defaultAvatar;
  studentAvatar.value = defaultAvatar;
};

const onPreviewImageError = (e) => {
  e.target.src = defaultAvatar;
};

const openAvatarPreview = () => {
  const current = studentAvatar.value;
  if (!current || current === DEFAULT_AVATAR || current === defaultAvatar) {
    previewImageUrl.value = defaultAvatar;
  } else {
    previewImageUrl.value = current;
  }
};

const closePreview = () => {
  previewImageUrl.value = null;
};

const getFileIcon = (fileType) => {
  const type = String(fileType || "").toUpperCase();
  if (type === "PHOTO") return "bi bi-image";
  if (type === "TRANSCRIPT") return "bi bi-file-earmark-text";
  return "bi bi-file-earmark";
};

const getFileTitle = (fileType) => {
  const type = String(fileType || "").toUpperCase();
  if (type === "PHOTO") return "រូបថត ៤x៦ (Photo)";
  if (type === "TRANSCRIPT") return "ព្រឹត្តិបត្រពិន្ទុ (Transcript)";
  return fileType || "ឯកសារ";
};

const getFileExtension = (file) => {
  const path = String(file?.originalFilename || file?.filePath || file?.fileUrl || "");
  const match = path.match(/\.([a-zA-Z0-9]+)(?:\?.*)?$/);
  if (match) return match[1].toLowerCase();
  const type = String(file?.fileType || "").toUpperCase();
  if (type === "PHOTO") return "jpg";
  if (type === "TRANSCRIPT") return "pdf";
  return "pdf";
};

const getCustomFileName = (file) => {
  const ext = getFileExtension(file);
  const type = String(file?.fileType || "").toUpperCase();
  const rawName = student.value?.khName || student.value?.enName || submission.value?.name || "";
  const cleanName = rawName.trim().replace(/\s+/g, "_");

  let docLabel = "Document";
  if (type === "PHOTO") {
    docLabel = "Photo_4x6";
  } else if (type === "TRANSCRIPT") {
    docLabel = "Transcript";
  } else if (type === "CV" || type === "RESUME") {
    docLabel = "CV";
  } else if (file?.fileType) {
    docLabel = String(file.fileType).replace(/\s+/g, "_");
  }

  if (cleanName) {
    return `${docLabel}_${cleanName}.${ext}`;
  }
  return `${docLabel}.${ext}`;
};

const formatFileSize = (bytes) => {
  if (!bytes) return "0 KB";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const viewFile = async (file) => {
  const path = file.filePath || file.fileUrl;
  const isImage =
    file.mimeType?.startsWith("image/") ||
    /\.(jpe?g|png|webp|gif)$/i.test(path || "") ||
    String(file.fileType).toUpperCase() === "PHOTO";

  if (!path) {
    if (isImage) {
      previewImageUrl.value = defaultAvatar;
    }
    return;
  }

  loadingFileId.value = file.id;
  try {
    const url = await getSubmissionFileUrl(path);
    if (isImage) {
      previewImageUrl.value = (!url || url === DEFAULT_AVATAR) ? defaultAvatar : url;
    } else {
      window.open(url, "_blank");
    }
  } catch (err) {
    console.error("Failed to view file:", err);
    if (isImage) {
      previewImageUrl.value = defaultAvatar;
    }
  } finally {
    loadingFileId.value = null;
  }
};

const downloadFile = async (file) => {
  const path = file.filePath || file.fileUrl;
  if (!path) return;
  downloadingFileId.value = file.id;
  try {
    const blob = await avatarService.getSubmissionFileBlob(path);
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = getCustomFileName(file);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
  } catch (err) {
    console.error("Failed to download file:", err);
  } finally {
    downloadingFileId.value = null;
  }
};

const studentKhName = computed(() => {
  return student.value?.khName || student.value?.enName || submission.value?.name || "-";
});

const studentDisplayName = computed(() => {
  return student.value?.enName || student.value?.khName || submission.value?.name || "Student";
});

const studentSecondaryName = computed(() => {
  if (student.value?.enName && student.value?.khName && student.value.enName !== student.value.khName) {
    return student.value.khName;
  }
  return null;
});

const programText = computed(() => {
  const p = submission.value?.program;
  if (p === "MOBILE_APP") return "Mobile App";
  if (p === "WEB_DEVELOPMENT") return "Web Development";
  return p || "-";
});

const shiftText = computed(() => {
  const s = submission.value?.shift;
  if (s === "MORNING") return "វេនព្រឹក";
  if (s === "AFTERNOON") return "វេនរសៀល";
  return s || "-";
});

const studentEmail = computed(() => {
  return student.value?.email || "-";
});

const studentEmailUrl = computed(() => {
  const email = student.value?.email;
  return email ? `mailto:${email}` : undefined;
});

const studentPhone = computed(() => {
  return student.value?.phone || student.value?.phoneNumber || "-";
});

const studentPhoneUrl = computed(() => {
  const raw = student.value?.phone || student.value?.phoneNumber || "";
  const clean = String(raw).replace(/[^\d+]/g, "");
  return clean ? `tel:${clean}` : undefined;
});

const studentTelegram = computed(() => {
  const tg = student.value?.telegramUsername || student.value?.telegramPhone || student.value?.phone;
  if (!tg) return "-";
  return tg.startsWith("@") ? tg : `@${tg}`;
});

const telegramUrl = computed(() => {
  const raw = student.value?.telegramUsername || student.value?.telegramPhone || student.value?.phone;
  if (!raw) return undefined;
  const clean = String(raw).replace(/^@/, "").trim();
  return `https://t.me/${clean}`;
});

const genderText = computed(() => {
  const g = student.value?.gender;
  if (g === "FEMALE") return "ស្រី";
  if (g === "MALE") return "ប្រុស";
  return g || "-";
});

const dateOfBirthText = computed(() => {
  const dob = student.value?.birthDate || student.value?.dateOfBirth;
  if (!dob) return "-";
  try {
    const d = new Date(dob);
    if (isNaN(d.getTime())) return dob;
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return dob;
  }
});

const educationLevelText = computed(() => {
  const lvl = submission.value?.educationLevel || student.value?.educationLevel;
  if (lvl === "BACHELOR") return "បរិញ្ញាបត្រ";
  if (lvl === "ASSOCIATE") return "បរិញ្ញាបត្ររង";
  if (lvl === "HIGH_SCHOOL") return "មធ្យមសិក្សាទុតិយភូមិ";
  if (lvl === "MASTER") return "បរិញ្ញាបត្រជាន់ខ្ពស់";
  return lvl || "-";
});

const universityText = computed(() => {
  return (
    student.value?.university?.name ||
    student.value?.university?.code ||
    student.value?.university ||
    "-"
  );
});

const yearOfStudyText = computed(() => {
  const y = submission.value?.yearOfStudy || student.value?.yearOfStudy;
  if (y === "YEAR_1") return "1";
  if (y === "YEAR_2") return "2";
  if (y === "YEAR_3") return "3";
  if (y === "YEAR_4") return "4";
  return y || "-";
});

const addressText = computed(() => {
  return (
    student.value?.currentAddress ||
    student.value?.address ||
    student.value?.permanentAddress ||
    "-"
  );
});

// Subject evaluation cards based on program
const subjectEvaluationCards = computed(() => {
  const program = submission.value?.program || "WEB_DEVELOPMENT";
  let required = [];
  if (program === "MOBILE_APP") {
    required = [
      { key: "CPP", name: "C++", logo: "cpp" },
      { key: "DART", name: "Dart", logo: "dart" },
    ];
  } else {
    required = [
      { key: "CPP", name: "C++", logo: "cpp" },
      { key: "HTML_CSS", name: "HTML & CSS", logo: "html_css" },
    ];
  }

  return required.map((req) => {
    const match = evaluations.value.find((e) => {
      const s = (e.subject || "").toUpperCase();
      if (s === req.key) return true;
      if (req.key === "CPP" && (s.includes("CPP") || s === "C++")) return true;
      if (req.key === "DART" && s.includes("DART")) return true;
      if (req.key === "HTML_CSS" && (s.includes("HTML") || s.includes("CSS"))) return true;
      return false;
    });

    return {
      ...req,
      eval: match || null,
    };
  });
});

const goBack = () => {
  router.back();
};

defineExpose({
  submission,
  student,
  evaluations,
  loading,
  fetchData,
  goBack,
});

onMounted(() => {
  fetchData();
});
</script>

<style scoped>

.shortlist-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  padding: 10px 0;
}

.shortlist-scroll {
  padding: 0 0 16px 0;
}

/* FOOTER ACTIONS */
.review-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 14px 16px;
  margin-top: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  position: sticky;
  bottom: 16px;
  z-index: 20;
}

.blacklist-btn,
.reject-btn {
  color: #e53e3e;
  border: 1px solid #e53e3e;
  background: rgba(229, 62, 62, 0.05);
}

.blacklist-btn:hover,
.reject-btn:hover {
  color: #ffffff;
  background: #e53e3e;
}

.shortlist-btn {
  border: 1px solid #357867;
}

.shortlist-btn:hover {
  background-color: #2e6658 !important;
}

.btn-back {
  border-color: #e2e8f0;
  transition: all 0.2s ease;
  height: 38px;
}

.btn-back:hover {
  background-color: #f1f5f9 !important;
  color: #0f172a !important;
}

.btn-outline-secondary{
  border: 1px solid #FFB31F !important;
  color: #FFB31F !important;
}

.btn-outline-secondary:hover{
  background-color: #FFB31F !important;
  color: #ffffff !important;
}

/* PROFILE BANNER CARD */
.profile-summary-card {
  border-radius: 20px;
  background-color: #eaf5f0;
  box-shadow: 0 6px 24px rgba(18, 53, 43, 0.08);
  position: relative;
}

.banner-top-section {
  min-height: 165px;
}

/* AVATAR BLOCK & DECORATIONS */
.banner-avatar-block {
  padding-top: 14px;
}

.banner-student-tag {
  position: absolute;
  top: -6px;
  left: -10px;
  transform: rotate(-14deg);
  font-family: "Caveat", "Segoe Script", "Brush Script MT", cursive;
  font-size: 1.7rem;
  font-weight: 700;
  color: #ffffff;
  text-shadow: 0 2px 6px rgba(0, 35, 25, 0.45);
  line-height: 1;
  pointer-events: none;
  user-select: none;
  z-index: 5;
}

.student-tag-stroke {
  width: 52px;
  height: 7px;
  display: block;
  margin-top: -3px;
  filter: drop-shadow(0 1px 3px rgba(0, 35, 25, 0.3));
}

.student-avatar {
  width: 120px;
  height: 146px;
  border: 4px solid #ffffff;
  border-radius: 18px;
  display: block;
  box-shadow: 0 6px 20px rgba(10, 45, 35, 0.12);
}

.avatar-wrapper {
  position: relative;
  cursor: pointer;
  display: inline-block;
  border-radius: 18px;
  overflow: hidden;
}

.avatar-hover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 18px;
  background-color: rgba(0, 0, 0, 0.4);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.avatar-wrapper:hover .avatar-hover-overlay {
  opacity: 1;
}

.avatar-status-dot {
  position: absolute;
  bottom: 2px;
  right: -3px;
  width: 18px;
  height: 18px;
  background-color: #22c55e;
  border: 3.5px solid #ffffff;
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  z-index: 4;
}

/* IDENTITY BLOCK */
.banner-student-name {
  font-size: 1.85rem;
  font-weight: 800;
  color: #07261d;
  letter-spacing: -0.01em;
  line-height: 1.2;
}

.banner-secondary-name {
  font-size: 1.05rem;
  font-weight: 700;
  color: #1a4537;
}

.banner-default-badge {
  background-color: rgba(255, 255, 255, 0.9);
  color: #123e32;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.banner-quote {
  font-style: italic;
  color: #174235;
  font-size: 0.95rem;
  font-weight: 600;
}

/* ARTISTIC QUOTE (Top Right) */
.banner-artistic-quote-wrapper {
  user-select: none;
  pointer-events: none;
}

.banner-artistic-quote {
  font-family: "Caveat", "Segoe Script", "Brush Script MT", cursive;
  font-size: 1.95rem;
  line-height: 1.05;
  color: #205c49;
  font-weight: 700;
  transform: rotate(-8deg);
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-right: 12px;
  margin-top: -6px;
}

.banner-brush-stroke {
  width: 120px;
  height: 8px;
  margin-top: -4px;
}

/* INFO STRIP AT BOTTOM */
.banner-info-strip {
  border-top: 1px solid rgba(255, 255, 255, 0.9);
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 -2px 10px rgba(10, 40, 30, 0.03);
}

.banner-info-icon-box {
  width: 38px;
  height: 38px;
  background: #ffffff73;
  border: 1px solid rgba(34, 110, 90, 0.18);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1d6e57;
  font-size: 1.1rem;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(18, 53, 43, 0.07);
}

.banner-info-label {
  font-size: 0.78rem;
  color: #315e51;
  font-weight: 600;
  line-height: 1.2;
}

.banner-info-value {
  font-size: 0.9rem;
  font-weight: 600;
  color: #082920;
  line-height: 1.25;
}

.info-cell {
  min-width: 0;
}

@media (min-width: 1200px) {
  .border-divider {
    border-right: 1px solid rgba(46, 125, 107, 0.18);
    padding-right: 12px;
  }
}

@media (max-width: 1199.98px) and (min-width: 768px) {
  .border-divider:nth-child(1),
  .border-divider:nth-child(2) {
    border-right: 1px solid rgba(46, 125, 107, 0.18);
  }
}

/* Blacklist & Dropout Theme for Profile Banner */
.profile-summary-card.banner-blacklist-theme {
  background-color: #fef2f2;
  box-shadow: 0 6px 24px rgba(220, 38, 38, 0.08);
}

.profile-summary-card.banner-blacklist-theme .banner-student-name {
  color: #450a0a;
}

.profile-summary-card.banner-blacklist-theme .banner-secondary-name {
  color: #7f1d1d;
}

.profile-summary-card.banner-blacklist-theme .banner-default-badge {
  color: #991b1b;
}

.profile-summary-card.banner-blacklist-theme .banner-info-icon-box {
  border-color: rgba(220, 38, 38, 0.2);
  color: #dc2626;
  box-shadow: 0 2px 6px rgba(220, 38, 38, 0.07);
}

.profile-summary-card.banner-blacklist-theme .banner-info-label {
  color: #991b1b;
}

.profile-summary-card.banner-blacklist-theme .banner-info-value {
  color: #450a0a;
}

@media (min-width: 1200px) {
  .profile-summary-card.banner-blacklist-theme .border-divider {
    border-right-color: rgba(220, 38, 38, 0.18);
  }
}

@media (max-width: 1199.98px) and (min-width: 768px) {
  .profile-summary-card.banner-blacklist-theme .border-divider:nth-child(1),
  .profile-summary-card.banner-blacklist-theme .border-divider:nth-child(2) {
    border-right-color: rgba(220, 38, 38, 0.18);
  }
}

/* MODAL PREVIEW */
.modal-backdrop-custom {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(4px);
  z-index: 1050;
}

.preview-box {
  max-width: 90vw;
  max-height: 90vh;
  min-width: 220px;
  min-height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-img {
  max-width: 85vw;
  max-height: 80vh;
  min-width: 180px;
  min-height: 180px;
  object-fit: contain;
}

.file-icon-badge {
  width: 44px;
  height: 44px;
  background-color: #ecfdf5;
  flex-shrink: 0;
}

.btn-success-soft {
  background-color: #ecfdf5;
  color: var(--bs-primary);
  border: 1px solid var(--bs-primary);
  transition: all 0.2s ease;
}

.btn-success-soft:hover {
  background-color: var(--bs-primary);
  color: #ffffff;
}

/* LIGHT SOFT BACKGROUND FOR BOXES */
.bg-light-soft {
  background-color: #fafafac8;
}

/* SCORE BOXES */
.score-box {
  border: 1px solid #f1f5f9;
  transition: transform 0.2s ease;
}

.score-box:hover {
  transform: translateY(-2px);
}

.info-icons-row {
  border-color: #f1f5f9 !important;
}

.text-theme-green {
  color: #2e7d6b !important;
}

.contact-link {
  transition: all 0.2s ease;
  border-radius: 8px;
  padding: 2px 4px;
  margin: -2px -4px;
}

.contact-link:hover{
  background-color: #efefef5d;
}

.contact-link:hover .contact-val {
  color: #2e7d6b !important;
  text-decoration: underline;
}

/* RESPONSIVE ENHANCEMENTS */
.email-text-val {
  max-width: 240px;
}

.min-w-0 {
  min-width: 0 !important;
}

@media (min-width: 1200px) {
  .info-col-email {
    max-width: 310px;
  }
}

@media (max-width: 991.98px) {
  .email-text-val {
    max-width: 100%;
  }
}

@media (max-width: 767.98px) {
  .banner-top-section {
    padding-top: 14px !important;
    padding-bottom: 12px !important;
  }
  .banner-avatar-block {
    padding-top: 10px;
  }
  .student-avatar {
    width: 96px;
    height: 120px;
    border-width: 3px;
    border-radius: 14px;
  }
  .avatar-wrapper {
    border-radius: 14px;
  }
  .banner-student-name {
    font-size: 1.35rem;
  }
  .banner-student-tag {
    font-size: 1.3rem;
    top: -5px;
    left: -6px;
  }
  .student-tag-stroke {
    width: 42px;
  }
  .banner-quote {
    font-size: 0.85rem;
  }
  .banner-info-strip {
    padding-top: 10px !important;
    padding-bottom: 10px !important;
  }
  .banner-info-icon-box {
    width: 32px;
    height: 32px;
    font-size: 0.95rem;
    border-radius: 8px;
  }
  .banner-info-label {
    font-size: 0.7rem;
  }
  .banner-info-value {
    font-size: 0.8rem;
  }
  .email-text-val {
    max-width: 100%;
  }
}
</style>
