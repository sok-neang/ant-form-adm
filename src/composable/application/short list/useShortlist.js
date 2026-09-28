import submissionService from "@/services/submission.service";
import { usePaginatedList } from "@/composable/usePaginatedList";
import { transformCandidate } from "@/utils/candidateEvaluation";

export function useShortlist() {
  return usePaginatedList({
    fetchService: submissionService.getShortlist,
    transformItem: (item, seqNum) => ({
      seq_num: seqNum,
      ...transformCandidate(item),
    }),
  });
}

export function usePassedShortlist() {
  return usePaginatedList({
    fetchService: submissionService.getPassShortlist,
    transformItem: (item, seqNum) => ({
      seq_num: seqNum,
      ...transformCandidate(item),
    }),
  });
}

export function useFailedShortlist() {
  return usePaginatedList({
    fetchService: submissionService.getFailShortlist,
    transformItem: (item, seqNum) => ({
      seq_num: seqNum,
      ...transformCandidate(item),
    }),
  });
}
