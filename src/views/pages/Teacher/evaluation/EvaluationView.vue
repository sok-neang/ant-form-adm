<template>
  <div class="container-fluid evaluation-page py-3">
    <!-- TOP HEADER / BACK BUTTON -->
    <div class="d-flex align-items-center gap-3 mb-4">
      <button
        type="button"
        class="btn-back d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill bg-white shadow-sm border text-dark fw-semibold"
        @click="goBack"
      >
        <i class="bi bi-chevron-left small"></i>
        <span>ត្រឡប់</span>
      </button>
      <h3 class="fw-bold mb-0 text-dark title-kh">ការវាយតម្លៃ</h3>
    </div>

    <!-- LOADING STATE -->
    <div v-if="loading" class="row g-4">
      <div class="col-lg-7 col-xl-8">
        <div class="card border-0 rounded-4 shadow-sm bg-white p-4">
          <BaseSkeleton width="100%" height="45px" radius="8px" class="mb-4" />
          <BaseSkeleton width="100%" height="56px" radius="12px" class="mb-4" />
          <BaseSkeleton width="100%" height="56px" radius="12px" class="mb-4" />
          <BaseSkeleton width="100%" height="110px" radius="12px" class="mb-4" />
          <BaseSkeleton width="100%" height="48px" radius="12px" />
        </div>
      </div>
      <div class="col-lg-5 col-xl-4">
        <div class="card border-0 rounded-4 shadow-sm bg-white p-4 mb-4">
          <BaseSkeleton width="100%" height="160px" radius="12px" />
        </div>
        <div class="card border-0 rounded-4 shadow-sm bg-white p-4 mb-4">
          <BaseSkeleton width="100%" height="140px" radius="12px" />
        </div>
        <div class="card border-0 rounded-4 shadow-sm bg-white p-4">
          <BaseSkeleton width="100%" height="180px" radius="16px" />
        </div>
      </div>
    </div>

    <!-- MAIN EVALUATION CONTENT -->
    <div v-else class="row g-4">
      <!-- LEFT COLUMN: EVALUATION FORM -->
      <div class="col-lg-7 col-xl-8">
        <div class="card border-0 rounded-4 shadow-sm bg-white p-4 p-md-5 h-100">
          <!-- SUBJECT TABS (50/50 SPLIT) -->
          <div class="subject-tabs-container d-flex align-items-center mb-4 border-bottom">
            <button
              v-for="tab in subjectTabs"
              :key="tab.key"
              type="button"
              class="subject-tab-btn flex-fill d-flex align-items-center justify-content-center gap-2 pb-3 bg-transparent border-0 position-relative"
              :class="{ active: activeSubject === tab.key }"
              @click="activeSubject = tab.key"
            >
              <!-- C++ Icon -->
              <span v-if="tab.logo === 'cpp'" class="tab-icon d-inline-flex align-items-center">
                <img :src="cppLogo" alt="C++" width="28" height="28" class="object-fit-contain" />
              </span>

              <!-- HTML & CSS Icon -->
              <span v-else-if="tab.logo === 'html_css'" class="tab-icon d-inline-flex align-items-center gap-1">
                <img :src="html5Logo" alt="HTML5" width="24" height="24" class="object-fit-contain" />
                <img :src="css3Logo" alt="CSS3" width="24" height="24" class="object-fit-contain" />
              </span>

              <!-- Dart Icon -->
              <span v-else class="tab-icon d-inline-flex align-items-center">
                <img :src="dartLogo" alt="Dart" width="26" height="26" class="object-fit-contain" />
              </span>

              <span class="tab-name fw-bold">{{ tab.name }}</span>
            </button>
          </div>

          <!-- TECHNICAL SCORE INPUT -->
          <div class="mb-4">
            <label class="form-label fw-bold text-dark fs-6 mb-2">
              ថ្នាក់រៀន (Technical Score)
            </label>
            <input
              v-model="currentForm.technicalScore"
              type="text"
              inputmode="decimal"
              class="form-control form-control-score fw-bold"
              placeholder="100"
              @input="handleScoreInput('technicalScore', $event)"
            />
          </div>

          <!-- ATTENDANCE SCORE INPUT -->
          <div class="mb-4">
            <label class="form-label fw-bold text-dark fs-6 mb-2">
              វត្តមាន (Attendance Score)
            </label>
            <input
              v-model="currentForm.attendanceScore"
              type="text"
              inputmode="decimal"
              class="form-control form-control-score fw-bold"
              placeholder="100"
              @input="handleScoreInput('attendanceScore', $event)"
            />
          </div>

          <!-- COMMENT / FEEDBACK TEXTAREA -->
          <div class="mb-3">
            <label class="form-label fw-bold text-dark fs-6 mb-2 d-flex align-items-center gap-2">
              <i class="bi bi-chat-left-text text-muted"></i>
              <span>មតិយោបល់</span>
              <span class="text-danger">*</span>
            </label>
            <textarea
              v-model="currentForm.comment"
              rows="3"
              class="form-control form-control-comment"
              placeholder="បញ្ចូលមតិយោបល់..."
            ></textarea>
          </div>

          <!-- QUICK INSERT TAG PILLS -->
          <div class="quick-tags-box mb-4">
            <!-- Positive Tags (Mint Green) -->
            <div class="d-flex flex-wrap gap-2 mb-2">
              <button
                v-for="tag in positiveTags"
                :key="tag"
                type="button"
                class="tag-pill tag-pill-positive"
                @click="addQuickTag(tag)"
              >
                {{ tag }}
              </button>
            </div>

            <!-- Constructive / Improvement Tags (Soft Pink/Red) -->
            <div class="d-flex flex-wrap gap-2">
              <button
                v-for="tag in constructiveTags"
                :key="tag"
                type="button"
                class="tag-pill tag-pill-warning"
                @click="addQuickTag(tag)"
              >
                {{ tag }}
              </button>
            </div>
          </div>

          <!-- SUBMIT EVALUATION BUTTON -->
          <button
            type="button"
            class="btn btn-submit-eval w-100 py-3 rounded-3 fw-bold text-white d-flex align-items-center justify-content-center gap-2"
            :disabled="submitting"
            @click="handleSubmit"
          >
            <span v-if="submitting" class="spinner-border spinner-border-sm" role="status"></span>
            <span class="fs-6">បញ្ជូនការវាយតម្លៃ</span>
          </button>
        </div>
      </div>

      <!-- RIGHT COLUMN: STUDENT DETAILS & SUMMARY CARDS -->
      <div class="col-lg-5 col-xl-4">
        <div class="d-flex flex-column gap-4">
          <!-- 1. STUDENT PROFILE CARD -->
          <div class="card border-0 rounded-4 shadow-sm bg-white p-4">
            <div class="d-flex align-items-center gap-3 mb-4">
              <img
                :src="studentAvatar"
                alt="Student Avatar"
                width="50"
                height="50"
                class="rounded-circle object-fit-cover shadow-sm bg-light"
              />
              <h5 class="fw-bold mb-0 text-dark">
                {{ studentDisplayName }}
              </h5>
            </div>

            <div class="student-info-list d-flex flex-column gap-3">
              <div class="d-flex justify-content-between align-items-center">
                <span class="text-muted fw-medium">ជំនាញ</span>
                <span class="fw-bold text-dark">{{ studentSpecialization }}</span>
              </div>
              <div class="d-flex justify-content-between align-items-center">
                <span class="text-muted fw-medium">ភេទ</span>
                <span class="fw-bold text-dark">{{ studentGender }}</span>
              </div>
              <div class="d-flex justify-content-between align-items-center">
                <span class="text-muted fw-medium">សាកលវិទ្យាល័យ</span>
                <span class="fw-bold text-dark">{{ studentUniversity }}</span>
              </div>
              <div class="d-flex justify-content-between align-items-center">
                <span class="text-muted fw-medium">ឆ្នាំទី</span>
                <span class="fw-bold text-dark">{{ studentYear }}</span>
              </div>
            </div>
          </div>

          <!-- 2. SCORE SUMMARY CARD -->
          <div class="card border-0 rounded-4 shadow-sm bg-white p-4">
            <h5 class="fw-bold text-dark mb-4">សង្ខេបពិន្ទុសរុប</h5>

            <!-- Average Technical Score -->
            <div class="mb-4">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <span class="fw-semibold text-secondary small">Average Technical Score</span>
                <span class="fw-bold text-dark fs-6">{{ liveScores.avgTech || 0 }}</span>
              </div>
              <div class="progress score-progress-bar">
                <div
                  class="progress-bar bg-tech-bar"
                  role="progressbar"
                  :style="{ width: `${Math.min(100, liveScores.avgTech || 0)}%` }"
                ></div>
              </div>
            </div>

            <!-- Average Attendance Score -->
            <div>
              <div class="d-flex justify-content-between align-items-center mb-2">
                <span class="fw-semibold text-secondary small">Average Attendance Score</span>
                <span class="fw-bold text-dark fs-6">{{ liveScores.avgAtt || 0 }}</span>
              </div>
              <div class="progress score-progress-bar">
                <div
                  class="progress-bar bg-att-bar"
                  role="progressbar"
                  :style="{ width: `${Math.min(100, liveScores.avgAtt || 0)}%` }"
                ></div>
              </div>
            </div>
          </div>

          <!-- 3. OVERALL AVERAGE SCORE BANNER CARD -->
          <div class="card border-0 rounded-4 shadow-sm overflow-hidden overall-banner-card position-relative">
            <img
              :src="bannerBg"
              alt="Overall Score Background"
              class="banner-bg-img position-absolute top-0 start-0 w-100 h-100 object-fit-cover"
            />
            <div class="banner-overlay position-relative p-4 text-center d-flex flex-column align-items-center justify-content-center h-100">
              <h5 class="fw-bold banner-title mb-2">ពិន្ទុសរុបជាមធ្យម</h5>
              <div class="banner-score fw-bolder">
                {{ liveScores.overall }}/100
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import BaseSkeleton from "@/components/ui/base/BaseSkeleton.vue";
import { useEvaluationForm } from "@/composable/evaluation/useEvaluationForm";
import bannerBg from "@/assets/images/teacher/bg_overall_avg_score.png";
import cppLogo from "@/assets/images/teacher/cpp.svg";
import dartLogo from "@/assets/images/teacher/dart.svg";
import html5Logo from "@/assets/images/teacher/html5.svg";
import css3Logo from "@/assets/images/teacher/css3.svg";

