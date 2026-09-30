import { ref, computed } from "vue";
import evaluationService from "@/services/evaluation.service";
import submissionService from "@/services/submission.service";
import { useAppToast } from "@/composable/useAppToast";
import {
  SUBJECT_TABS_CONFIG,
  isMatchingSubject,
  createEmptyEvaluationForm,
  normalizeScore,
} from "@/utils/candidateEvaluation";

export const useEvaluationForm = (submissionId) => {
  const toast = useAppToast();
  const loading = ref(false);
  const submitting = ref(false);
  const error = ref(null);

  const submission = ref(null);
  const student = ref(null);
  const evaluations = ref([]);

  // Default to CPP as first subject
  const activeSubject = ref("CPP");

  // Form state for each subject
  const forms = ref(createEmptyEvaluationForm());

  // Pristine snapshot of forms for dirty-checking
  const originalForms = ref(createEmptyEvaluationForm());

  // Check if active subject has already been evaluated
  const isUpdateEvaluation = computed(() => {
    return evaluations.value?.some((e) =>
      isMatchingSubject(e.subject, activeSubject.value, submission.value?.program)
    );
  });

  // Check if teacher has changed any old values for the active subject
  const hasFormChanged = computed(() => {
    const orig = originalForms.value[activeSubject.value];
    const curr = currentForm.value;
    if (!orig || !curr) return false;

    const origTech = normalizeScore(orig.technicalScore);
    const currTech = normalizeScore(curr.technicalScore);

    const origAtt = normalizeScore(orig.attendanceScore);
    const currAtt = normalizeScore(curr.attendanceScore);

    const origComment = (orig.comment || "").trim();
    const currComment = (curr.comment || "").trim();

    return origTech !== currTech || origAtt !== currAtt || origComment !== currComment;
  });

  // Check if the current form has valid inputs
  const isFormValid = computed(() => {
    const form = currentForm.value;
    if (!form) return false;

    const techStr = String(form.technicalScore ?? "").trim();
    const attStr = String(form.attendanceScore ?? "").trim();
    const commentStr = String(form.comment ?? "").trim();

    if (techStr === "" || attStr === "") return false;

    const tech = Number(techStr);
    const att = Number(attStr);

    if (isNaN(tech) || tech < 0 || tech > 100) return false;
    if (isNaN(att) || att < 0 || att > 100) return false;
    if (!commentStr) return false;

    return true;
  });

  // Submit button should be enabled ONLY if scores are entered AND (for updates) values have changed
  const canSubmit = computed(() => {
    if (submitting.value) return false;
    if (!isFormValid.value) return false;
    if (isUpdateEvaluation.value && !hasFormChanged.value) {
      return false;
    }
    return true;
  });

  // Allowed subjects based on student program
  const subjectTabs = computed(() => {
    const program = submission.value?.program || "WEB_DEVELOPMENT";
    return SUBJECT_TABS_CONFIG[program] || SUBJECT_TABS_CONFIG.WEB_DEVELOPMENT;
  });

  // Current active form
  const currentForm = computed(() => {
    if (!forms.value[activeSubject.value]) {
      forms.value[activeSubject.value] = {
        technicalScore: "",
        attendanceScore: "",
        comment: "",
      };
    }
    return forms.value[activeSubject.value];
  });

  // Fetch submission and evaluation data
  const fetchEvaluationData = async () => {
    if (!submissionId) return;
    loading.value = true;
    error.value = null;

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

      // Reset forms
      forms.value = createEmptyEvaluationForm();

      // Populate form data from existing evaluations
      if (evaluations.value.length > 0) {
        const program = mergedSubmission.program;
        evaluations.value.forEach((ev) => {
          const subjects = ["CPP", "HTML_CSS", "INTRO_MOBILE", "INTRO_WEB", "INTRO_CYBER"];
          const matchedKey = subjects.find((targetKey) =>
            isMatchingSubject(ev.subject, targetKey, program)
          );

          if (matchedKey && forms.value[matchedKey]) {
            forms.value[matchedKey] = {
              technicalScore: ev.technicalScore != null ? String(ev.technicalScore) : "",
              attendanceScore: ev.attendanceScore != null ? String(ev.attendanceScore) : "",
              comment: ev.comment || "",
              id: ev.id,
            };
          }
        });
      }

      // Snapshot pristine forms for dirty checking
      originalForms.value = JSON.parse(JSON.stringify(forms.value));

      // Ensure active subject matches allowed subjects
      const validKeys = subjectTabs.value.map((t) => t.key);
      if (!validKeys.includes(activeSubject.value)) {
        activeSubject.value = validKeys[0] || (mergedSubmission.program === "MOBILE_APP" ? "CPP" : "HTML_CSS");
      }
    } catch (err) {
      console.error("Failed to load evaluation data:", err);
      error.value = err.response?.data?.message || "មិនអាចទាញយកទិន្នន័យការវាយតម្លៃបានទេ";
    } finally {
      loading.value = false;
    }
  };

  // Quick feedback tag click handler
  const addQuickTag = (tagText) => {
    const cleanText = tagText.replace(/^\+\s*/, "").trim();
    const existing = (currentForm.value.comment || "").trim();
    if (!existing) {
      currentForm.value.comment = cleanText;
    } else {
      const parts = existing.split(",").map((p) => p.trim());
      if (!parts.includes(cleanText)) {
        currentForm.value.comment = `${existing} , ${cleanText}`;
      }
    }
  };

  // Live score computations across all evaluated subjects or form inputs
  const liveScores = computed(() => {
    const validKeys = subjectTabs.value.map((t) => t.key);
    let totalTech = 0;
    let techCount = 0;
    let totalAtt = 0;
    let attCount = 0;

    validKeys.forEach((key) => {
      const f = forms.value[key];
      const ev = evaluations.value.find((e) =>
        isMatchingSubject(e.subject, key, submission.value?.program)
      );

      const tech =
        f && f.technicalScore !== "" && !isNaN(Number(f.technicalScore))
          ? Number(f.technicalScore)
          : ev?.technicalScore != null
          ? Number(ev.technicalScore)
          : null;

      const att =
        f && f.attendanceScore !== "" && !isNaN(Number(f.attendanceScore))
          ? Number(f.attendanceScore)
          : ev?.attendanceScore != null
          ? Number(ev.attendanceScore)
          : null;

      if (tech != null) {
        totalTech += tech;
        techCount++;
      }
      if (att != null) {
        totalAtt += att;
        attCount++;
      }
    });

    const avgTech = techCount > 0 ? Math.round((totalTech / techCount) * 10) / 10 : 0;
    const avgAtt = attCount > 0 ? Math.round((totalAtt / attCount) * 10) / 10 : 0;
    const overall =
      techCount > 0 || attCount > 0
        ? Math.round((avgTech + avgAtt) / 2)
        : submission.value?.overallAverageScore != null
        ? Math.round(submission.value.overallAverageScore)
        : 0;

    return {
      avgTech,
      avgAtt,
      overall,
    };
  });

  // Submit evaluation for the active subject
  const submitEvaluation = async () => {
    const form = currentForm.value;
    const tech = Number(form.technicalScore);
    const att = Number(form.attendanceScore);

    // Validations
    if (form.technicalScore === "" || isNaN(tech) || tech < 0 || tech > 100) {
      toast.warning("សូមបញ្ចូលពិន្ទុថ្នាក់រៀន (Technical Score) ពី ០ ដល់ ១០០");
      return false;
    }

    if (form.attendanceScore === "" || isNaN(att) || att < 0 || att > 100) {
      toast.warning("សូមបញ្ចូលពិន្ទុវត្តមាន (Attendance Score) ពី ០ ដល់ ១០០");
      return false;
    }

    if (!form.comment || !form.comment.trim()) {
      toast.warning("សូមបញ្ចូលមតិយោបល់សម្រាប់ការវាយតម្លៃ");
      return false;
    }

    submitting.value = true;
    try {
      const payload = {
        submissionId: Number(submissionId),
        comment: form.comment.trim(),
        scores: [
          {
            subject: activeSubject.value,
            attendanceScore: att,
            technicalScore: tech,
          },
        ],
      };

      const existingEval = evaluations.value.find((e) =>
        isMatchingSubject(e.subject, activeSubject.value, submission.value?.program)
      );

      let response;
      if (existingEval) {
        response = await evaluationService.updateBySubmissionId(submissionId, payload);
      } else {
        response = await evaluationService.create(payload);
      }

      if (response.data?.success) {
        toast.success(
          existingEval
            ? "បានកែប្រែការវាយតម្លៃដោយជោគជ័យ!"
            : "បានបញ្ជូនការវាយតម្លៃដោយជោគជ័យ!"
        );
        await fetchEvaluationData();
        return true;
      } else {
        toast.error(response.data?.message || "បរាជ័យក្នុងការបញ្ជូនការវាយតម្លៃ");
        return false;
      }
    } catch (err) {
      console.error("Submission failed:", err);
      const msg = err.response?.data?.message || "បរាជ័យក្នុងការបញ្ជូនការវាយតម្លៃ";
      toast.error(msg);
      return false;
    } finally {
      submitting.value = false;
    }
  };

  return {
    loading,
    submitting,
    error,
    submission,
    student,
    evaluations,
    activeSubject,
    subjectTabs,
    forms,
    currentForm,
    liveScores,
    isUpdateEvaluation,
    hasFormChanged,
    isFormValid,
    canSubmit,
    fetchEvaluationData,
    addQuickTag,
    submitEvaluation,
  };
};
