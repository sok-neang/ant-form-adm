<template>
  <div class="review-container">

    <!-- ================= HEADER ================= -->
    <div class="form-header-card">
      <div class="d-flex align-items-center gap-3">

        <div class="header-icon">
          <i class="bi bi-file-earmark-text-fill"></i>
        </div>

        <div>
          <h4 class="fw-bold mb-1">
            ព័ត៌មានពាក្យស្នើសុំអាហារូបករណ៍
          </h4>

          <p class="text-muted mb-0 small">
            ពិនិត្យព័ត៌មានដែលបានបំពេញដោយសិស្ស
          </p>
        </div>

      </div>
    </div>


    <!-- ================= SCROLL AREA ================= -->
    <div v-if="loading" class="d-flex justify-content-center align-items-center flex-grow-1" style="height: 400px;">
      <div class="spinner-border text-success" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div class="review-scroll" v-else-if="application">

      <!-- ================= PERSONAL INFORMATION ================= -->
      <div class="form-section">
        <div class="section-header">
          <i class="bi bi-person-fill"></i>
          <span>ព័ត៌មានផ្ទាល់ខ្លួន</span>
        </div>
      </div>

      <!-- 1 -->
      <div class="question-card">
        <div class="question">1. លេខទូរសព្ទរបស់អ្នក</div>
        <div class="answer">{{ application?.student?.phone || application?.phoneNumber || '-' }}</div>
      </div>

      <!-- 2 -->
      <div class="question-card">
        <div class="question">2. Username Telegram</div>
        <div class="answer">{{ application?.student?.telegramUsername || application?.telegramUsername || '-' }}</div>
      </div>

      <!-- 3 -->
      <div class="question-card">
        <div class="question">3. អុីម៉ែលរបស់អ្នក</div>
        <div class="answer">{{ application?.student?.email || application?.email || '-' }}</div>
      </div>

      <!-- 4 -->
      <div class="question-card">
        <div class="question">4. ឈ្មោះជាភាសាខ្មែរ</div>
        <div class="answer">{{ application?.student?.khName || application?.khName || '-' }}</div>
      </div>

      <!-- 5 -->
      <div class="question-card">
        <div class="question">5. ឈ្មោះជាភាសាឡាតាំង</div>
        <div class="answer">{{ application?.student?.enName || application?.enName || '-' }}</div>
      </div>

      <!-- 6 -->
      <div class="question-card">
        <div class="question">6. ភេទ</div>
        <div class="selected-option">
          <i class="bi bi-check-circle-fill"></i>
          {{ application?.student?.gender === 'MALE' ? 'ប្រុស' : (application?.student?.gender === 'FEMALE' ? 'ស្រី' : '-') }}
        </div>
      </div>

      <!-- 7 -->
      <div class="question-card">
        <div class="question">7. ថ្ងៃ ខែ ឆ្នាំកំណើត</div>
        <div class="answer">{{ formatDate(application?.student?.dateOfBirth || application?.student?.dob || application?.dateOfBirth) }}</div>
      </div>


      <!-- ================= EDUCATION ================= -->
      <div class="form-section">
        <div class="section-header">
          <i class="bi bi-mortarboard-fill"></i>
          <span>ព័ត៌មានការសិក្សា</span>
        </div>
      </div>

      <!-- 8 -->
      <div class="question-card">
        <div class="question">8. តើអ្នកកំពុងសិក្សានៅកម្រិតសញ្ញាបត្រណាដែរ?</div>
        <div class="selected-option">
          <i class="bi bi-check-circle-fill"></i>
          {{ getEducationLevel(application?.educationLevel || application?.student?.educationLevel) }}
        </div>
      </div>

      <!-- 9 -->
      <div class="question-card">
        <div class="question">9. តើអ្នកកំពុងសិក្សានៅសាលាណាដែរ?</div>
        <div class="answer">{{ application?.student?.university?.name || application?.university || application?.student?.university || '-' }}</div>
      </div>

      <!-- 10 -->
      <div class="question-card">
        <div class="question">10. តើអ្នកកំពុងសិក្សាឆ្នាំទីប៉ុន្មាន?</div>
        <div class="answer">{{ getYearOfStudy(application?.yearOfStudy || application?.student?.yearOfStudy) }}</div>
      </div>

      <!-- 11 -->
      <div class="question-card">
        <div class="question">11. តើអ្នកកំពុងសិក្សាឆមាសទីប៉ុន្មាន?</div>
        <div class="answer">{{ getSemester(application?.semester || application?.student?.semester) }}</div>
      </div>

      <!-- 12 -->
      <div class="question-card" v-if="application?.studentIdCard || application?.student?.idCardUrl">
        <div class="question">
          12. ប្រសិនបើអ្នកពិតជាសិក្សាចាប់ពីឆ្នាំទី 3
          ឆមាសទី 2 ឡើងទៅ សូម Upload បណ្ណសម្គាល់ខ្លួននិស្សិត
          ឬវិក្កយបត្របង់ថ្លៃសិក្សាចុងក្រោយ
        </div>

        <div class="file-answer">
          <div class="file-icon">
            <i class="bi bi-file-earmark-image"></i>
          </div>

          <div class="flex-grow-1">
            <div class="fw-semibold">
              Student_Card
            </div>
            <small class="text-muted">
              Image file
            </small>
          </div>

          <a
            v-if="getTranscriptUrl()"
            :href="getFileUrl(getTranscriptUrl())"
            target="_blank"
            class="btn btn-sm btn-light"
          >
            <i class="bi bi-eye"></i>
          </a>

          <a
            v-if="getTranscriptUrl()"
            :href="getFileUrl(getTranscriptUrl())"
            download
            class="btn btn-sm btn-light"
          >
            <i class="bi bi-download"></i>
          </a>
        </div>
      </div>


      <!-- ================= ADDITIONAL INFORMATION ================= -->
      <div class="form-section">
        <div class="section-header">
          <i class="bi bi-chat-left-text-fill"></i>
          <span>ព័ត៌មានបន្ថែម</span>
        </div>
      </div>

      <!-- 13 -->
      <div class="question-card">
        <div class="question">13. សូមបំពេញទីលំនៅបច្ចុប្បន្ន</div>
        <div class="answer long-answer">{{ application?.student?.currentAddress || application?.currentAddress || application?.address || '-' }}</div>
      </div>

      <!-- 14 -->
      <div class="question-card">
        <div class="question">14. តើអ្នកទទួលបានព័ត៌មានអាហារូបករណ៍របស់យើងតាមរយៈអ្វីដែរ?</div>
        <div class="selected-option">
          <i class="bi bi-check-circle-fill"></i>
          {{ Array.isArray(application?.referralSource) ? application?.referralSource.join(', ') : application?.referralSource || '-' }}
        </div>
      </div>

      <!-- 15 -->
      <div class="question-card">
        <div class="question">15. តើអ្វីទៅជាភាពខ្លាំងរបស់អ្នក?</div>
        <div class="answer long-answer">{{ application?.narrative?.strengths || '-' }}</div>
      </div>

      <!-- 16 -->
      <div class="question-card">
        <div class="question">16. តើអ្វីទៅជាភាពខ្សោយរបស់អ្នក?</div>
        <div class="answer long-answer">{{ application?.narrative?.weaknesses || '-' }}</div>
      </div>

      <!-- 17 -->
      <div class="question-card">
        <div class="question">17. តើអ្វីដែលជាគោលបំណងក្នុងថ្ងៃអនាគតរបស់អ្នក?</div>
        <div class="answer long-answer">{{ application?.narrative?.goals || '-' }}</div>
      </div>

      <!-- 18 -->
      <div class="question-card">
        <div class="question">18. មូលហេតុដែលអ្នកចង់ទទួលបានអាហារូបករណ៍ពីថ្នាក់បណ្តុះបណ្តាលបច្ចេកវិទ្យាអាន-ANT</div>
        <div class="answer long-answer">{{ application?.narrative?.opportunities || '-' }}</div>
      </div>

      <!-- 19 -->
      <div class="question-card">
        <div class="question">19. ចូររៀបរាប់ពីស្ថានភាពបច្ចុប្បន្នរបស់អ្នក</div>
        <div class="answer long-answer">{{ application?.narrative?.familySituation || '-' }}</div>
      </div>


      <!-- ================= SCHOLARSHIP ================= -->
      <div class="form-section">
        <div class="section-header">
          <i class="bi bi-award-fill"></i>
          <span>ព័ត៌មានអាហារូបករណ៍</span>
        </div>
      </div>

      <!-- 20 -->
      <div class="question-card">
        <div class="question">20. សូមជ្រើសរើសអាហារូបករណ៍ដែលអ្នកចង់ស្នើសុំ</div>
        <div class="selected-option">
          <i class="bi bi-check-circle-fill"></i>
          {{ getProgram(application?.program) }}
        </div>
      </div>

      <!-- 21 -->
      <div class="question-card">
        <div class="question">21. សូមជ្រើសរើសម៉ោងសិក្សាដែលអ្នកចង់រៀន</div>
        <div class="selected-option">
          <i class="bi bi-check-circle-fill"></i>
          {{ getShift(application?.shift) }}
        </div>
        <div class="schedule-text">
          {{ application?.shift === 'MORNING' ? 'ចន្ទ ដល់ សៅរ៍ · 07:50 ដល់ 10:50' : 'ចន្ទ ដល់ សៅរ៍ · 14:00 ដល់ 17:00' }}
        </div>
      </div>

      <!-- 22 -->
      <div class="question-card">
        <div class="question">22. ហេតុអ្វីអ្នកចង់ជ្រើសរើសជំនាញខាងលើ?</div>
        <div class="answer long-answer">{{ application?.narrative?.reason || '-' }}</div>
      </div>

      <!-- 23 -->
      <div class="question-card">
        <div class="question">23. Website ឬ App ដែលអ្នកចាប់អារម្មណ៍</div>
        <div class="answer">{{ application?.narrative?.webAppInterest || '-' }}</div>
      </div>

      <!-- 24 -->
      <div class="question-card">
        <div class="question">24. តើអាហារូបករណ៍នេះនឹងចូលរួមជាប្រយោជន៍អ្វីខ្លះទៅដល់ប្រទេសរបស់យើង?</div>
        <div class="answer long-answer">{{ application?.narrative?.scholarshipVision || '-' }}</div>
      </div>

      <!-- ================= FILES ================= -->
      <div class="form-section">
        <div class="section-header">
          <i class="bi bi-file-earmark-check-fill"></i>
          <span>ឯកសារ និងរូបថត</span>
        </div>
      </div>

      <!-- 25 -->
      <div class="question-card" v-if="getPhotoUrl()">
        <div class="question">25. សូម Upload រូបភាពទំហំ ៤x៦ ផ្ទៃពណ៌ខៀវ</div>
        <div class="file-answer">
          <div class="file-icon">
            <i class="bi bi-image"></i>
          </div>

          <div class="flex-grow-1">
            <div class="fw-semibold">
              Profile_Photo
            </div>
            <small class="text-muted">
              Image file
            </small>
          </div>

          <a
            :href="getFileUrl(getPhotoUrl())"
            target="_blank"
            class="btn btn-sm btn-light"
          >
            <i class="bi bi-eye"></i>
          </a>

          <a
            :href="getFileUrl(getPhotoUrl())"
            download
            class="btn btn-sm btn-light"
          >
            <i class="bi bi-download"></i>
          </a>
        </div>
      </div>


      <!-- ================= AGREEMENTS ================= -->
      <div class="form-section">
        <div class="section-header">
          <i class="bi bi-shield-check"></i>
          <span>ការយល់ព្រមលក្ខខណ្ឌ</span>
        </div>
      </div>

      <!-- 26 -->
      <div class="question-card">
        <div class="question">
          26. អ្នកត្រូវធានាអះអាងលើប្រវត្តិរូប
          និងព័ត៌មានរបស់ខ្លួនដែលបានបំពេញ
          ពិតជាត្រឹមត្រូវ និងគ្មានការក្លែងបន្លំ
        </div>

        <div class="approved-answer">
          <i class="bi bi-check-circle-fill"></i>
          យល់ព្រម
        </div>
      </div>

      <!-- 27 -->
      <div class="question-card">
        <div class="question">
          27. អ្នកតម្រូវឱ្យមានកុំព្យូទ័រប្រើប្រាស់ផ្ទាល់ខ្លួន
        </div>

        <div class="approved-answer">
          <i class="bi bi-check-circle-fill"></i>
          យល់ព្រម
        </div>
      </div>

      <!-- 28 -->
      <div class="question-card">
        <div class="question">
          28. អ្នកត្រូវមានពេលវេលាគ្រប់គ្រាន់ក្នុងការរៀន
          វគ្គសិក្សាអាហារូបករណ៍ដែលបានផ្តល់ឱ្យបានចប់សព្វគ្រប់
        </div>

        <div class="approved-answer">
          <i class="bi bi-check-circle-fill"></i>
          យល់ព្រម
        </div>
      </div>

      <!-- 29 -->
      <div class="question-card">
        <div class="question">
          29. អ្នកត្រូវទទួលខុសត្រូវនូវព័ត៌មានខាងលើ
          និងគោរពតាមលក្ខខណ្ឌរបស់អាហារូបករណ៍
        </div>

        <div class="approved-answer">
          <i class="bi bi-check-circle-fill"></i>
          យល់ព្រម
        </div>
      </div>

    </div>


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

        <!-- Blacklist -->
        <button
          type="button"
          class="btn blacklist-btn px-4"
          @click="handleBlacklist"
          :disabled="isUpdating"
        >
          <i class="bi bi-person-x-fill me-2"></i>
          បញ្ជីខ្មៅ
        </button>

        <!-- Reject -->
        <button
          type="button"
          class="btn reject-btn px-4"
          @click="handleReject"
          :disabled="isUpdating"
        >
          <i class="bi bi-person-check-fill me-2"></i>
          ធ្លាក់
        </button>
        
        <!-- Shortlist -->
        <button
          type="button"
          class="btn shortlist-btn px-4"
          @click="handleShortlist"
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
      :title="actionType === 'BLACKLIST' ? 'បញ្ជាក់បញ្ជីខ្មៅ (Blacklist)' : 'បញ្ជាក់ការធ្លាក់ (Reject)'" 
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
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useApplicationReview } from "@/composable/application/applicationReview/useApplicationReview";
import BaseModal from "@/components/ui/base/BaseModal.vue";

