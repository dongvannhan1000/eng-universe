import { useQuery } from "@tanstack/react-query";
import { fetchReviewQueue } from "../api/reviewApi";
import type { ReviewQueueParams } from "../types";

export function useReviewQueue(params: ReviewQueueParams = {}) {
  return useQuery({
    queryKey: ["reviews", "queue", params],
    queryFn: () => fetchReviewQueue(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
