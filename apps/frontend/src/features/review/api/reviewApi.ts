import type {
  ReviewQueueParams,
  ReviewQueueResponse,
  SubmitReviewBody,
  SubmitReviewResponse,
} from "../types";
import { http } from "@/lib/http";

export async function fetchReviewQueue(
  params: ReviewQueueParams = {},
): Promise<ReviewQueueResponse> {
  const searchParams = new URLSearchParams();

  if (params.take) searchParams.set("take", params.take.toString());
  if (params.dueBefore) searchParams.set("dueBefore", params.dueBefore);

  const res = await http.get(`/vocab/review/queue?${searchParams.toString()}`);

  if (res.status !== 200) {
    throw new Error(`Failed to fetch review queue: ${res.statusText}`);
  }

  return res.data;
}

export async function submitReview(
  vocabId: number,
  body: SubmitReviewBody,
): Promise<SubmitReviewResponse> {
  const res = await http.post(`/vocab/${vocabId}/reviews`, body);

  if (res.status !== 201) {
    throw new Error(`Failed to submit review: ${res.statusText}`);
  }

  return res.data;
}