const router = useRouter();
const { application, loading, isUpdating, fetchApplication, promoteStatus } = useApplicationReview();

const showActionModal = ref(false);
const actionType = ref("");
const actionReason = ref("");
const actionNote = ref("");

onMounted(() => {
  fetchApplication();
});

const goBack = () => {
  router.back();
};

const handleBlacklist = () => {
  actionType.value = "BLACKLIST";
  actionReason.value = "";
  actionNote.value = "";
  showActionModal.value = true;
};

const handleReject = () => {
  actionType.value = "FAILED_SHORTLIST";
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

const handleShortlist = () => {
  promoteStatus("SHORTLIST");
};

// Helpers
const getPhotoUrl = () => {
  if (!application.value?.files) return '';
  const photo = application.value.files.find(f => f.fileType === 'PHOTO');
  return photo ? photo.fileUrl : '';
};

const getTranscriptUrl = () => {
  if (!application.value?.files) return '';
  const transcript = application.value.files.find(f => f.fileType === 'TRANSCRIPT' || f.fileType === 'STUDENT_CARD');
  return transcript ? transcript.fileUrl : '';
};

const getFileUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
  return `${baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

const getEducationLevel = (lvl) => {
  if (lvl === "BACHELOR") return "បរិញ្ញាបត្រ";
  if (lvl === "ASSOCIATE") return "បរិញ្ញាបត្ររង";
  if (lvl === "HIGH_SCHOOL") return "មធ្យមសិក្សាទុតិយភូមិ";
  if (lvl === "MASTER") return "អនុបណ្ឌិត";
  return lvl || "-";
};

const getYearOfStudy = (y) => {
  if (y === "YEAR_1") return "ឆ្នាំទី 1";
  if (y === "YEAR_2") return "ឆ្នាំទី 2";
  if (y === "YEAR_3") return "ឆ្នាំទី 3";
  if (y === "YEAR_4") return "ឆ្នាំទី 4";
  if (y === "YEAR_5") return "ឆ្នាំទី 5";
  return y || "-";
};

const getSemester = (s) => {
  if (s === "SEMESTER_1") return "ឆមាសទី 1";
  if (s === "SEMESTER_2") return "ឆមាសទី 2";
  return s || "-";
};

const getProgram = (p) => {
  if (p === "MOBILE_APP") return "Mobile App";
  if (p === "WEB_DEVELOPMENT") return "Web Development";
  return p || "-";
};

const getShift = (s) => {
  if (s === "MORNING") return "វេនព្រឹក";
  if (s === "AFTERNOON") return "វេនរសៀល";
  return s || "-";
};
</script>


<style scoped>

/* =========================================
   MAIN CONTAINER
========================================= */

.review-container {
  width: 100%;
  max-width: 900px;
  height: calc(100vh - 100px);

  margin: 0 auto;

  display: flex;
  flex-direction: column;

  padding: 10px 0;
}


/* =========================================
   HEADER
========================================= */

.form-header-card {
  flex-shrink: 0;

  background: #ffffff;

  border: 1px solid #e5e7eb;

  border-top: 5px solid #357867;

  border-radius: 12px;

  padding: 22px 26px;

  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.header-icon {
  width: 46px;
  height: 46px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 10px;

  background: rgba(53, 120, 103, 0.1);

  color: #357867;

  font-size: 21px;
}


/* =========================================
   SCROLL AREA
========================================= */

.review-scroll {
  flex: 1;

  overflow-y: auto;
  overflow-x: hidden;

  padding: 18px 10px 20px 2px;
}


/* Scrollbar */

.review-scroll::-webkit-scrollbar {
  width: 6px;
}

.review-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.review-scroll::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

.review-scroll::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}


/* =========================================
   SECTION
========================================= */

.form-section {
  margin: 24px 0 12px;
}

.section-header {
  display: flex;
  align-items: center;

  gap: 10px;

  color: #357867;

  font-size: 18px;

  font-weight: 700;

  padding: 0 4px;
}

.section-header i {
  font-size: 19px;
}


/* =========================================
   QUESTION CARD
========================================= */

.question-card {
  background: #ffffff;

  border: 1px solid #e5e7eb;

  border-radius: 10px;

  padding: 22px 24px;

  margin-bottom: 14px;

  transition: all 0.2s ease;
}

.question-card:hover {
  border-color: #d1d5db;

  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}


/* Question */

.question {
  color: #202124;

  font-size: 16px;

  font-weight: 600;

  line-height: 1.7;

  margin-bottom: 14px;
}


/* Answer */

.answer {
  color: #5f6368;

  font-size: 15px;

  line-height: 1.8;

  padding-left: 4px;
}

.long-answer {
  white-space: pre-line;
}


/* =========================================
   SELECTED OPTION
========================================= */

.selected-option {
  display: inline-flex;

  align-items: center;

  gap: 8px;

  color: #357867;

  font-size: 15px;

  font-weight: 500;

  padding-left: 4px;
}

.selected-option i {
  font-size: 17px;
}


/* =========================================
   SCHEDULE
========================================= */

.schedule-text {
  margin-left: 27px;

  margin-top: 4px;

  color: #6b7280;

  font-size: 14px;
}


/* =========================================
   FILE
========================================= */

.file-answer {
  display: flex;

  align-items: center;

  gap: 12px;

  border: 1px solid #e5e7eb;

  border-radius: 9px;

  padding: 12px 14px;

  background: #fafafa;
}

.file-icon {
  width: 42px;
  height: 42px;

  flex-shrink: 0;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 8px;

  background: rgba(53, 120, 103, 0.1);

  color: #357867;

  font-size: 20px;
}


/* =========================================
   AGREEMENT
========================================= */

.approved-answer {
  display: inline-flex;

  align-items: center;

  gap: 8px;

  color: #198754;

  background: rgba(25, 135, 84, 0.08);

  border-radius: 8px;

  padding: 8px 12px;

  font-size: 14px;

  font-weight: 600;
}

.approved-answer i {
  font-size: 16px;
}


/* =========================================
   FOOTER
========================================= */

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


/* Blacklist */

.blacklist-btn {
  color: #e53e3e;

  border: 1px solid #e53e3e;

  background: rgba(229, 62, 62, 0.05);
}

.blacklist-btn:hover {
  color: #ffffff;

  background: #e53e3e;
}


/* Shortlist */

.shortlist-btn {
  color: #ffffff;
  background: #357867;
  border: 1px solid #357867;
}

.shortlist-btn:hover {
  color: #ffffff;
  background: #2d6657;
}


/* Reject */

.reject-btn {
  color: #e53e3e;
  border: 1px solid #e53e3e;
  background: rgba(229, 62, 62, 0.05);
}

.reject-btn:hover {
  color: #ffffff;

  background: #e53e3e;
}



/* =========================================
   RESPONSIVE
========================================= */

@media (max-width: 768px) {

  .review-container {
    height: calc(100vh - 80px);

    padding: 8px;
  }

  .form-header-card {
    padding: 18px;
  }

  .question-card {
    padding: 18px;
  }

  .review-actions {
    flex-direction: column;

    gap: 10px;

    align-items: stretch;
  }

  .review-actions > div {
    width: 100%;
  }

  .review-actions button {
    flex: 1;
  }

}

</style>