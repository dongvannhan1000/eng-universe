type ReviewResult = "AGAIN" | "HARD" | "GOOD" | "EASY";

export interface Vocab {
  id: number;
  userId: number;
  word: string;
  meaningVi: string;
  explanationEn: string | null;
  notes: string | null;
  tags: string[];
  timecodeSec: number | null;
  captureBatchId: number | null;
  addedAt: string;
  lastReviewedAt: string | null;
  isSuspended: boolean;
  dueAt: string;
  intervalDays: number;
  ease: number;
  repetitions: number;
  lapses: number;
  lastResult: ReviewResult | null;
  // Relations
}

export interface CreateVocabInput {
  word: string;
  meaningVi: string;
  tags: string[];
  explanationEn?: string;
  notes?: string;
  timecodeSec?: number;
  captureBatchId?: string;
}

export interface VocabListParams {
  q?: string;
  tags?: string[];
  from?: string | null;
  to?: string | null;
  page?: number;
  limit?: number;
}

export interface PaginatedVocab {
  total: number;
  skip: number;
  take: number;
  items: Vocab[];
}
