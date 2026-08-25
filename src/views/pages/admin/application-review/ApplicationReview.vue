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
    <div class="review-scroll">

      <!-- ================= PERSONAL INFORMATION ================= -->
      <div class="form-section">
        <div class="section-header">
          <i class="bi bi-person-fill"></i>
          <span>ព័ត៌មានផ្ទាល់ខ្លួន</span>
        </div>
      </div>

      <!-- 1 -->
      <div class="question-card">
        <div class="question">
          1. លេខទូរសព្ទរបស់អ្នក
        </div>

        <div class="answer">
          091 234 567
        </div>
      </div>

      <!-- 2 -->
      <div class="question-card">
        <div class="question">
          2. Username Telegram
        </div>

        <div class="answer">
          @neang_std
        </div>
      </div>

      <!-- 3 -->
      <div class="question-card">
        <div class="question">
          3. អុីម៉ែលរបស់អ្នក
        </div>

        <div class="answer">
          laysokneang@gmail.com
        </div>
      </div>

      <!-- 4 -->
      <div class="question-card">
        <div class="question">
          4. ឈ្មោះជាភាសាខ្មែរ
        </div>

        <div class="answer">
          ឡាយ សុខនាង
        </div>
      </div>

      <!-- 5 -->
      <div class="question-card">
        <div class="question">
          5. ឈ្មោះជាភាសាឡាតាំង
        </div>

        <div class="answer">
          Lay Sokneang
        </div>
      </div>

      <!-- 6 -->
      <div class="question-card">
        <div class="question">
          6. ភេទ
        </div>

        <div class="selected-option">
          <i class="bi bi-check-circle-fill"></i>
          ស្រី
        </div>
      </div>

      <!-- 7 -->
      <div class="question-card">
        <div class="question">
          7. ថ្ងៃ ខែ ឆ្នាំកំណើត
        </div>

        <div class="answer">
          08/08/2004
        </div>
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
        <div class="question">
          8. តើអ្នកកំពុងសិក្សានៅកម្រិតសញ្ញាបត្រណាដែរ?
        </div>

        <div class="selected-option">
          <i class="bi bi-check-circle-fill"></i>
          បរិញ្ញាបត្រ
        </div>
      </div>

      <!-- 9 -->
      <div class="question-card">
        <div class="question">
          9. តើអ្នកកំពុងសិក្សានៅសាលាណាដែរ?
        </div>

        <div class="answer">
          Royal University of Phnom Penh
        </div>
      </div>

      <!-- 10 -->
      <div class="question-card">
        <div class="question">
          10. តើអ្នកកំពុងសិក្សាឆ្នាំទីប៉ុន្មាន?
        </div>

        <div class="answer">
          ឆ្នាំទី 4
        </div>
      </div>

      <!-- 11 -->
      <div class="question-card">
        <div class="question">
          11. តើអ្នកកំពុងសិក្សាឆមាសទីប៉ុន្មាន?
        </div>

        <div class="answer">
          ឆមាសទី 2
        </div>
      </div>

      <!-- 12 -->
      <div class="question-card">
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
              My_Photo_card.png
            </div>

            <small class="text-muted">
              Image file
            </small>
          </div>

          <button
            type="button"
            class="btn btn-sm btn-light"
          >
            <i class="bi bi-eye"></i>
          </button>

          <button
            type="button"
            class="btn btn-sm btn-light"
          >
            <i class="bi bi-download"></i>
          </button>
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
        <div class="question">
          13. សូមបំពេញទីលំនៅបច្ចុប្បន្ន
        </div>

        <div class="answer long-answer">
          ភូមិព្រែកថ្មី ឃុំកោះចិន ស្រុកពញាឮ
          ខេត្តកណ្តាល
        </div>
      </div>

      <!-- 14 -->
      <div class="question-card">
        <div class="question">
          14. តើអ្នកទទួលបានព័ត៌មានអាហារូបករណ៍
          របស់យើងតាមរយៈអ្វីដែរ?
        </div>

        <div class="selected-option">
          <i class="bi bi-check-circle-fill"></i>
          បណ្តាញសង្គម
        </div>
      </div>

      <!-- 15 -->
      <div class="question-card">
        <div class="question">
          15. តើអ្វីទៅជាភាពខ្លាំងរបស់អ្នក?
        </div>

        <div class="answer long-answer">
          ខិតខំប្រឹងប្រែង និងមានការទទួលខុសត្រូវ
          រៀនសូត្របានលឿន និងចូលចិត្តស្វែងយល់អ្វីថ្មី។
        </div>
      </div>

      <!-- 16 -->
      <div class="question-card">
        <div class="question">
          16. តើអ្វីទៅជាភាពខ្សោយរបស់អ្នក?
        </div>

        <div class="answer long-answer">
          ពេលខ្លះខ្វះទំនុកចិត្តនៅពេលនិយាយមុខមនុស្សច្រើន
          មានទំនោរចំណាយពេលច្រើនលើការធ្វើឱ្យការងារមានភាពល្អឥតខ្ចោះ
          និងត្រូវការបង្កើនជំនាញក្នុងការគ្រប់គ្រងពេលវេលា។
        </div>
      </div>

      <!-- 17 -->
      <div class="question-card">
        <div class="question">
          17. តើអ្វីដែលជាគោលបំណងក្នុងថ្ងៃអនាគតរបស់អ្នក?
        </div>

        <div class="answer long-answer">
          ចង់ក្លាយជា Full Stack Developer
          និងធ្វើការនៅក្នុងក្រុមហ៊ុនបច្ចេកវិទ្យា។
        </div>
      </div>

      <!-- 18 -->
      <div class="question-card">
        <div class="question">
          18. មូលហេតុដែលអ្នកចង់ទទួលបានអាហារូបករណ៍
          ពីថ្នាក់បណ្តុះបណ្តាលបច្ចេកវិទ្យាអាន-ANT
        </div>

        <div class="answer long-answer">
          ខ្ញុំចង់បង្កើនចំណេះដឹង និងជំនាញផ្នែកបច្ចេកវិទ្យា
          ដើម្បីអភិវឌ្ឍសមត្ថភាព និងមានឱកាសការងារល្អប្រសើរ
          នាពេលអនាគត។
        </div>
      </div>

      <!-- 19 -->
      <div class="question-card">
        <div class="question">
          19. ចូររៀបរាប់ពីស្ថានភាពបច្ចុប្បន្នរបស់អ្នក
        </div>

        <div class="answer long-answer">
          បច្ចុប្បន្ន ខ្ញុំកំពុងសិក្សានៅសាកលវិទ្យាល័យ
          ផ្នែកវិទ្យាសាស្ត្រកុំព្យូទ័រ ហើយកំពុងខិតខំបង្កើន
          ចំណេះដឹង និងជំនាញផ្នែកបច្ចេកវិទ្យា ជាពិសេស
          ការអភិវឌ្ឍគេហទំព័រ។ ខ្ញុំក៏កំពុងស្វែងរកឱកាស
          ដើម្បីទទួលបានបទពិសោធន៍ជាក់ស្តែង។
        </div>
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
        <div class="question">
          20. សូមជ្រើសរើសអាហារូបករណ៍ដែលអ្នកចង់ស្នើសុំ
        </div>

        <div class="selected-option">
          <i class="bi bi-check-circle-fill"></i>
          Web Development
        </div>
      </div>

      <!-- 21 -->
      <div class="question-card">
        <div class="question">
          21. សូមជ្រើសរើសម៉ោងសិក្សាដែលអ្នកចង់រៀន
        </div>

        <div class="selected-option">
          <i class="bi bi-check-circle-fill"></i>
          វេនព្រឹក
        </div>

        <div class="schedule-text">
          ចន្ទ ដល់ សៅរ៍ · 07:50 ដល់ 10:50
        </div>
      </div>

      <!-- 22 -->
      <div class="question-card">
        <div class="question">
          22. ហេតុអ្វីអ្នកចង់ជ្រើសរើសជំនាញខាងលើ?
        </div>

        <div class="answer long-answer">
          ខ្ញុំចាប់អារម្មណ៍លើការអភិវឌ្ឍគេហទំព័រ
          និងចង់រៀនពីការបង្កើត Web Application
          ពីមូលដ្ឋានរហូតដល់កម្រិតអាចអនុវត្តបាន។
        </div>
      </div>

      <!-- 23 -->
      <div class="question-card">
        <div class="question">
          23. Website ឬ App ដែលអ្នកចាប់អារម្មណ៍
        </div>

        <div class="answer">
          TikTok, YouTube, Facebook, Instagram, LinkedIn
        </div>
      </div>

      <!-- 24 -->
      <div class="question-card">
        <div class="question">
          24. តើអាហារូបករណ៍នេះនឹងចូលរួមជាប្រយោជន៍
          អ្វីខ្លះទៅដល់ប្រទេសរបស់យើង?
        </div>

        <div class="answer long-answer">
          ខ្ញុំជឿជាក់ថា អាហារូបករណ៍នេះនឹងផ្តល់អត្ថប្រយោជន៍
          យ៉ាងសំខាន់ដល់ខ្ញុំ និងប្រទេសកម្ពុជា ព្រោះវាផ្តល់
          ឱកាសឱ្យយុវជនទទួលបានចំណេះដឹង និងជំនាញ
          ផ្នែកបច្ចេកវិទ្យាឌីជីថល។
        </div>
      </div>


      <!-- ================= FILES ================= -->
      <div class="form-section">
        <div class="section-header">
          <i class="bi bi-file-earmark-check-fill"></i>
          <span>ឯកសារ និងរូបថត</span>
        </div>
      </div>

      <!-- 25 -->
      <div class="question-card">
        <div class="question">
          25. សូម Upload រូបភាពទំហំ ៤x៦ ផ្ទៃពណ៌ខៀវ
        </div>

        <div class="file-answer">
          <div class="file-icon">
            <i class="bi bi-image"></i>
          </div>

          <div class="flex-grow-1">
            <div class="fw-semibold">
              My_photo.png
            </div>

            <small class="text-muted">
              Image file
            </small>
          </div>

          <button
            type="button"
            class="btn btn-sm btn-light"
          >
            <i class="bi bi-eye"></i>
          </button>

          <button
            type="button"
            class="btn btn-sm btn-light"
          >
            <i class="bi bi-download"></i>
          </button>
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
        >
          <i class="bi bi-person-x-fill me-2"></i>
          បញ្ជីខ្មៅ
        </button>

        <!-- Shortlist -->
        <button
          type="button"
          class="btn shortlist-btn px-4"
          @click="handleShortlist"
        >
          <i class="bi bi-person-check-fill me-2"></i>
          ជ្រើសសម្រាំង
        </button>

      </div>

    </div>

  </div>
</template>


<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const loading = ref(false);

const goBack = () => {
  router.back();
};

const handleBlacklist = () => {
  console.log("Blacklist student");
};

const handleShortlist = () => {
  console.log("Shortlist student");
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
  background: #2d6657;
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