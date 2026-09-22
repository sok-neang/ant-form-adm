<template>
  <div class="review-container">

    <!-- ================= HEADER ================= -->
    <div
      class="form-header-card position-relative overflow-hidden"
      :class="{ 'banner-blacklist-theme': isBlacklisted }"
      :style="{
        backgroundImage: isBlacklisted
          ? `url(${computedBannerBg})`
          : `url(${computedBannerBg})`,
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
      <div class="spinner-border text-primary" role="status">
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
        <div class="answer">
          <a
            v-if="studentPhoneUrl"
            :href="studentPhoneUrl"
            class="contact-link"
            :title="`ហៅទូរស័ព្ទទៅកាន់ ${studentPhone}`"
          >
            <i class="bi bi-telephone text-primary me-1"></i>
            {{ studentPhone }}
          </a>
          <span v-else>{{ studentPhone }}</span>
        </div>
      </div>

      <!-- 2 -->
      <div class="question-card">
        <div class="question">2. Username Telegram</div>
        <div class="answer">
          <a
            v-if="telegramUrl"
            :href="telegramUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="contact-link"
            :title="`បើក ${studentTelegram} ក្នុង Telegram`"
          >
            <i class="bi bi-telegram text-primary me-1"></i>
            {{ studentTelegram }}
          </a>
          <span v-else>{{ studentTelegram }}</span>
        </div>
      </div>

      <!-- 3 -->
      <div class="question-card">
        <div class="question">3. អុីម៉ែលរបស់អ្នក</div>
        <div class="answer">
          <a
            v-if="studentEmailUrl"
            :href="studentEmailUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="contact-link"
            :title="`ផ្ញើអ៊ីម៉ែលទៅកាន់ ${studentEmail}`"
          >
            <i class="bi bi-envelope text-primary me-1"></i>
            {{ studentEmail }}
          </a>
          <span v-else>{{ studentEmail }}</span>
        </div>
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
          {{ (application?.student?.gender || application?.gender) === 'MALE' ? 'ប្រុស' : ((application?.student?.gender || application?.gender) === 'FEMALE' ? 'ស្រី' : (application?.student?.gender || application?.gender || '-')) }}
        </div>
      </div>

      <!-- 7 -->
      <div class="question-card">
        <div class="question">7. ថ្ងៃ ខែ ឆ្នាំកំណើត</div>
        <div class="answer">{{ formatDate(application?.student?.dateOfBirth || application?.student?.dob || application?.dateOfBirth || application?.dob) }}</div>
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
        <div class="answer">{{ application?.student?.university?.name || application?.student?.university?.code || application?.student?.universityOther || application?.student?.university || application?.university || '-' }}</div>
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
        <div class="answer long-answer">{{ application?.student?.address || application?.address || '-' }}</div>
      </div>

      <!-- 14 -->
      <div class="question-card">
        <div class="question">14. តើអ្នកទទួលបានព័ត៌មានអាហារូបករណ៍របស់យើងតាមរយៈអ្វីដែរ?</div>
        <div class="selected-option">
          <i class="bi bi-check-circle-fill"></i>
          {{ formatReferralSource(application?.referralSource) }}
        </div>
      </div>

      <!-- 15 -->
      <div class="question-card">
        <div class="question">15. តើអ្នកមើលឃើញថា AI ជាឱកាស ឬជាហានិភ័យសម្រាប់ វិស័យសន្តិសុខព័ត៌មាន (Cybersecurity)?</div>
        <div class="answer long-answer">{{ application?.narrative?.aiCybersecurityImpact || '-' }}</div>
      </div>

      <!-- 16 -->
      <div class="question-card">
        <div class="question">16. តើអ្នកមើលឃើញថា AI នឹងដណ្ដើមការងារអ្នក programmer (developer)?</div>
        <div class="answer long-answer">{{ application?.narrative?.opportunityGoals || '-' }}</div>
      </div>

      <!-- 17 -->
      <div class="question-card">
        <div class="question">17. តើអ្វីដែលជាគោលបំណងក្នុងថ្ងៃអនាគតរបស់អ្នក?</div>
        <div class="answer long-answer">{{ application?.narrative?.goals || application?.goals || '-' }}</div>
      </div>

      <!-- 18 -->
      <div class="question-card">
        <div class="question">18. មូលហេតុដែលអ្នកចង់ទទួលបានអាហារូបករណ៍ពីថ្នាក់បណ្តុះបណ្តាលបច្ចេកវិទ្យាអាន-ANT</div>
        <div class="answer long-answer">{{ application?.narrative?.opportunities || application?.narrative?.reasonAnt || application?.opportunities || '-' }}</div>
      </div>

      <!-- 19 -->
      <div class="question-card">
        <div class="question">19. ចូររៀបរាប់ពីស្ថានភាពបច្ចុប្បន្នរបស់អ្នក</div>
        <div class="answer long-answer">{{ application?.narrative?.familySituation || application?.familySituation || '-' }}</div>
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
        <div class="answer long-answer">{{ application?.narrative?.reason || application?.reason || '-' }}</div>
      </div>

      <!-- 23 -->
      <div class="question-card">
        <div class="question">23. Website ឬ App ដែលអ្នកចាប់អារម្មណ៍</div>
        <div class="answer">{{ application?.narrative?.webAppInterest || application?.webAppInterest || '-' }}</div>
      </div>

      <!-- 24 -->
      <div class="question-card">
        <div class="question">24. តើអាហារូបករណ៍នេះនឹងចូលរួមជាប្រយោជន៍អ្វីខ្លះទៅដល់ប្រទេសរបស់យើង?</div>
        <div class="answer long-answer">{{ application?.narrative?.scholarshipVision || application?.scholarshipVision || '-' }}</div>
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
      <div class="question-card">
        <div class="question">25. សូម Upload រូបថតទំហំ ៤x៦ ផ្ទៃពណ៌ខៀវ</div>
        <div v-if="photoFile" class="file-answer">
          <div class="file-icon">
            <i class="bi bi-image"></i>
          </div>

          <div class="flex-grow-1 min-w-0">
            <div class="fw-semibold text-truncate">
              {{ photoFile.originalFilename || 'Profile_Photo_4x6.jpg' }}
            </div>
            <small class="text-muted">
              រូបថត ៤x៦ (Photo)
            </small>
          </div>

          <div class="d-flex align-items-center gap-2 flex-shrink-0">
            <button
              type="button"
              class="btn btn-sm btn-light border d-inline-flex align-items-center justify-content-center"
              @click="viewFile(photoFile)"
              :disabled="loadingFileId === (photoFile.id || photoFile.fileUrl || photoFile.filePath)"
              title="មើលរូបភាព"
            >
              <span v-if="loadingFileId === (photoFile.id || photoFile.fileUrl || photoFile.filePath)" class="spinner-border spinner-border-sm"></span>
              <i v-else class="bi bi-eye"></i>
            </button>

            <button
              type="button"
              class="btn btn-sm btn-light border d-inline-flex align-items-center justify-content-center"
              @click="downloadFile(photoFile, 'Profile_Photo_4x6')"
              :disabled="downloadingFileId === (photoFile.id || photoFile.fileUrl || photoFile.filePath)"
              title="ទាញយក"
            >
              <span v-if="downloadingFileId === (photoFile.id || photoFile.fileUrl || photoFile.filePath)" class="spinner-border spinner-border-sm"></span>
              <i v-else class="bi bi-download"></i>
            </button>
          </div>
        </div>

        <div v-else class="answer text-muted">
          មិនមានរូបថតភ្ជាប់
        </div>
      </div>

      <!-- 12 -->
      <div class="question-card">
        <div class="question">
          12. ប្រសិនបើអ្នកពិតជាសិក្សាចាប់ពីឆ្នាំទី 2
          ឆមាសទី 2 ឡើងទៅ សូម Upload បណ្ណសម្គាល់ខ្លួននិស្សិត
          ឬវិក្កយបត្របង់ថ្លៃសិក្សាចុងក្រោយ
        </div>

        <div v-if="transcriptFile" class="file-answer">
          <div class="file-icon">
            <i class="bi bi-file-earmark-text"></i>
          </div>

          <div class="flex-grow-1 min-w-0">
            <div class="fw-semibold text-truncate">
              {{ getTranscriptTitle(transcriptFile) }}
            </div>
            <small class="text-muted">
              {{ getTranscriptSubtitle(transcriptFile) }}
            </small>
          </div>

          <div class="d-flex align-items-center gap-2 flex-shrink-0">
            <button
              type="button"
              class="btn btn-sm btn-light border d-inline-flex align-items-center justify-content-center"
              @click="viewFile(transcriptFile)"
              :disabled="loadingFileId === (transcriptFile.fileUrl)"
              title="មើលឯកសារ"
            >
              <span v-if="loadingFileId === (transcriptFile.fileUrl)" class="spinner-border spinner-border-sm"></span>
              <i v-else class="bi bi-eye"></i>
            </button>

            <button
              type="button"
              class="btn btn-sm btn-light border d-inline-flex align-items-center justify-content-center"
              @click="downloadFile(transcriptFile, 'Transcript')"
              :disabled="downloadingFileId === (transcriptFile.fileUrl)"
              title="ទាញយក"
            >
              <span v-if="downloadingFileId === (transcriptFile.fileUrl)" class="spinner-border spinner-border-sm"></span>
              <i v-else class="bi bi-download"></i>
            </button>
          </div>
        </div>

        <div v-else class="answer text-muted">
          មិនមានឯកសារភ្ជាប់
        </div>
      </div>

      <!-- Additional files if any -->
      <div v-if="otherFiles && otherFiles.length > 0" class="question-card">
        <div class="question">ឯកសារភ្ជាប់ផ្សេងៗ (Additional Files)</div>
        <div class="d-flex flex-column gap-2">
          <div v-for="file in otherFiles" :key="file.fileUrl" class="file-answer">
            <div class="file-icon">
              <i class="bi bi-file-earmark-text"></i>
            </div>
            <div class="flex-grow-1 min-w-0">
              <div class="fw-semibold text-truncate">
                {{ file.originalFilename || file.fileType || 'ឯកសារភ្ជាប់' }}
              </div>
              <small class="text-muted">
                {{ getTranscriptSubtitle(file) }}
              </small>
            </div>
            <div class="d-flex align-items-center gap-2 flex-shrink-0">
              <button
                type="button"
                class="btn btn-sm btn-light border d-inline-flex align-items-center justify-content-center"
                @click="viewFile(file)"
                :disabled="loadingFileId === (file.fileUrl)"
                title="មើលឯកសារ"
              >
                <span v-if="loadingFileId === (file.fileUrl)" class="spinner-border spinner-border-sm"></span>
                <i v-else class="bi bi-eye"></i>
              </button>
              <button
                type="button"
                class="btn btn-sm btn-light border d-inline-flex align-items-center justify-content-center"
                @click="downloadFile(file, file.fileType || 'Document')"
                :disabled="downloadingFileId === (file.fileUrl)"
                title="ទាញយក"
              >
                <span v-if="downloadingFileId === (file.fileUrl)" class="spinner-border spinner-border-sm"></span>
                <i v-else class="bi bi-download"></i>
              </button>
            </div>
          </div>
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
          26. តើអ្នកយល់ព្រមតាមលក្ខខណ្ឌដែលទាមទារឱ្យមានកុំព្យូទ័រផ្ទាល់ខ្លួន ពេលវេលាសិក្សាគ្រប់គ្រាន់ និងធានាថាព័ត៌មានដែលបានផ្តល់គឺត្រឹមត្រូវពិតប្រាកដ ដោយទទួលស្គាល់ថាសាលាអាន-ANT 
          នឹងបញ្ឈប់ការសិក្សានិងផ្តាច់ឱកាសអាហារូបករណ៍នៅពេលក្រោយ ប្រសិនបើរកឃើញការក្លែងបន្លំ ឬមានការបោះបង់ការសិក្សាដែរឬទេ?
        </div>

        <div :class="(application?.agreedToEligibilityPolicy ?? true) ? 'approved-answer' : 'rejected-answer'">
          <i :class="(application?.agreedToEligibilityPolicy ?? true) ? 'bi bi-check-circle-fill' : 'bi bi-x-circle-fill'"></i>
          {{ (application?.agreedToEligibilityPolicy ?? true) ? 'យល់ព្រម' : 'មិនយល់ព្រម' }}
        </div>
      </div>

      <!-- Blacklist / Dropout Reason Alert (if present) -->
      <div v-if="isBlacklisted || isDropout || application?.blacklistReason || application?.dropoutReason" class="question-card border-danger-subtle bg-danger-subtle bg-opacity-10 mt-3">
        <div class="d-flex align-items-center gap-2 mb-2 text-danger fw-bold">
          <i class="bi bi-exclamation-triangle-fill"></i>
          <span>{{ isBlacklisted ? 'ព័ត៌មានបញ្ជីខ្មៅ (Blacklist Information)' : 'ព័ត៌មានបោះបង់ (Dropout Information)' }}</span>
        </div>
        <div class="mb-1 text-dark">
          <strong>មូលហេតុ (Reason):</strong> {{ application?.blacklistReason || application?.dropoutReason || 'មិនមានបញ្ជាក់' }}
        </div>
        <div v-if="application?.blacklistNote || application?.dropoutNote" class="text-muted small">
          <strong>កំណត់ចំណាំ (Note):</strong> {{ application?.blacklistNote || application?.dropoutNote }}
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

        <!-- Contact List (Only for SUBMIT status and not yet contacted) -->
        <button
          v-if="application?.status === 'SUBMIT' && !application?.contactList?.isContacted"
          type="button"
          class="btn btn-outline-primary px-4"
          @click="openContactModal"
          :disabled="isUpdating"
          title="បន្ថែមទៅបញ្ជីទំនាក់ទំនង"
        >
          <i class="bi bi-person-lines-fill me-2"></i>
          ទំនាក់ទំនង
        </button>

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

        <!-- Reject -->
        <button
          v-if="!isFailedShortlist && !isBlacklisted"
          type="button"
          class="btn reject-btn px-4"
          @click="handleReject"
          :disabled="isUpdating"
        >
          <i class="bi bi-x-circle-fill me-2"></i>
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
            <label class="form-label">
              មូលហេតុ (Reason) <span class="text-danger">*</span>
            </label>
            <textarea 
              v-model="actionReason" 
              class="form-control shadow-none border-secondary-subtle" 
              :class="{ 'is-invalid border-danger': reasonError }"
              rows="3" 
              placeholder="បញ្ចូលមូលហេតុ..."
              @input="reasonError = ''"
            ></textarea>
            <div v-if="reasonError" class="text-danger small mt-1">
              {{ reasonError }}
            </div>
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
          class="btn btn-primary px-4" 
          style="background-color: var(--bs-primary, #2662d9); border-color: var(--bs-primary, #2662d9);"
          @click="submitActionModal" 
          :disabled="isUpdating || (isReasonRequired && !actionReason.trim())"
        >
          <span v-if="isUpdating" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          យល់ព្រម
        </button>
      </div>
    </BaseModal>

    <!-- CONTACT MODAL -->
    <BaseModal 
      :show="showContactModal" 
      size="md" 
      @close="showContactModal = false"
    >
      <template #header>
        <div class="d-flex align-items-center gap-3">
          <div
            class="bg-primary-subtle text-primary rounded-3 d-flex align-items-center justify-content-center"
            style="width: 44px; height: 44px;"
          >
            <i class="bi bi-person-lines-fill fs-5"></i>
          </div>
          <div>
            <h5 class="fw-bold text-dark mb-0">បន្ថែមទៅបញ្ជីទំនាក់ទំនង</h5>
            <span class="text-muted small">សិស្ស ៖ {{ studentKhName || studentEnName }}</span>
          </div>
        </div>
      </template>

      <div class="py-2">
        <div class="mb-3">
          <label class="form-label fw-semibold text-dark small mb-1">
            កំណត់ចំណាំ (Contact Note) <span class="text-danger">*</span>
          </label>
          <textarea 
            v-model="contactNote" 
            class="form-control" 
            rows="3" 
            placeholder="បញ្ចូលកំណត់ចំណាំ (ឧ. check transcript)..."
          ></textarea>
        </div>
      </div>

      <template #footer>
        <div class="d-flex justify-content-end gap-2 w-100">
          <button
            type="button"
            class="btn btn-light px-4 border"
            :disabled="isSubmittingContact"
            @click="showContactModal = false"
          >
            បោះបង់
          </button>
          <button
            type="button"
            class="btn btn-primary px-4 d-inline-flex align-items-center gap-2"
            :disabled="isSubmittingContact || !contactNote.trim()"
            @click="submitAddContact"
          >
            <span
              v-if="isSubmittingContact"
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
            <i v-else class="bi bi-check2-circle"></i>
            <span>{{ isSubmittingContact ? 'កំពុងបន្ថែម...' : 'បន្ថែម' }}</span>
          </button>
        </div>
      </template>
    </BaseModal>

    <!-- Teleport File Preview Modal (Supports Image & PDF) -->
    <Teleport to="body">
      <div
        v-if="showPreviewModal"
        class="modal-backdrop-custom d-flex align-items-center justify-content-center p-3"
        @click.self="closePreview"
        @wheel.self.prevent
        @touchmove.self.prevent
      >
        <!-- PDF Modal Container -->
        <div
          v-if="previewType === 'pdf'"
          class="bg-white rounded-4 shadow-lg pdf-preview-container d-flex flex-column overflow-hidden position-relative"
          @click.stop
        >
          <!-- Modal Header -->
          <div class="d-flex align-items-center justify-content-between px-3 px-sm-4 py-3 border-bottom bg-light flex-shrink-0">
            <div class="d-flex align-items-center gap-2 min-w-0 me-3">
              <i class="bi bi-file-earmark-pdf-fill text-danger fs-5 flex-shrink-0"></i>
              <span class="fw-bold text-dark text-truncate">{{ previewFileTitle }}</span>
            </div>
            <div class="d-flex align-items-center gap-2 flex-shrink-0">
              <button
                v-if="previewFileUrl"
                type="button"
                class="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1"
                @click="openInNewTab(previewFileUrl)"
                title="បើកក្នុងផ្ទាំងថ្មី"
              >
                <i class="bi bi-box-arrow-up-right"></i>
                <span class="d-none d-sm-inline">បើកក្នុងផ្ទាំងថ្មី</span>
              </button>
              <button
                type="button"
                class="btn-close"
                @click="closePreview"
                aria-label="Close"
              ></button>
            </div>
          </div>

          <!-- Modal Body with VuePdfEmbed -->
          <div class="pdf-scroll-body flex-grow-1 overflow-auto p-2 p-md-4 position-relative">
            <div v-if="isPdfLoading" class="d-flex flex-column align-items-center justify-content-center py-5" style="min-height: 350px;">
              <div class="spinner-border text-primary mb-3" role="status" style="width: 2.5rem; height: 2.5rem;">
                <span class="visually-hidden">Loading PDF...</span>
              </div>
              <span class="text-white fw-medium">កំពុងដំណើរការផ្ទុកឯកសារ PDF...</span>
            </div>
            <div v-else-if="previewPdfSource" class="pdf-wrapper mx-auto">
              <VuePdfEmbed
                :source="previewPdfSource"
                annotation-layer
                text-layer
                class="pdf-viewer-embed shadow rounded-2"
              />
            </div>
            <div v-else class="text-center py-5 text-white">
              <i class="bi bi-exclamation-triangle fs-1 text-warning d-block mb-2"></i>
              <span>មិនអាចបង្ហាញឯកសារបានទេ។</span>
            </div>
          </div>
        </div>

        <!-- Image Modal Container -->
        <div
          v-else-if="previewType === 'image'"
          class="bg-white rounded-4 shadow-lg image-preview-container d-flex flex-column overflow-hidden position-relative"
          @click.stop
        >
          <!-- Modal Header -->
          <div class="d-flex align-items-center justify-content-between px-3 px-sm-4 py-3 border-bottom bg-light flex-shrink-0">
            <div class="d-flex align-items-center gap-2 min-w-0 me-3">
              <i class="bi bi-file-earmark-image-fill text-primary fs-5 flex-shrink-0"></i>
              <span class="fw-bold text-dark text-truncate">{{ previewFileTitle }}</span>
            </div>
            <div class="d-flex align-items-center gap-2 flex-shrink-0">
              <button
                v-if="previewFileUrl"
                type="button"
                class="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1"
                @click="openInNewTab(previewFileUrl)"
                title="បើកក្នុងផ្ទាំងថ្មី"
              >
                <i class="bi bi-box-arrow-up-right"></i>
                <span class="d-none d-sm-inline">បើកក្នុងផ្ទាំងថ្មី</span>
              </button>
              <button
                type="button"
                class="btn-close"
                @click="closePreview"
                aria-label="Close"
              ></button>
            </div>
          </div>

          <!-- Image Modal Body -->
          <div class="image-scroll-body flex-grow-1 overflow-auto p-3 d-flex align-items-center justify-content-center position-relative">
            <!-- Loading State (matching PDF style) -->
            <div v-if="isloading" class="d-flex flex-column align-items-center justify-content-center py-5" style="min-height: 350px;">
              <div class="spinner-border text-primary mb-3" role="status" style="width: 2.5rem; height: 2.5rem;">
                <span class="visually-hidden">Loading Image...</span>
              </div>
              <span class="text-secondary fw-medium">កំពុងដំណើរការផ្ទុករូបភាព...</span>
            </div>

            <!-- Image Content -->
            <div v-else-if="previewImageUrl" class="d-flex align-items-center justify-content-center w-100 h-100">
              <img
                :src="previewImageUrl"
                :alt="previewFileTitle || 'Full Size Photo'"
                class="img-fluid rounded-3 preview-img shadow-sm"
                @error="onPreviewImageError"
              />
            </div>

            <!-- Fallback if failed -->
            <div v-else class="text-center py-5 text-muted">
              <i class="bi bi-exclamation-triangle fs-1 text-warning d-block mb-2"></i>
              <span>មិនអាចបង្ហាញរូបភាពបានទេ។</span>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import VuePdfEmbed from "vue-pdf-embed";