const route = useRoute();
const router = useRouter();
const submissionId = route.params.submissionId;

const {
  loading,
  submitting,
  submission,
  student,
  activeSubject,
  subjectTabs,
  currentForm,
  liveScores,
  fetchEvaluationData,
  addQuickTag,
  submitEvaluation,
} = useEvaluationForm(submissionId);

// Pre-defined quick tag lists from mockup
const positiveTags = [
  "+ គោរពវិន័យបានល្អ",
  "+ ឆាប់យល់ មានទំនួលខុសត្រូវ",
  "+ ចូលរៀនទៀងទាត់",
  "+ សកម្មភាពក្នុងថ្នាក់ល្អ",
  "+ ខិតខំព្យាយាម",
  "+ សិស្សពូកែ",
];

const constructiveTags = [
  "+ ខ្វះការចូលរួម",
  "+ មិនសូវចាប់បាន",
  "+ សិស្សខ្សោយ",
  "+ មិនគោរពវិន័យ",
  "+ ចូលរៀនមិនទៀងទាត់",
];

// Student info display helpers
const studentDisplayName = computed(() => {
  return student.value?.khName || student.value?.enName || submission.value?.name || "-";
});

const studentAvatar = computed(() => {
  return student.value?.avatarPath || "/src/assets/images/img/profile.webp";
});

