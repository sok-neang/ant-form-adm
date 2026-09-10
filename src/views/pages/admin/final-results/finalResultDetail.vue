<template>
  <div class="container-fluid shortlist-container">
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
          </div>

          <!-- Specialization Badge -->
          <div class="mb-4">
            <span class="badge rounded-pill px-3 py-2 fw-semibold" style="background-color: #e0f2f1; color: #009688; font-size: 0.85rem;">
              ជម្រើសចុងក្រោយ
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
                  <span class="text-muted small">អុីម៉ែល</span>
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
                  <span class="text-muted small">តេលេក្រាម</span>
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
          <h5 class="fw-bold text-dark mb-0">អាស័យដ្ឋាន</h5>
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

          <h5 class="fw-bold text-theme-green mb-0 ms-1">
            លទ្ធផលវាយតម្លៃ
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
            <i class="bi bi-chat-left-text text-secondary"></i>
            <span class="fw-bold text-dark small">មតិវាយតម្លៃ</span>
          </div>
          <div class="rounded-4 p-3 bg-light-soft text-muted lh-base small">
            {{ subject.eval?.comment || "មិនទាន់មានការវាយតម្លៃនៅឡើយទេ" }}
          </div>
        </div>
      </div>
    </div>
    </div> <!-- end shortlist-scroll -->

    <!-- ================= FOOTER ACTIONS ================= -->
    <div class="review-actions">
      <!-- Back -->
      <button
        type="button"
        class="btn btn-light border px-4"
        @click="goBack"
      >
        <i class="bi bi-arrow-left me-2"></i>
        ត្រឡប់
      </button>

      <div class="d-flex gap-2">
        <button
          type="button"
          class="btn blacklist-btn px-4"
          @click="openActionModal('BLACKLIST')"
          :disabled="isUpdating"
        >
          <i class="bi bi-person-x-fill me-2"></i>
          បញ្ជីខ្មៅ
        </button>
        <button
          type="button"
          class="btn reject-btn px-4"
          @click="openActionModal('FAIL')"
          :disabled="isUpdating"
        >
          <i class="bi bi-person-x-fill me-2"></i>
          ធ្លាក់
        </button>
        <button
          type="button"
          class="btn blacklist-btn px-4"
          @click="openActionModal('DROPOUT')"
          :disabled="isUpdating"
        >
          <i class="bi bi-person-x-fill me-2"></i>
          បោះបង់
        </button>
        <button
          type="button"
          class="btn text-white px-4"
          style="background-color: #f59e0b; border-color: #f59e0b;"
          @click="openActionModal('RESERVED')"
          :disabled="isUpdating"
        >
          <i class="bi bi-person-lines-fill me-2"></i>
          បម្រុង
        </button>
        <button
          type="button"
          class="btn shortlist-btn px-4 text-white"
          style="background-color: #357867;"
          @click="handlePass"
          :disabled="isUpdating"
        >
          <i class="bi bi-person-check-fill me-2"></i>
          ជាប់
        </button>
      </div>
    </div>

    <!-- ACTION MODAL -->
    <BaseModal 
      :show="showActionModal" 
      :title="actionModalTitle" 
      size="md" 
      @close="showActionModal = false"
    >
      <div class="mb-3">
        <label class="form-label">មូលហេតុ (Reason)</label>
        <textarea v-model="actionReason" class="form-control shadow-none border-success-subtle" rows="3" placeholder="Optional reason..."></textarea>
      </div>
      <div class="mb-4">
        <label class="form-label">កំណត់សម្គាល់ (Note)</label>
        <textarea v-model="actionNote" class="form-control shadow-none border-success-subtle" rows="2" placeholder="Optional note..."></textarea>
      </div>
      <div class="d-flex justify-content-end gap-2">
        <button type="button" class="btn btn-light px-4" @click="showActionModal = false">
          បោះបង់
        </button>
        <button type="button" class="btn btn-success px-4" @click="submitActionModal" :disabled="isUpdating">
          <span v-if="isUpdating" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          បញ្ជូន
        </button>
      </div>
    </BaseModal>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import BaseSkeleton from "@/components/ui/base/BaseSkeleton.vue";
import BaseModal from "@/components/ui/base/BaseModal.vue";
import evaluationService from "@/services/evaluation.service";
import submissionService from "@/services/submission.service";
import { useAppToast } from "@/composable/useAppToast";