import "vue-pdf-embed/dist/styles/annotationLayer.css";
import "vue-pdf-embed/dist/styles/textLayer.css";
import { useApplicationReview } from "@/composable/application/applicationReview/useApplicationReview";
import BaseModal from "@/components/ui/base/BaseModal.vue";
import bannerDetailBg from "@/assets/images/img/application_banner.webp";
import bannerBlacklistBg from "@/assets/images/img/banner_blacklist.webp";
import defaultAvatar from "@/assets/images/img/default_avatar.webp";
import avatarService from "@/services/avatar.service";
import contactService from "@/services/contact.service";
import { useAppToast } from "@/composable/useAppToast";
import { getSubmissionFileUrl, DEFAULT_AVATAR } from "@/composable/useAvatar";

const router = useRouter();
const toast = useAppToast();
const { application, loading, isUpdating, fetchApplication, promoteStatus } = useApplicationReview();

// Contact Information Computeds
const studentPhone = computed(() => {
  return application.value?.student?.phone || application.value?.student?.phoneNumber || application.value?.phoneNumber || application.value?.phone || "-";
});

const studentPhoneUrl = computed(() => {
  const raw = application.value?.student?.phone || application.value?.student?.phoneNumber || application.value?.phoneNumber || application.value?.phone || "";
  if (!raw || raw === "-") return undefined;
  const clean = String(raw).replace(/[^\d+]/g, "");
  return clean ? `tel:${clean}` : undefined;
});

