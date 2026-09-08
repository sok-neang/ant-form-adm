<template>
  <div class="container-fluid student-detail-page py-3">
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
      <h4 class="fw-bold mb-0 text-dark">ព័ត៌មានលម្អិត</h4>
    </div>

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
      <!-- 1. BANNER & PROFILE SUMMARY CARD -->
      <div class="card border-0 rounded-4 shadow-sm bg-white overflow-hidden profile-summary-card">
        <!-- Curved Teal Gradient Banner -->
        <div class="profile-banner position-relative">
          <svg class="banner-wave" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path
              d="M0,0 C300,90 900,40 1200,80 L1200,120 L0,120 Z"
              fill="rgba(255,255,255,0.08)"
            />
            <path
              d="M0,0 C400,60 800,90 1200,40 L1200,120 L0,120 Z"
              fill="rgba(255,255,255,0.05)"
            />
          </svg>
        </div>

        <div class="profile-body px-4 px-md-5 pb-4">
          <!-- Avatar + Actions Row -->
          <div class="d-flex flex-wrap justify-content-between align-items-end avatar-action-row mb-3">
            <div class="avatar-wrapper">
              <img
                :src="studentAvatar"
                alt="Student Avatar"
                class="student-avatar rounded-4 shadow-sm object-fit-cover bg-white"
              />
            </div>

            <!-- Edit Evaluation Button -->
            <button
              type="button"
              class="btn btn-edit-eval rounded-3 d-inline-flex align-items-center gap-2 px-3 py-2 text-white fw-semibold"
              @click="goToEvaluation"
            >
              <i class="bi bi-pencil-square"></i>
              <span>ធ្វើការកែប្រែ</span>
            </button>
          </div>

          <!-- Specialization Badge -->
          <div class="mb-4">
            <span class="badge badge-program rounded-pill px-3 py-2 fw-semibold">
              {{ programText }}
            </span>
          </div>

          <!-- Contact & Study Info Row (5 Columns) -->
          <div class="row g-3 pt-2 border-top info-icons-row">
            <!-- Study Shift -->
            <div class="col-6 col-md">
              <div class="d-flex align-items-center gap-2">
                <i class="bi bi-clock text-theme-green fs-5"></i>
                <div class="d-flex flex-column">
                  <span class="text-muted small">វេនសិក្សា</span>
                  <span class="fw-bold text-dark small">{{ shiftText }}</span>
                </div>
              </div>
            </div>

            <!-- Specialization -->
            <div class="col-6 col-md">
              <div class="d-flex align-items-center gap-2">
                <i class="bi bi-laptop text-theme-green fs-5"></i>
                <div class="d-flex flex-column">
                  <span class="text-muted small">ជំនាញ</span>
                  <span class="fw-bold text-dark small">{{ programText }}</span>
                </div>
              </div>
            </div>

            <!-- Email -->
            <div class="col-6 col-md">
              <a
                :href="studentEmailUrl"
                class="d-flex align-items-center gap-2 text-decoration-none contact-link"
                :title="`ផ្ញើអ៊ីម៉ែលទៅកាន់ ${studentEmail}`"
              >
                <i class="bi bi-envelope text-theme-green fs-5"></i>
                <div class="d-flex flex-column text-truncate">
                  <span class="text-muted small">អ៊ីម៉ែល</span>
                  <span class="fw-bold text-dark small text-truncate contact-val">
                    {{ studentEmail }}
                  </span>
                </div>
              </a>
            </div>

            <!-- Phone Number -->
            <div class="col-6 col-md">
              <a
                :href="studentPhoneUrl"
                class="d-flex align-items-center gap-2 text-decoration-none contact-link"
                :title="`ហៅទូរស័ព្ទទៅកាន់ ${studentPhone}`"
              >
                <i class="bi bi-telephone text-theme-green fs-5"></i>
                <div class="d-flex flex-column text-truncate">
                  <span class="text-muted small">លេខទូរស័ព្ទ</span>
                  <span class="fw-bold text-dark small text-truncate contact-val">
                    {{ studentPhone }}
                  </span>
                </div>
              </a>
            </div>

            <!-- Telegram -->
            <div class="col-6 col-md">
              <a
                :href="telegramUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="d-flex align-items-center gap-2 text-decoration-none contact-link"
                :title="`បើក ${studentTelegram} ក្នុង Telegram`"
              >
                <i class="bi bi-telegram text-theme-green fs-5"></i>
                <div class="d-flex flex-column text-truncate">
                  <span class="text-muted small">តេឡេក្រាម</span>
                  <span class="fw-bold text-dark small text-truncate contact-val">
                    {{ studentTelegram }}
                  </span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. PERSONAL INFORMATION CARD -->
      <div class="card border-0 rounded-4 shadow-sm bg-white p-4">
        <div class="d-flex align-items-center gap-2 mb-3">
          <i class="bi bi-person fs-5 text-theme-green"></i>
          <h5 class="fw-bold text-dark mb-0">ព័ត៌មានផ្ទាល់ខ្លួន</h5>
        </div>

        <div class="rounded-4 bg-light-soft p-4">
          <div class="row g-4">
            <div class="col-md-4">
              <div class="d-flex flex-column gap-3">
                <div>
                  <span class="text-muted fw-medium">ឈ្មោះ : </span>
                  <span class="fw-bold text-dark ms-1">{{ studentKhName }}</span>
                </div>
                <div>
                  <span class="text-muted fw-medium">កម្រិតវប្បធម៌ : </span>
                  <span class="fw-bold text-dark ms-1">{{ educationLevelText }}</span>
                </div>
              </div>
            </div>

            <div class="col-md-4">
              <div class="d-flex flex-column gap-3">
                <div>
                  <span class="text-muted fw-medium">ភេទ : </span>
                  <span class="fw-bold text-dark ms-1">{{ genderText }}</span>
                </div>
                <div>
                  <span class="text-muted fw-medium">សិក្សានៅសាលា : </span>
                  <span class="fw-bold text-dark ms-1">{{ universityText }}</span>
                </div>
              </div>
            </div>

            <div class="col-md-4">
              <div class="d-flex flex-column gap-3">
                <div>
                  <span class="text-muted fw-medium">ថ្ងៃ ខែ ឆ្នាំកំណើត : </span>
                  <span class="fw-bold text-dark ms-1">{{ dateOfBirthText }}</span>
                </div>
                <div>
                  <span class="text-muted fw-medium">សិក្សាឆ្នាំទី : </span>
                  <span class="fw-bold text-dark ms-1">{{ yearOfStudyText }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 3. ADDRESS CARD -->
      <div class="card border-0 rounded-4 shadow-sm bg-white p-4">
        <div class="d-flex align-items-center gap-2 mb-3">
          <i class="bi bi-geo-alt fs-5 text-theme-green"></i>
          <h5 class="fw-bold text-dark mb-0">អាសយដ្ឋាន</h5>
        </div>

        <div class="rounded-4 p-3 bg-light-soft text-muted lh-base">
          {{ addressText }}
        </div>
      </div>

      <!-- 4. SUBJECT EVALUATION CARDS -->
      <div v-for="subject in subjectEvaluationCards" :key="subject.key" class="card border-0 rounded-4 shadow-sm bg-white p-4">
        <!-- Subject Header -->
        <div class="d-flex align-items-center gap-2 mb-4">
          <!-- C++ Logo -->
          <img
            v-if="subject.logo === 'cpp'"
            :src="cppLogo"
            alt="C++ Logo"
            width="28"
            height="28"
            class="object-fit-contain"
          />
          <!-- HTML & CSS Logo -->
          <div v-else-if="subject.logo === 'html_css'" class="d-flex align-items-center gap-1">
            <img :src="html5Logo" alt="HTML5" width="24" height="24" class="object-fit-contain" />
            <img :src="css3Logo" alt="CSS3" width="24" height="24" class="object-fit-contain" />
          </div>
          <!-- Dart Logo -->
          <img
            v-else
            :src="dartLogo"
            alt="Dart Logo"
            width="26"
            height="26"
            class="object-fit-contain"
          />

          <h5 class="fw-bold text-dark mb-0 ms-1">
            លទ្ធផលពិន្ទុ
          </h5>
        </div>

        <!-- 3 Score Metric Boxes -->
        <div class="row g-3 mb-4">
          <!-- Technical Score -->
          <div class="col-md-4">
            <div class="score-box p-3 rounded-4 bg-light-soft text-center">
              <span class="text-secondary small fw-medium d-block mb-1">Technical</span>
              <span class="fs-4 fw-bold text-dark">
                {{ subject.eval?.technicalScore != null ? subject.eval.technicalScore : "N/A" }}
              </span>
            </div>
          </div>

          <!-- Attendance Score -->
          <div class="col-md-4">
            <div class="score-box p-3 rounded-4 bg-light-soft text-center">
              <span class="text-secondary small fw-medium d-block mb-1">Attendance</span>
              <span class="fs-4 fw-bold text-dark">
                {{ subject.eval?.attendanceScore != null ? subject.eval.attendanceScore : "N/A" }}
              </span>
            </div>
          </div>

          <!-- Average Score -->
          <div class="col-md-4">
            <div class="score-box p-3 rounded-4 bg-light-soft text-center">
              <span class="text-secondary small fw-medium d-block mb-1">Average Score</span>
              <span class="fs-4 fw-bold text-dark">
                {{ subject.eval?.averageScore != null ? Math.round(subject.eval.averageScore) : "N/A" }}
              </span>
            </div>
          </div>
        </div>

        <!-- Comment Box -->
        <div>
          <div class="d-flex align-items-center gap-2 mb-2">
            <i class="bi bi-chat-left-text text-theme-green"></i>
            <span class="fw-bold text-dark small">មតិវាយតម្លៃ</span>
          </div>
          <div class="rounded-4 p-3 bg-light-soft text-muted lh-base small">
            {{ subject.eval?.comment || "មិនទាន់មានការវាយតម្លៃនៅឡើយទេ" }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import BaseSkeleton from "@/components/ui/base/BaseSkeleton.vue";
import evaluationService from "@/services/evaluation.service";
import submissionService from "@/services/submission.service";

import cppLogo from "@/assets/images/teacher/cpp.svg";
import dartLogo from "@/assets/images/teacher/dart.svg";
import html5Logo from "@/assets/images/teacher/html5.svg";
import css3Logo from "@/assets/images/teacher/css3.svg";

const route = useRoute();
const router = useRouter();
const submissionId = route.params.submissionId;

const loading = ref(true);
const submission = ref(null);
const student = ref(null);
const evaluations = ref([]);

const fetchData = async () => {
  if (!submissionId) return;
  loading.value = true;
  try {
    const [subRes, evalRes] = await Promise.allSettled([
      submissionService.getById(submissionId),
      evaluationService.getBySubmissionId(submissionId),
    ]);

    let mergedSubmission = {};
    let mergedStudent = {};
    let mergedEvaluations = [];

    if (subRes.status === "fulfilled" && subRes.value?.data?.success) {
      const subData = subRes.value.data.data || {};
      mergedSubmission = { ...subData };
      mergedStudent = { ...(subData.student || {}) };
      if (Array.isArray(subData.evaluations) && subData.evaluations.length > 0) {
        mergedEvaluations = subData.evaluations;
      }
    }

    if (evalRes.status === "fulfilled" && evalRes.value?.data?.success) {
      const evalData = evalRes.value.data.data || {};
      if (Array.isArray(evalData) && evalData.length > 0) {
        mergedEvaluations = evalData;
      } else if (Array.isArray(evalData.evaluations) && evalData.evaluations.length > 0) {
        mergedEvaluations = evalData.evaluations;
      }
      if (evalData.student) {
        mergedStudent = { ...mergedStudent, ...evalData.student };
      }
      mergedSubmission = { ...evalData, ...mergedSubmission };
    }

    submission.value = mergedSubmission;
    student.value = mergedStudent;
    evaluations.value = mergedEvaluations;
  } catch (err) {
    console.error("Failed to load student detail:", err);
  } finally {
    loading.value = false;
  }
};

// Computed display fields
const studentAvatar = computed(() => {
  return student.value?.avatarPath || "/src/assets/images/img/profile.webp";
});

const studentKhName = computed(() => {
  return student.value?.khName || student.value?.enName || submission.value?.name || "-";
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
  return lvl || "-";
});

const universityText = computed(() => {
  return student.value?.university?.name || student.value?.university?.code || student.value?.university || "-";
});

const yearOfStudyText = computed(() => {
  const y = submission.value?.yearOfStudy || student.value?.yearOfStudy;
  if (!y) return "-";
  if (y === "YEAR_1" || y === 1 || y === "1") return "1";
  if (y === "YEAR_2" || y === 2 || y === "2") return "2";
  if (y === "YEAR_3" || y === 3 || y === "3") return "3";
  if (y === "YEAR_4" || y === 4 || y === "4") return "4";
  if (y === "YEAR_5" || y === 5 || y === "5") return "5";
  return String(y).replace(/^YEAR_?/i, "");
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
  router.push({ name: "student-lists" });
};

const goToEvaluation = () => {
  router.push({
    name: "student-evaluation",
    params: { submissionId },
  });
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.student-detail-page {
  max-width: 1200px;
  margin: 0 auto;
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

/* BANNER */
.profile-banner {
  height: 150px;
  background: linear-gradient(135deg, #1b4d42 0%, #2e7d6b 60%, #3ba28b 100%);
  position: relative;
  overflow: hidden;
}

.banner-wave {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 60px;
}

/* AVATAR & ACTIONS */
.avatar-action-row {
  margin-top: -60px;
}

.student-avatar {
  width: 110px;
  height: 110px;
  border: 4px solid #ffffff;
}

.btn-edit-eval {
  background-color: #1b4d42;
  border: none;
  font-size: 0.95rem;
  transition: all 0.2s ease;
}

.btn-edit-eval:hover {
  background-color: #2e7d6b;
  transform: translateY(-1px);
}

.badge-program {
  background-color: #ecfdf5;
  color: #059669;
  border: 1px solid #a7f3d0;
  font-size: 0.85rem;
}

/* LIGHT SOFT BACKGROUND FOR BOXES */
.bg-light-soft {
  background-color: #f8fafc;
  border: 1px solid #f1f5f9;
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

.contact-link,
.telegram-link {
  transition: all 0.2s ease;
  border-radius: 8px;
  padding: 2px 4px;
  margin: -2px -4px;
}

.contact-link:hover,
.telegram-link:hover {
  background-color: #e8f5f1;
}

.contact-link:hover .contact-val,
.telegram-link:hover .telegram-username {
  color: #2e7d6b !important;
  text-decoration: underline;
}
</style>
