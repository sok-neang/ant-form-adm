import { ref, computed, watch } from "vue";
import evaluationService from "@/services/evaluation.service";
import submissionService from "@/services/submission.service";
import { useAppToast } from "@/composable/useAppToast";

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
  const forms = ref({
    CPP: { technicalScore: "", attendanceScore: "", comment: "" },
    HTML_CSS: { technicalScore: "", attendanceScore: "", comment: "" },
    DART: { technicalScore: "", attendanceScore: "", comment: "" },
  });

  // Allowed subjects based on student program
  const subjectTabs = computed(() => {
    const program = submission.value?.program || "WEB_DEVELOPMENT";
    if (program === "MOBILE_APP") {
      return [
        { key: "CPP", name: "C++", logo: "cpp" },
        { key: "DART", name: "Dart", logo: "dart" },
      ];
    }
    return [
      { key: "CPP", name: "C++", logo: "cpp" },
      { key: "HTML_CSS", name: "HTML & CSS", logo: "html_css" },
    ];
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
      // Fetch both submission details and evaluation details
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

      // Populate form data from existing evaluations
      if (evaluations.value.length > 0) {
        evaluations.value.forEach((ev) => {
          const subKey = (ev.subject || "").toUpperCase();
          let targetKey = subKey;
          if (subKey.includes("CPP") || subKey === "C++") targetKey = "CPP";
          else if (subKey.includes("HTML") || subKey.includes("CSS")) targetKey = "HTML_CSS";
          else if (subKey.includes("DART")) targetKey = "DART";

          if (forms.value[targetKey]) {
            forms.value[targetKey] = {
              technicalScore: ev.technicalScore != null ? ev.technicalScore : "",
              attendanceScore: ev.attendanceScore != null ? ev.attendanceScore : "",
              comment: ev.comment || "",
              id: ev.id,
            };
          }
        });
      }

      // Ensure active subject matches allowed subjects
      const validKeys = subjectTabs.value.map((t) => t.key);
      if (!validKeys.includes(activeSubject.value)) {
        activeSubject.value = validKeys[0] || "CPP";
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
      const ev = evaluations.value.find((e) => {
        const s = (e.subject || "").toUpperCase();
        return s === key || (key === "CPP" && s.includes("CPP")) || (key === "HTML_CSS" && (s.includes("HTML") || s.includes("CSS"))) || (key === "DART" && s.includes("DART"));
      });

      const tech = f.technicalScore !== "" && !isNaN(Number(f.technicalScore))
        ? Number(f.technicalScore)
        : ev?.technicalScore != null ? Number(ev.technicalScore) : null;

      const att = f.attendanceScore !== "" && !isNaN(Number(f.attendanceScore))
        ? Number(f.attendanceScore)
        : ev?.attendanceScore != null ? Number(ev.attendanceScore) : null;

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
    const overall = (techCount > 0 || attCount > 0)
      ? Math.round(((avgTech + avgAtt) / 2))
      : submission.value?.overallAverageScore != null ? Math.round(submission.value.overallAverageScore) : 0;

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

      // Check if this subject has already been evaluated
      const existingEval = evaluations.value.find((e) => {
        const s = (e.subject || "").toUpperCase();
        return s === activeSubject.value || (activeSubject.value === "CPP" && s.includes("CPP")) || (activeSubject.value === "HTML_CSS" && (s.includes("HTML") || s.includes("CSS"))) || (activeSubject.value === "DART" && s.includes("DART"));
      });

      let response;
      if (existingEval) {
        response = await evaluationService.updateBySubmissionId(submissionId, payload);
      } else {
        response = await evaluationService.create(payload);
      }

      if (response.data?.success) {
        toast.success("បានបញ្ជូនការវាយតម្លៃដោយជោគជ័យ!");
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
    fetchEvaluationData,
    addQuickTag,
    submitEvaluation,
  };
};