const studentTelegram = computed(() => {
  const tg = application.value?.student?.telegramUsername || application.value?.student?.telegramPhone || application.value?.telegramUsername || application.value?.student?.phone || application.value?.phone;
  if (!tg || tg === "-") return "-";
  return String(tg).startsWith("@") ? tg : `@${tg}`;
});

const telegramUrl = computed(() => {
  const raw = application.value?.student?.telegramUsername || application.value?.student?.telegramPhone || application.value?.telegramUsername || application.value?.student?.phone || application.value?.phone;
  if (!raw || raw === "-") return undefined;
  const clean = String(raw).replace(/^@/, "").trim();
  return clean ? `https://t.me/${clean}` : undefined;
});

const studentEmail = computed(() => {
  return application.value?.student?.email || application.value?.email || "-";
});

const studentEmailUrl = computed(() => {
  const email = application.value?.student?.email || application.value?.email;
  if (!email || email === "-") return undefined;
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`;
});

// Contact Modal State
const showContactModal = ref(false);
const isSubmittingContact = ref(false);
const contactNote = ref("");

const openContactModal = () => {
  if (application.value?.status !== "SUBMIT") {
    toast.warning("មានតែសិស្សដែលមានស្ថានភាព SUBMIT ប៉ុណ្ណោះដែលអាចបន្ថែមទៅបញ្ជីទំនាក់ទំនង");
    return;
  }
  if (application.value?.contactList?.isContacted || application.value?.isContacted) {
    toast.warning("សិស្សនេះត្រូវបានបន្ថែមទៅបញ្ជីទំនាក់ទំនងរួចហើយ");
    return;
  }
  contactNote.value = "";
  showContactModal.value = true;
};

const submitAddContact = async () => {
  if (!application.value?.id) return;
  isSubmittingContact.value = true;
  try {
    const res = await contactService.addContact(application.value.id, {
      contactNote: contactNote.value.trim(),
    });
    if (res.data?.success) {
      toast.success(res.data?.message || "បានបន្ថែមទៅបញ្ជីទំនាក់ទំនងដោយជោគជ័យ");
      showContactModal.value = false;
      if (application.value) {
        application.value.isContacted = true;
      }
      await fetchApplication();
    }
  } catch (err) {
    toast.error(err.response?.data?.message || "បរាជ័យក្នុងការបន្ថែមទៅបញ្ជីទំនាក់ទំនង");
  } finally {
    isSubmittingContact.value = false;
  }
};

const showActionModal = ref(false);
const actionType = ref("");
const actionReason = ref("");
const actionNote = ref("");
const reasonError = ref("");

// Preview and Download states
const previewImageUrl = ref(null);
const previewPdfSource = ref(null);
const previewFileTitle = ref("");
const previewFileUrl = ref("");
const isPdfLoading = ref(false);
const isloading = ref(false);
const showPreviewModal = ref(false);
const previewType = ref(""); // 'image' | 'pdf'
const loadingFileId = ref(null);
const downloadingFileId = ref(null);

// Prevent background scrolling when preview modal is open
watch(showPreviewModal, (value) => {
  if (value) {
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollBarWidth > 0) {
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    }
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.paddingRight = "";
    document.body.style.overflow = "";
  }
});

const photoFile = computed(() => {
  return (application.value?.files || []).find(
    (f) => String(f.fileType || f.type || "").toUpperCase() === "PHOTO"
  );
});

const transcriptFile = computed(() => {
  return (application.value?.files || []).find(
    (f) => String(f.fileType || f.type || "").toUpperCase() === "TRANSCRIPT"
  );
});

const otherFiles = computed(() => {
  return (application.value?.files || []).filter((f) => {
    const type = String(f.fileType || f.type || "").toUpperCase();
    return type !== "PHOTO" && type !== "TRANSCRIPT";
  });
});

const getFileUrl = (file) => {
  if (!file) return "";
  if (file.fileUrl) return file.fileUrl;
  if (file.filePath) {
    if (file.filePath.startsWith("http://") || file.filePath.startsWith("https://")) {
      return file.filePath;
    }
    const clean = file.filePath.replace(/^\/+/, "");
    return `https://ant-form-backend.g2.ant.com.kh/${clean}`;
  }
  return "";
};