import cppLogo from "@/assets/images/teacher/cpp.svg";
import dartLogo from "@/assets/images/teacher/dart.svg";
import html5Logo from "@/assets/images/teacher/html5.svg";
import css3Logo from "@/assets/images/teacher/css3.svg";

const route = useRoute();
const router = useRouter();
const toast = useAppToast();
const submissionId = route.params.id; 

const loading = ref(true);
const isUpdating = ref(false);
const submission = ref(null);
const student = ref(null);
const evaluations = ref([]);

// Modal State
const showActionModal = ref(false);
const actionType = ref("");
const actionReason = ref("");
const actionNote = ref("");

const actionModalTitle = computed(() => {
  if (actionType.value === 'BLACKLIST') return 'បញ្ជាក់បញ្ជីខ្មៅ (Blacklist)';
  if (actionType.value === 'DROPOUT') return 'បញ្ជាក់បោះបង់ (Dropout)';
  if (actionType.value === 'FAIL') return 'បញ្ជាក់ការធ្លាក់ (Fail)';
  if (actionType.value === 'RESERVED') return 'បញ្ជាក់បម្រុង (Reserve)';
  return 'បញ្ជាក់';
});

const fetchData = async () => {
  if (!submissionId) return;
  loading.value = true;
  try {
    const [evalRes, subRes] = await Promise.allSettled([
      evaluationService.getBySubmissionId(submissionId),
      submissionService.getById(submissionId),
    ]);

    let finalSubmission = {};
    let finalStudent = {};
    let finalEvaluations = [];

    if (subRes.status === "fulfilled") {
      let subData = subRes.value?.data?.data || subRes.value?.data;
      if (subData?.success) subData = subData.data;
      
      if (subData) {
        finalSubmission = { ...subData };
        finalStudent = { ...subData.student };
        if (subData.evaluations?.length) finalEvaluations = [...subData.evaluations];
      }
    }

    if (evalRes.status === "fulfilled" && evalRes.value?.data?.success) {
      const evalData = evalRes.value.data.data;
      if (evalData) {
        finalSubmission = { ...finalSubmission, ...evalData };
        if (evalData.student) finalStudent = { ...finalStudent, ...evalData.student };
        if (evalData.evaluations?.length) finalEvaluations = [...evalData.evaluations];
      }
    }

    submission.value = finalSubmission;
    student.value = finalStudent;
    evaluations.value = finalEvaluations;

  } catch (err) {
    console.error("Failed to load student detail:", err);
  } finally {
    loading.value = false;
  }
};

const getFileUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
  return `${baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
};

// Computed display fields
const studentAvatar = computed(() => {
  return getFileUrl(student.value?.photoUrl || student.value?.avatarPath) || "/src/assets/images/img/profile.webp";
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

const openActionModal = (type) => {
  actionType.value = type;
  actionReason.value = "";
  actionNote.value = "";
  showActionModal.value = true;
};

const promoteStatus = async (status, payload = {}) => {
  if (!submissionId) return;
  isUpdating.value = true;
  try {
    const response = await submissionService.promoteStatus(submissionId, { status, ...payload });
    if (response.data?.success || response.status === 200) {
      toast.success("ស្ថានភាពត្រូវបានកែប្រែដោយជោគជ័យ");
      router.back();
    }
  } catch (error) {
    console.error("Error updating status:", error);
    toast.error("មានបញ្ហាក្នុងការកែប្រែស្ថានភាព");
  } finally {
    isUpdating.value = false;
  }
};

const submitActionModal = async () => {
  await promoteStatus(actionType.value, { 
    reason: actionReason.value || undefined, 
    note: actionNote.value || undefined 
  });
  if (!isUpdating.value) {
    showActionModal.value = false;
  }
};

const handlePass = () => {
  promoteStatus("PASS");
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.shortlist-container {
  max-width: 1200px;
  margin: 0 auto;
  height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
  padding: 10px 0;
}

.shortlist-scroll {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0 10px 20px 2px;
}

/* FOOTER ACTIONS */
.review-actions {
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 14px 16px;
  margin-top: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.blacklist-btn, .reject-btn {
  color: #e53e3e;
  border: 1px solid #e53e3e;
  background: rgba(229, 62, 62, 0.05);
}

.blacklist-btn:hover, .reject-btn:hover {
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
