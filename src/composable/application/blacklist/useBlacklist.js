import submissionService from "@/services/submission.service";
import { usePaginatedList } from "@/composable/usePaginatedList";
import {
  PROGRAM_MAP,
  SHIFT_MAP,
  GENDER_MAP,
  YEAR_MAP,
  formatKhmerDate,
} from "@/constants/mappings";

export function useBlacklist() {
  return usePaginatedList({
    fetchService: submissionService.getAllBlacklist,
    transformItem: (sub, seqNum) => ({
      seq_num: seqNum,
      id: sub.id,
      name:
        sub.student?.khName ||
        sub.student?.enName ||
        sub.student?.email ||
        "N/A",
      gender: GENDER_MAP[sub.student?.gender] || sub.student?.gender || "N/A",
      year: YEAR_MAP[sub.yearOfStudy] || sub.yearOfStudy || "N/A",
      skill: PROGRAM_MAP[sub.program] || sub.program || "N/A",
      study_shift: SHIFT_MAP[sub.shift] || sub.shift || "N/A",
      created_at: formatKhmerDate(sub.submittedAt),
    }),
  });
}