// ------ how to khnow it is file pdf ------
const isFilePdf = (file) => {
  if (!file) return false;
  if (file.mimeType === "application/pdf") return true;
  const path = String(file.originalFilename || file.filePath || file.fileUrl || "").toLowerCase().split("?")[0];
  return path.endsWith(".pdf") || path.includes(".pdf");
};

// ------ how to khnow it is file pdf or normal image ------
const isFileImage = (file) => {
  if (!file) return false;
  if (file.mimeType && file.mimeType.startsWith("image/")) return true;
  const path = String(file.originalFilename || file.filePath || file.fileUrl || "").toLowerCase().split("?")[0];
  if (/\.(jpe?g|png|webp|gif|bmp|svg)$/i.test(path)) return true;
  const type = String(file.fileType || file.type || "").toUpperCase();
  return type === "PHOTO" || type === "STUDENT_CARD" || type === "ID_CARD";
};

// ------ Return Title of File Transcript ------
const getTranscriptTitle = (file) => {
  if (!file) return "ព្រឹត្តិបត្រពិន្ទុ ឬបណ្ណសម្គាល់ខ្លួន";
  return file.originalFilename || "ព្រឹត្តិបត្រពិន្ទុ ឬបណ្ណសម្គាល់ខ្លួន";
};

// ------ return type of the file pdf or normal image ------
const getTranscriptSubtitle = (file) => {
  if (!file) return "";
  if (isFilePdf(file)) return "ឯកសារ PDF (PDF Document)";
  if (isFileImage(file)) return "រូបភាព (Image File)";
  return "ឯកសារភ្ជាប់ (Attached Document)";
};

