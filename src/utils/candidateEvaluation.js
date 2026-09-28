import {
  PROGRAM_MAP,
  SHIFT_MAP,
  GENDER_MAP,
  YEAR_MAP,
  formatKhmerDate,
} from "@/constants/mappings";

/**
 * Safely parse a score value to a number or null
 */
export function parseScore(val) {
  if (val === null || val === undefined || val === "") return null;
  const num = parseFloat(val);
  return isNaN(num) ? null : num;
}

/**
 * Normalize score value for comparison / display
 */
export function normalizeScore(val) {
  if (val === "" || val == null) return "";
  const n = Number(val);
  return isNaN(n) ? String(val).trim() : String(n);
}

/**
 * Subject tabs configuration for Teacher evaluation
 */
export const SUBJECT_TABS_CONFIG = {
  MOBILE_APP: [
    { key: "CPP", name: "C++", color: "green", logo: "cpp" },
    { key: "INTRO_MOBILE", name: "Introduction", color: "blue", logo: "introduction" },
    { key: "INTRO_CYBER", name: "Cyber Security", color: "purple", logo: "cyber" },
  ],
  WEB_DEVELOPMENT: [
    { key: "HTML_CSS", name: "HTML & CSS", color: "orange", logo: "html_css" },
    { key: "INTRO_WEB", name: "Introduction", color: "blue", logo: "introduction" },
    { key: "INTRO_CYBER", name: "Cyber Security", color: "purple", logo: "cyber" },
  ],
};

/**
 * Match evaluation subject name against standard subject key
 */
export function isMatchingSubject(evalSubject, targetSubject, program = null) {
  const s = String(evalSubject || "").toUpperCase().trim();
  const t = String(targetSubject || "").toUpperCase().trim();
  if (s === t) return true;

  if (t === "CPP") {
    return s === "CPP" || s === "C++" || s.includes("CPP");
  }
  if (t === "HTML_CSS") {
    return s === "HTML_CSS" || s === "HTML&CSS" || s.includes("HTML") || s.includes("CSS");
  }
  if (t === "INTRO_MOBILE") {
    return (
      s === "INTRO_MOBILE" ||
      (s.includes("INTRO") && s.includes("MOBILE")) ||
      (s === "INTRODUCTION" && program === "MOBILE_APP")
    );
  }
  if (t === "INTRO_WEB") {
    return (
      s === "INTRO_WEB" ||
      (s.includes("INTRO") && s.includes("WEB")) ||
      (s === "INTRODUCTION" && program !== "MOBILE_APP")
    );
  }
  if (t === "INTRO_CYBER") {
    return s === "INTRO_CYBER" || s === "CYBER" || s.includes("CYBER");
  }
  return false;
}

/**
 * Create initial empty evaluation forms
 */
export function createEmptyEvaluationForm() {
  return {
    CPP: { technicalScore: "", attendanceScore: "", comment: "" },
    HTML_CSS: { technicalScore: "", attendanceScore: "", comment: "" },
    INTRO_MOBILE: { technicalScore: "", attendanceScore: "", comment: "" },
    INTRO_WEB: { technicalScore: "", attendanceScore: "", comment: "" },
    INTRO_CYBER: { technicalScore: "", attendanceScore: "", comment: "" },
  };
}

/**
 * Transforms a raw submission with evaluations into standard candidate format
 */
export function transformCandidate(sub) {
  let score_technology = 0; // C++
  let score_attendance = 0; // HTML / Dart
  let cppScore = null;
  let dartScore = null;
  let htmlCssScore = null;
  let introScore = null;
  let cyberScore = null;

  if (Array.isArray(sub?.evaluations)) {
    sub.evaluations.forEach((ev) => {
      const subj = (ev.subject || "").toUpperCase();
      const score =
        parseScore(ev.averageScore) ??
        (ev.technicalScore != null && ev.attendanceScore != null
          ? (Number(ev.technicalScore) + Number(ev.attendanceScore)) / 2
          : parseScore(ev.technicalScore) ?? parseScore(ev.attendanceScore));

      if (subj.includes("CYBER")) {
        cyberScore = score;
      } else if (subj.includes("INTRO")) {
        introScore = score;
      } else if (subj === "CPP" || subj === "C++" || subj.includes("CPP")) {
        score_technology = score ?? 0;
        cppScore = score;
      } else if (subj === "DART") {
        score_attendance = score ?? 0;
        dartScore = score;
      } else if (subj.includes("HTML") || subj.includes("CSS")) {
        score_attendance = score ?? 0;
        htmlCssScore = score;
      }
    });
  }

  // Specialized subject: C++ for Mobile App, HTML & CSS for Web Dev
  const specializedScore =
    (sub?.program === "MOBILE_APP" ? cppScore : htmlCssScore) ??
    cppScore ??
    htmlCssScore ??
    dartScore;

  let overallScore = parseScore(sub?.overallAverageScore);
  if (overallScore == null) {
    const activeScores = [introScore, specializedScore, cyberScore].filter(
      (s) => s != null
    );
    if (activeScores.length > 0) {
      overallScore =
        activeScores.reduce((acc, v) => acc + v, 0) / activeScores.length;
    }
  }

  const submittedTime = sub?.submittedAt
    ? new Date(sub.submittedAt).getTime()
    : 0;
  const groupNum =
    sub?.submissionGroup?.groupNumber ??
    sub?.groupNumber ??
    sub?.group ??
    null;
  const groupText = groupNum ? `ក្រុម ${groupNum}` : "—";

  return {
    id: sub?.id,
    name:
      sub?.student?.khName ||
      sub?.student?.enName ||
      sub?.student?.email ||
      "N/A",
    gender: GENDER_MAP[sub?.student?.gender] || sub?.student?.gender || "N/A",
    year: YEAR_MAP[sub?.yearOfStudy] || sub?.yearOfStudy || "N/A",
    group: groupText,
    group_number: groupNum,
    skill: PROGRAM_MAP[sub?.program] || sub?.program || "N/A",
    study_shift: SHIFT_MAP[sub?.shift] || sub?.shift || "N/A",
    status: sub?.status,
    score_intro:
      introScore != null ? parseFloat(introScore).toFixed(2) : "0.00",
    score_specialized:
      specializedScore != null
        ? parseFloat(specializedScore).toFixed(2)
        : "0.00",
    score_cyber:
      cyberScore != null ? parseFloat(cyberScore).toFixed(2) : "0.00",
    score_technology: score_technology
      ? parseFloat(score_technology).toFixed(2)
      : "0.00",
    score_attendance: score_attendance
      ? parseFloat(score_attendance).toFixed(2)
      : "0.00",
    total_score: overallScore != null ? overallScore.toFixed(2) : "0.00",
    created_at: sub?.submittedAt ? formatKhmerDate(sub.submittedAt) : "N/A",
    is_evaluated:
      Boolean(sub?.isEvaluated) ||
      (Array.isArray(sub?.evaluations) && sub.evaluations.length >= 2),
    _cppScore: cppScore,
    _dartScore: dartScore,
    _htmlCssScore: htmlCssScore,
    _introScore: introScore,
    _specializedScore: specializedScore,
    _cyberScore: cyberScore,
    _totalScore: overallScore,
    _submittedAt: submittedTime,
    raw: sub,
  };
}
