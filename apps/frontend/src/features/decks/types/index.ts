export interface Deck {
  id: number;
  slug: string;
  title: string;
  description?: string | null;
  tags: string[];
  // cefr?: string | null; // A2/B1/B2/C1/C2
  createdAt: Date;
  updatedAt: Date;
  items: DeckItem[];
}

export interface DeckItem {
  id: number;
  deckId: number;
  headword: string;
  pos?: string | null;
  definition?: string | null;
  // example?: string | null;
  // ipa?: string | null;
  // collocations: string[];
  tags: string[];
  source?: string | null;
  // sourceAttribution?: string | null;
  // sourceUrl?: string | null;
  // license?: string | null;
  // lang: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DeckListParams {
  q?: string;
  tags?: string[];
  cefr?: string;
}

export interface PaginatedDeckItem {
  total: number;
  page: number;
  limit: number;
  items: DeckItem[];
}