const formatReferralSource = (source) => {
  if (!source) return "-";
  const list = Array.isArray(source) ? source : [source];
  const map = {
    SOCIAL_MEDIA: "បណ្ដាញសង្គម (Social Media)",
    FACEBOOK: "Facebook",
    TELEGRAM: "Telegram",
    FRIENDS: "មិត្តភក្តិ ឬអ្នកស្គាល់គ្នា (Friends/Word of mouth)",
    UNIVERSITY: "សាកលវិទ្យាល័យ (University)",
    WEBSITE: "គេហទំព័រ (Website)",
    OTHER: "ផ្សេងៗ (Other)",
  };
  return list.map((item) => map[item] || item).join(", ") || "-";
};

const closePreview = () => {
  previewImageUrl.value = null;
  previewPdfSource.value = null;
  previewFileTitle.value = "";
  previewFileUrl.value = "";
  isPdfLoading.value = false;
  isloading.value = false;
  showPreviewModal.value = false;
  previewType.value = "";
};

const openInNewTab = async (url) => {
  if (!url) return;
  try {
    const objectUrl = await getSubmissionFileUrl(url);
    window.open(objectUrl || url, "_blank");
  } catch (err) {
    window.open(url, "_blank");
  }
};

const onPreviewImageError = (e) => {
  e.target.src = defaultAvatar;
};

