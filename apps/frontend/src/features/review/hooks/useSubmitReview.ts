import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitReview } from "../api/reviewApi";
import type { SubmitReviewBody } from "../types";

export function useSubmitReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ vocabId, body }: { vocabId: number; body: SubmitReviewBody }) =>
      submitReview(vocabId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", "queue"] });
    },
  });
}
