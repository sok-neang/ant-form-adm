<template>
  <div class="review-container">

    <!-- ================= HEADER ================= -->
    <div
      class="form-header-card position-relative overflow-hidden"
      :class="{ 'banner-blacklist-theme': isBlacklisted }"
      :style="{
        backgroundImage: `url(${computedBannerBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center right',
        backgroundRepeat: 'no-repeat'
      }"
    >
      <div class="d-flex align-items-center justify-content-between position-relative z-1">
        <div class="d-flex align-items-center gap-3 gap-md-4 min-w-0">
          <div class="header-icon">
            <i class="bi bi-file-earmark-text-fill"></i>
          </div>

          <div class="min-w-0">
            <h4 class="fw-bold mb-1 banner-title text-truncate">
              ព័ត៌មានពាក្យស្នើសុំអាហារូបករណ៍
            </h4>

            <p class="mb-0 banner-subtitle text-truncate">
              ពិនិត្យព័ត៌មានរបស់អ្នកមុនបញ្ជូនយល់ព្រមជ្រើសរើស
            </p>
          </div>
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
        <div class="d-flex align-items-center justify-content-between mb-2">
          <div class="d-flex align-items-center gap-3">
            <div class="section-icon-circle applicant-badge">
              <i class="bi bi-person-fill"></i>
            </div>
            <div>
              <h5 class="fw-bold mb-0 text-dark">ព័ត៌មានផ្ទាល់ខ្លួន</h5>
              <span class="section-subtitle">Student Information</span>
            </div>
          </div>
          <span class="badge rounded-pill applicant-badge">
            <i class="bi bi-mortarboard-fill me-1"></i> 
             {{ getProgram(application?.program) }}
          </span>
        </div>
        <div class="section-line"></div>
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
        <div class="d-flex align-items-center gap-3 mb-2">
          <div class="section-icon-circle applicant-badge">
            <i class="bi bi-mortarboard-fill"></i>
          </div>
          <div>
            <h5 class="fw-bold mb-0 text-dark">ព័ត៌មានការសិក្សា</h5>
            <span class="section-subtitle">Education Information</span>
          </div>
        </div>
        <div class="section-line"></div>
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
        <div class="answer">{{ application?.student?.university?.name || application?.student?.universityOther || '-' }}</div>
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

      <!-- ================= ADDITIONAL INFORMATION ================= -->
      <div class="form-section">
        <div class="d-flex align-items-center gap-3 mb-2">
          <div class="section-icon-circle applicant-badge">
            <i class="bi bi-chat-left-text-fill"></i>
          </div>
          <div>
            <h5 class="fw-bold mb-0 text-dark">ព័ត៌មានបន្ថែម</h5>
            <span class="section-subtitle">Additional Information</span>
          </div>
        </div>
        <div class="section-line"></div>
      </div>

      <!-- 13 -->
      <div class="question-card">
        <div class="question">13. សូមបំពេញទីលំនៅបច្ចុប្បន្ន</div>
        <div class="answer long-answer">{{ application?.student?.address || '-' }}</div>
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
        <div class="d-flex align-items-center gap-3 mb-2">
          <div class="section-icon-circle applicant-badge">
            <i class="bi bi-award-fill"></i>
          </div>
          <div>
            <h5 class="fw-bold mb-0 text-dark">ព័ត៌មានអាហារូបករណ៍</h5>
            <span class="section-subtitle">Scholarship Information</span>
          </div>
        </div>
        <div class="section-line"></div>
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
        <div class="d-flex align-items-center gap-3 mb-2">
          <div class="section-icon-circle applicant-badge">
            <i class="bi bi-file-earmark-check-fill"></i>
          </div>
          <div>
            <h5 class="fw-bold mb-0 text-dark">ឯកសារ និងរូបថត</h5>
            <span class="section-subtitle">Documents & Photo</span>
          </div>
        </div>
        <div class="section-line"></div>
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

          <div class="d-flex align-items-center gap-2">
            <button
              type="button"
              class="btn btn-sm btn-light border d-inline-flex align-items-center justify-content-center"
              @click="viewFile(getPhotoFile())"
              :disabled="loadingFileId === (getPhotoFile()?.id || getPhotoFile()?.fileUrl || getPhotoFile()?.filePath)"
              title="មើលរូបភាព"
            >
              <span v-if="loadingFileId === (getPhotoFile()?.id || getPhotoFile()?.fileUrl || getPhotoFile()?.filePath)" class="spinner-border spinner-border-sm"></span>
              <i v-else class="bi bi-eye"></i>
            </button>

            <button
              type="button"
              class="btn btn-sm btn-light border d-inline-flex align-items-center justify-content-center"
              @click="downloadFile(getPhotoFile(), 'Profile_Photo_4x6')"
              :disabled="downloadingFileId === (getPhotoFile()?.id || getPhotoFile()?.fileUrl || getPhotoFile()?.filePath)"
              title="ទាញយក"
            >
              <span v-if="downloadingFileId === (getPhotoFile()?.id || getPhotoFile()?.fileUrl || getPhotoFile()?.filePath)" class="spinner-border spinner-border-sm"></span>
              <i v-else class="bi bi-download"></i>
            </button>
          </div>
        </div>
      </div>

            <!-- 12 -->
      <div class="question-card">
        <div class="question">
          12. ប្រសិនបើអ្នកពិតជាសិក្សាចាប់ពីឆ្នាំទី 3
          ឆមាសទី 2 ឡើងទៅ សូម Upload បណ្ណសម្គាល់ខ្លួននិស្សិត
          ឬវិក្កយបត្របង់ថ្លៃសិក្សាចុងក្រោយ
        </div>

        <div v-if="getTranscriptFile()" class="file-answer">
          <div class="file-icon">
            <i :class="getTranscriptIcon(getTranscriptFile())"></i>
          </div>

          <div class="flex-grow-1 min-w-0">
            <div class="fw-semibold text-truncate">
              {{ getTranscriptTitle(getTranscriptFile()) }}
            </div>
            <small class="text-muted">
              {{ getTranscriptSubtitle(getTranscriptFile()) }}
            </small>
          </div>

          <div class="d-flex align-items-center gap-2 flex-shrink-0">
            <button
              type="button"
              class="btn btn-sm btn-light border d-inline-flex align-items-center justify-content-center"
              @click="viewFile(getTranscriptFile())"
              :disabled="loadingFileId === (getTranscriptFile()?.id || getTranscriptFile()?.fileUrl || getTranscriptFile()?.filePath)"
              title="មើលឯកសារ"
            >
              <span v-if="loadingFileId === (getTranscriptFile()?.id || getTranscriptFile()?.fileUrl || getTranscriptFile()?.filePath)" class="spinner-border spinner-border-sm"></span>
              <i v-else class="bi bi-eye"></i>
            </button>

            <button
              type="button"
              class="btn btn-sm btn-light border d-inline-flex align-items-center justify-content-center"
              @click="downloadFile(getTranscriptFile(), 'Transcript')"
              :disabled="downloadingFileId === (getTranscriptFile()?.id || getTranscriptFile()?.fileUrl || getTranscriptFile()?.filePath)"
              title="ទាញយក"
            >
              <span v-if="downloadingFileId === (getTranscriptFile()?.id || getTranscriptFile()?.fileUrl || getTranscriptFile()?.filePath)" class="spinner-border spinner-border-sm"></span>
              <i v-else class="bi bi-download"></i>
            </button>
          </div>
        </div>

        <div v-else class="answer text-muted">
          មិនមានឯកសារភ្ជាប់
        </div>
      </div>


      <!-- ================= AGREEMENTS ================= -->
      <div class="form-section">
        <div class="d-flex align-items-center gap-3 mb-2">
          <div class="section-icon-circle applicant-badge">
            <i class="bi bi-shield-check"></i>
          </div>
          <div>
            <h5 class="fw-bold mb-0 text-dark">ការយល់ព្រមលក្ខខណ្ឌ</h5>
            <span class="section-subtitle">Terms & Conditions</span>
          </div>
        </div>
        <div class="section-line"></div>
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
          v-if="!isBlacklisted"
          type="button"
          class="btn blacklist-btn px-4"
          @click="handleBlacklist"
          :disabled="isUpdating"
        >
          <i class="bi bi-person-x-fill me-2"></i>
          បញ្ជីខ្មៅ
        </button>

        <!-- Dropout -->
        <button
          v-if="!isDropout && !isBlacklisted"
          type="button"
          class="btn blacklist-btn px-4"
          @click="handleDropout"
          :disabled="isUpdating"
        >
          <i class="bi bi-person-x-fill me-2"></i>
          បោះបង់
        </button>

        <!-- Reject -->
        <button
          v-if="!isFailedShortlist && !isBlacklisted"
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
          v-if="!isShortlisted && !isBlacklisted"
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
      :title="actionModalTitle" 
      size="md" 
      @close="showActionModal = false"
    >
      <div class="py-2">
        <p class="text-secondary mb-3 fs-6 lh-base">
          {{ actionModalPrompt }}
        </p>

        <!-- Reason & Note only for Blacklist and Dropout -->
        <template v-if="isReasonRequired">
          <div class="mb-3">
            <label class="form-label">មូលហេតុ (Reason)</label>
            <textarea 
              v-model="actionReason" 
              class="form-control shadow-none border-secondary-subtle" 
              rows="3" 
              placeholder="បញ្ចូលមូលហេតុ..."
            ></textarea>
          </div>
          <div class="mb-3">
            <label class="form-label">កំណត់សម្គាល់ (Note - Optional)</label>
            <textarea 
              v-model="actionNote" 
              class="form-control shadow-none border-secondary-subtle" 
              rows="2" 
              placeholder="បញ្ចូលកំណត់ចំណាំបន្ថែម..."
            ></textarea>
          </div>
        </template>
      </div>

      <div class="d-flex justify-content-end gap-2 mt-3">
        <button type="button" class="btn btn-light px-4" @click="showActionModal = false">
          បោះបង់
        </button>
        <button 
          type="button" 
          class="btn btn-success px-4" 
          style="background-color: #357867; border-color: #357867;"
          @click="submitActionModal" 
          :disabled="isUpdating"
        >
          <span v-if="isUpdating" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          យល់ព្រម
        </button>
      </div>
    </BaseModal>

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
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useApplicationReview } from "@/composable/application/applicationReview/useApplicationReview";
import BaseModal from "@/components/ui/base/BaseModal.vue";
import bannerDetailBg from "@/assets/images/img/application_banner.png";
import bannerBlacklistBg from "@/assets/images/img/banner_blacklist.png";
import defaultAvatar from "@/assets/images/img/default_avatar.png";
import avatarService from "@/services/avatar.service";
import { getSubmissionFileUrl, DEFAULT_AVATAR } from "@/composable/useAvatar";

const router = useRouter();
const { application, loading, isUpdating, fetchApplication, promoteStatus } = useApplicationReview();

const showActionModal = ref(false);
const actionType = ref("");
const actionReason = ref("");
const actionNote = ref("");

// Preview and Download states
const previewImageUrl = ref(null);
const loadingFileId = ref(null);
const downloadingFileId = ref(null);

const closePreview = () => {
  previewImageUrl.value = null;
};

const onPreviewImageError = (e) => {
  e.target.src = defaultAvatar;
};

const isShortlisted = computed(() => {
  const s = String(application.value?.status || "").toUpperCase();
  return s === "SHORTLIST" || s === "PASS" || s === "PASSED";
});

const isFailedShortlist = computed(() => {
  const s = String(application.value?.status || "").toUpperCase();
  return s === "FAILED_SHORTLIST" || s === "FAIL" || s === "FAILED";
});

const isBlacklisted = computed(() => {
  const s = String(application.value?.status || "").toUpperCase();
  return s === "BLACKLIST" || s === "BLACKLISTED";
});

const isDropout = computed(() => {
  const s = String(application.value?.status || "").toUpperCase();
  return s === "DROPOUT" || s === "DROP_OUT";
});

const isReasonRequired = computed(() => {
  return actionType.value === "BLACKLIST" || actionType.value === "DROPOUT";
});

const actionModalTitle = computed(() => {
  if (actionType.value === "BLACKLIST") return "បញ្ជាក់បញ្ជីខ្មៅ (Blacklist)";
  if (actionType.value === "DROPOUT") return "បញ្ជាក់បោះបង់ (Dropout)";
  if (actionType.value === "FAILED_SHORTLIST" || actionType.value === "FAIL") return "បញ្ជាក់ការធ្លាក់ (Reject)";
  if (actionType.value === "SHORTLIST") return "បញ្ជាក់ការជាប់ (Shortlist)";
  return "បញ្ជាក់";
});

const actionModalPrompt = computed(() => {
  if (actionType.value === "BLACKLIST") {
    return "តើអ្នកពិតជាចង់ផ្លាស់ប្តូរបេក្ខជននេះទៅកាន់បញ្ជីខ្មៅ (Blacklist) មែនទេ?";
  }
  if (actionType.value === "DROPOUT") {
    return "តើអ្នកពិតជាចង់ផ្លាស់ប្តូរបេក្ខជននេះទៅជាបោះបង់ (Dropout) មែនទេ?";
  }
  if (actionType.value === "FAILED_SHORTLIST" || actionType.value === "FAIL") {
    return "តើអ្នកពិតជាចង់ផ្លាស់ប្តូរស្ថានភាពបេក្ខជននេះទៅជា «ធ្លាក់» មែនទេ?";
  }
  if (actionType.value === "SHORTLIST") {
    return "តើអ្នកពិតជាចង់ផ្លាស់ប្តូរស្ថានភាពបេក្ខជននេះទៅជា «ជាប់ (ជ្រើសសម្រាំង)» មែនទេ?";
  }
  return "តើអ្នកពិតជាចង់ផ្លាស់ប្តូរស្ថានភាពបេក្ខជននេះមែនទេ?";
});

const computedBannerBg = computed(() => {
  if (isBlacklisted.value) {
    return bannerBlacklistBg;
  }
  return bannerDetailBg;
});

onMounted(() => {
  fetchApplication();
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

const handleBlacklist = () => openActionModal("BLACKLIST");
const handleDropout = () => openActionModal("DROPOUT");
const handleReject = () => openActionModal("FAILED_SHORTLIST");
const handleShortlist = () => openActionModal("SHORTLIST");

const submitActionModal = async () => {
  const payload = isReasonRequired.value
    ? {
        reason: actionReason.value || undefined,
        note: actionNote.value || undefined,
      }
    : {};

  await promoteStatus(actionType.value, payload);
  if (!isUpdating.value) {
    showActionModal.value = false;
  }
};

// File helpers & Handlers
const getPhotoFile = () => {
  if (!application.value) return null;
  const files = application.value.files || [];
  const photo = files.find(f => String(f.fileType).toUpperCase() === 'PHOTO');
  if (photo) return photo;

  const photoPath = application.value.student?.avatarPath || application.value.student?.photoUrl || application.value.photoUrl;
  if (photoPath) {
    return { fileType: 'PHOTO', fileUrl: photoPath, filePath: photoPath };
  }
  return null;
};

const getTranscriptFile = () => {
  if (!application.value) return null;
  const files = application.value.files || [];

  // 1. Look for TRANSCRIPT, STUDENT_CARD, ID_CARD, etc. in files array
  let transcript = files.find(f => {
    const t = String(f.fileType || "").toUpperCase();
    return t === 'TRANSCRIPT' || t.includes('TRANSCRIPT') || t === 'STUDENT_CARD' || t.includes('CARD') || t === 'CERTIFICATE';
  });
  if (transcript) return transcript;

  // 2. If no specific type matched, find any file that is not PHOTO and not CV/RESUME
  transcript = files.find(f => {
    const t = String(f.fileType || "").toUpperCase();
    return t !== 'PHOTO' && !t.includes('PHOTO') && !t.includes('CV') && !t.includes('RESUME');
  });
  if (transcript) return transcript;

  // 3. Fallback to direct properties on application or student
  const cardPath =
    application.value.transcript ||
    application.value.transcriptUrl ||
    application.value.transcriptPath ||
    application.value.studentIdCard ||
    application.value.idCardUrl ||
    application.value.student?.transcript ||
    application.value.student?.transcriptUrl ||
    application.value.student?.idCardUrl ||
    application.value.student?.studentIdCard ||
    application.value.student?.studentCard;

  if (cardPath) {
    return {
      fileType: 'TRANSCRIPT',
      fileUrl: cardPath,
      filePath: cardPath,
      originalFilename: String(cardPath).split('/').pop() || 'Transcript'
    };
  }
  return null;
};

const getTranscriptTitle = (file) => {
  if (!file) return "Student_Card / Transcript";
  const name = file.originalFilename || file.fileName;
  if (name) return name;
  const type = String(file.fileType || "").toUpperCase();
  if (type === "TRANSCRIPT" || type.includes("TRANSCRIPT")) return "Transcript";
  if (type === "STUDENT_CARD" || type.includes("CARD")) return "Student_Card";
  return "Transcript";
};

const getTranscriptSubtitle = (file) => {
  if (!file) return "Attached document";
  const path = String(file.filePath || file.fileUrl || file.originalFilename || "").toLowerCase();
  if (path.endsWith(".pdf")) return "PDF Document";
  if (/\.(jpe?g|png|webp|gif)$/i.test(path)) return "Image file";
  return file.mimeType || "Document file";
};

const getTranscriptIcon = (file) => {
  if (!file) return "bi bi-file-earmark-text";
  const path = String(file.filePath || file.fileUrl || file.originalFilename || "").toLowerCase();
  if (path.endsWith(".pdf")) return "bi bi-file-earmark-pdf";
  if (/\.(jpe?g|png|webp|gif)$/i.test(path)) return "bi bi-file-earmark-image";
  return "bi bi-file-earmark-text";
};

const getPhotoUrl = () => {
  const f = getPhotoFile();
  return f ? (f.fileUrl || f.filePath) : '';
};

const getTranscriptUrl = () => {
  const f = getTranscriptFile();
  return f ? (f.fileUrl || f.filePath) : '';
};

const viewFile = async (file) => {
  if (!file) return;
  const path = file.filePath || file.fileUrl;
  const fileType = String(file.fileType || "").toUpperCase();
  const isImage =
    file.mimeType?.startsWith("image/") ||
    /\.(jpe?g|png|webp|gif)$/i.test(path || "") ||
    fileType === "PHOTO" ||
    fileType === "STUDENT_CARD";

  if (!path) {
    if (isImage) {
      previewImageUrl.value = defaultAvatar;
    }
    return;
  }

  const fileKey = file.id || path;
  loadingFileId.value = fileKey;
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

const downloadFile = async (file, defaultName = "Document") => {
  if (!file) return;
  const path = file.filePath || file.fileUrl;
  if (!path) return;

  const fileKey = file.id || path;
  downloadingFileId.value = fileKey;
  try {
    const filename = path.split("/").pop().split("?")[0];
    const blob = await avatarService.getSubmissionFileBlob(filename);
    const blobUrl = URL.createObjectURL(blob);
    const extMatch = path.match(/\.([a-zA-Z0-9]+)(?:\?.*)?$/);
    const ext = extMatch ? extMatch[1].toLowerCase() : (String(file.fileType).toUpperCase() === 'PHOTO' ? 'jpg' : 'pdf');
    const studentName = application.value?.student?.khName || application.value?.student?.enName || "Student";
    const cleanName = studentName.trim().replace(/\s+/g, "_");
    const downloadName = `${defaultName}_${cleanName}.${ext}`;

    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = downloadName;
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
  position: relative;
  background-color: #eaf5f0;
  border: 1px solid rgba(46, 125, 107, 0.18);
  border-radius: 20px;
  padding: 24px 32px;
  box-shadow: 0 4px 20px rgba(18, 53, 43, 0.06);
}

.header-icon {
  width: 62px;
  height: 62px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 18px;
  background: rgba(209, 250, 229, 0.85);
  border: 1px solid rgba(52, 211, 153, 0.35);
  color: #176852;
  font-size: 28px;
  box-shadow: 0 2px 8px rgba(18, 53, 43, 0.05);
  flex-shrink: 0;
}

.banner-title {
  color: #07261d;
  font-size: 1.45rem;
  letter-spacing: -0.01em;
}

.banner-subtitle {
  color: #2e6658;
  font-size: 0.92rem;
  font-weight: 500;
}

.banner-quote-line {
  width: 34px;
  height: 2.5px;
  background-color: #246d5b;
  border-radius: 2px;
  margin-top: 5px;
  margin-right: 4px;
}

/* Blacklist theme for header */
.form-header-card.banner-blacklist-theme {
  background-color: #fef2f2;
  border-color: rgba(220, 38, 38, 0.18);
  box-shadow: 0 4px 20px rgba(220, 38, 38, 0.06);
}

.form-header-card.banner-blacklist-theme .header-icon {
  background: rgba(254, 226, 226, 0.85);
  border-color: rgba(248, 113, 113, 0.35);
  color: #dc2626;
}

.form-header-card.banner-blacklist-theme .banner-title {
  color: #450a0a;
}

.form-header-card.banner-blacklist-theme .banner-subtitle {
  color: #991b1b;
}

.form-header-card.banner-blacklist-theme .banner-quote-text {
  color: #dc2626;
}

.form-header-card.banner-blacklist-theme .banner-quote-line {
  background-color: #dc2626;
}


/* =========================================
   SCROLL AREA
========================================= */

.review-scroll {
  padding: 18px 0 20px 0;
}


/* =========================================
   SECTION
========================================= */

.form-section {
  margin: 24px 0 12px;
}

.section-icon-circle {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #dcfce7;
  color: #15803d;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.15rem;
  flex-shrink: 0;
}

.section-subtitle {
  color: #64748b;
  font-size: 0.85rem;
  font-weight: 500;
}

.section-line {
  height: 1px;
  background: #e2e8f0;
  width: 100%;
}

.applicant-badge {
  background-color: #ecfdf5;
  color: #059669;
  border: 1px solid rgba(5, 150, 105, 0.2);
  font-size: 0.85rem;
  font-weight: 600;
  padding: 6px 14px;
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
  margin-top: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  position: sticky;
  bottom: 16px;
  z-index: 20;
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

/* =========================================
   MODAL PREVIEW
========================================= */

.modal-backdrop-custom {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(4px);
  z-index: 1060;
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

.file-answer .btn-light {
  width: 36px;
  height: 36px;
  padding: 0;
  border-radius: 8px;
  transition: all 0.15s ease;
}

.file-answer .btn-light:hover {
  background-color: #e2e8f0;
  color: #0f172a;
}
</style>