const viewFile = async (file) => {
  if (!file) return;

  const fileUrl = getFileUrl(file);
  let isPdf = isFilePdf(file);
  let isImage = isFileImage(file);

  if (!fileUrl) {
    if (isImage) {
      previewImageUrl.value = defaultAvatar;
      previewType.value = "image";
      isloading.value = false;
      showPreviewModal.value = true;
    }
    return;
  }

  const fileKey = file.id || file.fileUrl || file.filePath || fileUrl;
  loadingFileId.value = fileKey;
  previewFileUrl.value = fileUrl;

  try {
    // If not definitively known from extension/mime, inspect blob MIME type
    if (!isPdf && !isImage) {
      try {
        const blob = await avatarService.getSubmissionFileBlob(fileUrl);
        if (blob.type === "application/pdf" || blob.type.includes("pdf")) {
          isPdf = true;
        } else if (blob.type.startsWith("image/")) {
          isImage = true;
        }
      } catch (e) {
        console.warn("Could not determine blob type in advance:", e);
      }
    }

    previewFileTitle.value =
      file.originalFilename ||
      (isPdf ? "ឯកសារ PDF" : isImage ? "រូបភាព (Image)" : "ឯកសារភ្ជាប់");

    if (isPdf) {
      previewType.value = "pdf";
      previewPdfSource.value = null;
      isPdfLoading.value = true;
      showPreviewModal.value = true;

      // Exactly how PDF.vue fetches and prepares the source for VuePdfEmbed
      const blob = await avatarService.getSubmissionFileBlob(fileUrl);
      const arrayBuffer = await blob.arrayBuffer();
      previewPdfSource.value = new Uint8Array(arrayBuffer);
    } else if (isImage) {
      previewType.value = "image";
      previewImageUrl.value = null;
      isloading.value = true;
      showPreviewModal.value = true;

      const url = await getSubmissionFileUrl(fileUrl);
      previewImageUrl.value = (!url || url === DEFAULT_AVATAR) ? (fileUrl || defaultAvatar) : url;
    } else {
      const url = await getSubmissionFileUrl(fileUrl);
      window.open(url || file.fileUrl || fileUrl, "_blank");
    }
  } catch (err) {
    console.error("Failed to preview file:", err);
    if (isPdf) {
      window.open(file.fileUrl || fileUrl, "_blank");
    } else if (isImage) {
      previewImageUrl.value = file.fileUrl || fileUrl || defaultAvatar;
    }
  } finally {
    loadingFileId.value = null;
    isPdfLoading.value = false;
    isloading.value = false;
  }
};

