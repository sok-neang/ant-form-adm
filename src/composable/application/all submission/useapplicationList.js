import submissionService from "@/services/submission.service";
import { usePaginatedList } from "@/composable/usePaginatedList";

import {
  PROGRAM_MAP,
  SHIFT_MAP,
  GENDER_MAP,
  YEAR_MAP,
  formatKhmerDate,
} from "@/constants/mappings";

/**
 * Transform submission data for table display
 */
const transformApplication = (sub, seqNum) => ({
  seq_num: seqNum,
  id: sub.id,

  name:
    sub.student?.khName ||
    sub.student?.enName ||
    sub.student?.email ||
    "N/A",

  gender:
    GENDER_MAP[sub.student?.gender] ||
    sub.student?.gender ||
    "N/A",

  year:
    YEAR_MAP[sub.yearOfStudy] ||
    sub.yearOfStudy ||
    "N/A",

  skill:
    PROGRAM_MAP[sub.program] ||
    sub.program ||
    "N/A",

  study_shift:
    SHIFT_MAP[sub.shift] ||
    sub.shift ||
    "N/A",

  created_at: formatKhmerDate(sub.submittedAt),
});

/**
 * All Applications
 */
export function useApplicationList() {
  const paginated = usePaginatedList({
    fetchService: submissionService.getSubmissions,
    defaultParams: {
      submittedAt: "newest",
    },
    transformItem: (sub, seqNum) => ({
      ...transformApplication(sub, seqNum),

      rawProgram: sub.program,
      rawShift: sub.shift,
      isContacted: Boolean(sub.isContacted),
      raw: sub,
    }),
  });

  const fetchSubmissionsById = async (id) => {
    try {
      paginated.loading.value = true;

      const response = await submissionService.getSubmissionsById(id);

      if (response.data?.success) {
        return response.data.data;
      }
    } catch (error) {
      console.error("Error fetching user submission:", error);
    } finally {
      paginated.loading.value = false;
    }
  };

  const fetchFailSubmissions = async (params = {}) => {
    try {
      paginated.loading.value = true;

      const response = await submissionService.getFailSubmissions(params);

      if (response.data?.success) {
        return response.data.data;
      }
    } catch (error) {
      console.error("Error fetching failed submissions:", error);
    } finally {
      paginated.loading.value = false;
    }
  };

  const fetchPassSubmissions = async (params = {}) => {
    try {
      paginated.loading.value = true;

      const response = await submissionService.getPassSubmissions(params);

      if (response.data?.success) {
        return response.data.data;
      }
    } catch (error) {
      console.error("Error fetching passed submissions:", error);
    } finally {
      paginated.loading.value = false;
    }
  };

  const deleteSubmission = async (id) => {
    try {
      paginated.loading.value = true;

      const response = await submissionService.deleteSubmission(id);

      return response.data;
    } catch (error) {
      console.error("Error deleting user submission:", error);
      throw error;
    } finally {
      paginated.loading.value = false;
    }
  };

  const updateShiftOrProgram = async (id, params = {}) => {
    try {
      paginated.loading.value = true;

      const response = await submissionService.updateShiftOrProgram(
        id,
        params
      );

      return response.data;
    } catch (error) {
      console.error("Error updating user submission:", error);
      throw error;
    } finally {
      paginated.loading.value = false;
    }
  };

  return {
    ...paginated,
    fetchSubmissionsById,
    fetchFailSubmissions,
    fetchPassSubmissions,
    deleteSubmission,
    updateShiftOrProgram,
  };
}

/**
 * Failed Applications
 */
export function useFailedApplicationList() {
  return usePaginatedList({
    fetchService: submissionService.getFailSubmissions,
    transformItem: transformApplication,
  });
}

/**
 * Passed Applications
 */
export function usePassedApplicationList() {
  return usePaginatedList({
    fetchService: submissionService.getPassSubmissions,
    transformItem: transformApplication,
  });
}