import submissionService from "@/services/submission.service";
import { usePaginatedList } from "@/composable/usePaginatedList";
import { transformCandidate } from "@/utils/candidateEvaluation";

export function useFinalResult() {
  return usePaginatedList({
    fetchService: submissionService.getAllFinalResult,
    transformItem: (item, seqNum) => ({
      seq_num: seqNum,
      ...transformCandidate(item),
    }),
  });
}

export function usePassedFinalResult() {
  return usePaginatedList({
    fetchService: submissionService.getPassFinalResult,
    transformItem: (item, seqNum) => ({
      seq_num: seqNum,
      ...transformCandidate(item),
    }),
  });
}

export function useReservedFinalResult() {
  return usePaginatedList({
    fetchService: submissionService.getReservedFinalResult,
    transformItem: (item, seqNum) => ({
      seq_num: seqNum,
      ...transformCandidate(item),
    }),
  });
}