const downloadFile = async (file, defaultName = "Document") => {
  if (!file) return;
  const fileUrl = getFileUrl(file);
  if (!fileUrl) return;

  const fileKey = file.id || file.fileUrl || file.filePath || fileUrl;
  downloadingFileId.value = fileKey;
  try {
    const url = await getSubmissionFileUrl(fileUrl);
    const finalUrl = (url && url !== DEFAULT_AVATAR) ? url : fileUrl;
    if (!finalUrl) {
      console.warn("Cannot download file, URL not available");
      return;
    }
    const extMatch =
      fileUrl.match(/\.([a-zA-Z0-9]+)(?:\?.*)?$/) ||
      (file.originalFilename || "").match(/\.([a-zA-Z0-9]+)(?:\?.*)?$/);
    const ext = extMatch
      ? extMatch[1].toLowerCase()
      : isFileImage(file)
      ? "jpg"
      : isFilePdf(file)
      ? "pdf"
      : "bin";
    const studentName = application.value?.student?.khName || application.value?.student?.enName || "Student";
    const cleanName = studentName.trim().replace(/\s+/g, "_");
    const downloadName = file.originalFilename || `${defaultName}_${cleanName}.${ext}`;

    const a = document.createElement("a");
    a.href = finalUrl;
    a.download = downloadName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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

const handleKeyDown = (e) => {
  if (e.key === "Escape" && showPreviewModal.value) {
    closePreview();
  }
};

onMounted(() => {
  fetchApplication();
  window.addEventListener("keydown", handleKeyDown);
});

onUnmounted(() => {
  document.body.style.paddingRight = "";
  document.body.style.overflow = "";
  window.removeEventListener("keydown", handleKeyDown);
});

const goBack = () => {
  router.back();
};

const openActionModal = (type) => {
  actionType.value = type;
  actionReason.value = "";
  actionNote.value = "";
  reasonError.value = "";
  showActionModal.value = true;
};

const handleBlacklist = () => openActionModal("BLACKLIST");
const handleDropout = () => openActionModal("DROPOUT");
const handleReject = () => openActionModal("FAILED_SHORTLIST");
const handleShortlist = () => openActionModal("SHORTLIST");

const submitActionModal = async () => {
  if (isReasonRequired.value && !actionReason.value.trim()) {
    reasonError.value = "សូមបញ្ចូលមូលហេតុជាមុនសិន";
    return;
  }

  const payload = isReasonRequired.value
    ? {
        reason: actionReason.value.trim(),
        note: actionNote.value.trim() || undefined,
      }
    : {};

  await promoteStatus(actionType.value, payload);
  if (!isUpdating.value) {
    showActionModal.value = false;
  }
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
  background-color: #eef4ff;
  border: 1px solid rgba(38, 98, 217, 0.18);
  border-radius: 20px;
  padding: 24px 32px;
  box-shadow: 0 4px 20px rgba(38, 98, 217, 0.06);
}

.header-icon {
  width: 62px;
  height: 62px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 18px;
  background: rgba(219, 234, 254, 0.85);
  border: 1px solid rgba(147, 197, 253, 0.45);
  color: #1d4ed8;
  font-size: 28px;
  box-shadow: 0 2px 8px rgba(38, 98, 217, 0.08);
  flex-shrink: 0;
}

.banner-title {
  color: #0f172a;
  font-size: 1.45rem;
  letter-spacing: -0.01em;
}

.banner-subtitle {
  color: #334155;
  font-size: 0.92rem;
  font-weight: 500;
}

.banner-quote-line {
  width: 34px;
  height: 2.5px;
  background-color: #2662d9;
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
  background: #eff6ff;
  color: #2662d9;
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
  background-color: #eff6ff;
  color: #2662d9;
  border: 1px solid rgba(38, 98, 217, 0.2);
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

.contact-link {
  color: #2662d9;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
  transition: all 0.2s ease;
  border-radius: 6px;
  padding: 2px 8px;
  margin-left: -8px;
}

.contact-link:hover {
  color: #1d4ed8;
  background-color: #eff6ff;
  text-decoration: underline;
}

.contact-link i {
  font-size: 1rem;
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

  color: #2662d9;

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

  background: rgba(38, 98, 217, 0.1);

  color: #2662d9;

  font-size: 20px;
}


/* =========================================
   AGREEMENT
========================================= */

.approved-answer {
  display: inline-flex;

  align-items: center;

  gap: 8px;

  color: var(--bs-primary);

  background: rgba(38, 98, 217, 0.1);

  border-radius: 8px;

  padding: 8px 12px;

  font-size: 14px;

  font-weight: 600;
}

.approved-answer i {
  font-size: 16px;
}

.rejected-answer {
  display: inline-flex;

  align-items: center;

  gap: 8px;

  color: #dc2626;

  background: rgba(220, 38, 38, 0.08);

  border-radius: 8px;

  padding: 8px 12px;

  font-size: 14px;

  font-weight: 600;
}

.rejected-answer i {
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
  background: #2662d9;
  border: 1px solid #2662d9;
}

.shortlist-btn:hover {
  color: #ffffff;
  background: #1f52bc;
  border-color: #1f52bc;
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
  overscroll-behavior: contain;
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

/* =========================================
   PDF PREVIEW MODAL
========================================= */

.pdf-preview-container {
  width: 92vw;
  max-width: 960px;
  height: 90vh;
  max-height: 850px;
  z-index: 1070;
}

.pdf-scroll-body {
  background-color: #525659;
}

.pdf-wrapper {
  max-width: 820px;
  width: 100%;
}

.image-preview-container {
  width: 92vw;
  max-width: 900px;
  height: auto;
  max-height: 90vh;
  z-index: 1070;
}

.image-scroll-body {
  background-color: #f8fafc;
  min-height: 250px;
  max-height: calc(90vh - 65px);
}

.pdf-viewer-embed {
  width: 100%;
  background: #ffffff;
}
</style>