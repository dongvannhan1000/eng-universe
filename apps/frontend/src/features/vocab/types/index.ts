export interface Vocab {
  id: number;
  word: string;
  meaningVi: string;
  explanationEn: string;
  tags: string[];
  addedAt: string; // ISO
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
  page: number;
  limit: number;
  items: Vocab[];
}