const studentSpecialization = computed(() => {
  const p = submission.value?.program;
  if (p === "MOBILE_APP") return "Mobile App";
  if (p === "WEB_DEVELOPMENT") return "Web Development";
  return p || "-";
});

const studentGender = computed(() => {
  const g = student.value?.gender;
  if (g === "FEMALE") return "ស្រី";
  if (g === "MALE") return "ប្រុស";
  return g || "-";
});

const studentUniversity = computed(() => {
  return student.value?.university?.name || student.value?.university?.code || student.value?.university || "-";
});

const studentYear = computed(() => {
  const y = submission.value?.yearOfStudy || student.value?.yearOfStudy;
  if (!y) return "-";
  if (y === "YEAR_1" || y === 1 || y === "1") return "១";
  if (y === "YEAR_2" || y === 2 || y === "2") return "២";
  if (y === "YEAR_3" || y === 3 || y === "3") return "៣";
  if (y === "YEAR_4" || y === 4 || y === "4") return "៤";
  if (y === "YEAR_5" || y === 5 || y === "5") return "៥";
  return String(y).replace(/^YEAR_?/i, "");
});

const handleScoreInput = (field, event) => {
  let val = event.target.value;
  // Allow only digits and at most one decimal point
  val = val.replace(/[^0-9.]/g, "");
  const parts = val.split(".");
  if (parts.length > 2) {
    val = parts[0] + "." + parts.slice(1).join("");
  }
  // Cap at 100
  if (parseFloat(val) > 100) {
    val = "100";
  }
  currentForm.value[field] = val;
};

