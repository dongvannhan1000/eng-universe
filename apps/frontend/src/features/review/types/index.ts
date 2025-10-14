export type ReviewResult = "AGAIN" | "HARD" | "GOOD" | "EASY";

export interface VocabCard {
  id: number;
  word: string;
  meaningVi: string;
  explanationEn?: string | null;
  notes?: string | null;
  tags: string[];
  timecodeSec?: number | null;
  dueAt: string; // ISO
  intervalDays: number;
  ease: number; // 130..350
  repetitions: number;
  lapses: number;
  lastResult?: ReviewResult | null;
  lastReviewedAt?: string | null;
  // Additional fields from backend Vocab model
  captureBatchId?: number | null;
  addedAt?: string;
  isSuspended?: boolean;
}

export interface ReviewQueueResponse {
  items: VocabCard[];
  dueBefore: string; // ISO date
}

export interface SubmitReviewBody {
  result: ReviewResult;
  durationSec?: number;
  notes?: string | null;
  reviewedAt?: string; // ISO (optional, defaults to now on backend)
}

export interface SubmitReviewResponse {
  updated: VocabCard;
  review: {
    id: number;
    vocabId: number;
    userId: number;
    reviewedAt: string;
    result: ReviewResult;
    durationSec: number | null;
    notes: string | null;
  };
}

export interface ReviewQueueParams {
  dueBefore?: string; // ISO date
  take?: number; // default 20, max 100
}