const goBack = () => {
  router.push({ name: "student-lists" });
};

const handleSubmit = async () => {
  await submitEvaluation();
};

onMounted(() => {
  fetchEvaluationData();
});
</script>

<style scoped>
.evaluation-page {
  max-width: 1400px;
  margin: 0 auto;
}

/* Remove number spinners */
.form-control-score::-webkit-inner-spin-button,
.form-control-score::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.form-control-score {
  -moz-appearance: textfield;
  appearance: textfield;
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

.title-kh {
  color: #1e293b;
  letter-spacing: -0.2px;
}

/* SUBJECT TABS (50/50 SPLIT) */
.subject-tabs-container {
  width: 100%;
}

.subject-tab-btn {
  flex: 1 1 50%;
  width: 50%;
  color: #64748b;
  position: relative;
  transition: all 0.2s ease;
  font-size: 1.15rem;
  padding-bottom: 14px;
}

.subject-tab-btn.active {
  color: #0f172a;
}

.subject-tab-btn.active::after {
  content: "";
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  width: 100%;
  height: 3px;
  background-color: #2e7d6b;
  border-radius: 3px 3px 0 0;
}

.subject-tab-btn:hover:not(.active) {
  color: #334155;
}

/* FORM CONTROLS */
.form-control-score {
  height: 56px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 0 16px;
  font-size: 1.25rem;
  color: #1e293b;
  background-color: #ffffff;
  transition: all 0.2s ease;
}

.form-control-score:focus {
  border-color: #2e7d6b;
  box-shadow: 0 0 0 3px rgba(46, 125, 107, 0.15);
}

.form-control-comment {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 14px 16px;
  font-size: 0.95rem;
  color: #1e293b;
  line-height: 1.6;
  resize: vertical;
  transition: all 0.2s ease;
}

.form-control-comment:focus {
  border-color: #2e7d6b;
  box-shadow: 0 0 0 3px rgba(46, 125, 107, 0.15);
}

/* QUICK TAG PILLS */
.tag-pill {
  border-radius: 50px;
  padding: 6px 14px;
  font-size: 0.85rem;
  font-weight: 500;
  border: 1px solid transparent;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.tag-pill-positive {
  background-color: #f0fdf4;
  border-color: #dcfce7;
  color: #166534;
}

.tag-pill-positive:hover {
  background-color: #dcfce7;
  border-color: #bbf7d0;
  transform: translateY(-1px);
}

.tag-pill-warning {
  background-color: #fef2f2;
  border-color: #fee2e2;
  color: #991b1b;
}

.tag-pill-warning:hover {
  background-color: #fee2e2;
  border-color: #fecaca;
  transform: translateY(-1px);
}

/* SUBMIT BUTTON */
.btn-submit-eval {
  background-color: #2e7d6b;
  border: none;
  height: 52px;
  font-size: 1.05rem;
  transition: all 0.2s ease;
}

.btn-submit-eval:hover:not(:disabled) {
  background-color: #246456;
  box-shadow: 0 4px 12px rgba(46, 125, 107, 0.25);
  transform: translateY(-1px);
}

.btn-submit-eval:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* RIGHT COLUMN - SCORE PROGRESS BARS */
.score-progress-bar {
  height: 8px;
  border-radius: 50px;
  background-color: #f1f5f9;
  overflow: hidden;
}

.bg-tech-bar {
  background-color: #2e7d6b !important;
  border-radius: 50px;
  transition: width 0.4s ease;
}

.bg-att-bar {
  background-color: #f59e0b !important;
  border-radius: 50px;
  transition: width 0.4s ease;
}

/* OVERALL BANNER CARD */
.overall-banner-card {
  min-height: 200px;
  height: 220px;
}

.banner-bg-img {
  opacity: 0.95;
  filter: brightness(0.98);
}

.banner-overlay {
  z-index: 2;
}

.banner-title {
  color: #1b4332;
  font-size: 1.15rem;
  letter-spacing: -0.2px;
}

.banner-score {
  color: #143d2b;
  font-size: 2.75rem;
  letter-spacing: -0.5px;
}
</style>
