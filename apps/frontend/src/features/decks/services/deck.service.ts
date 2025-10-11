// src/services/decks.ts
import { http } from "@/lib/http";
import type { DeckListParams, Deck, PaginatedDeckItem } from "../types";

/**
 * Params chuẩn hoá cho list decks (tên field giữ nguyên để khớp backend).
 * - q?: string
 * - tags?: string[]  -> gửi dạng "tag1,tag2"
 * - cefr?: string    -> A1|A2|B1|B2|C1|C2 (tuỳ backend)
 * - page?: number    -> chỉ gửi nếu > 1
 * - limit?: number   -> chỉ gửi nếu khác 20 (mặc định 20)
 */
export type ListDecksParams = DeckListParams & {
  page?: number;
  limit?: number;
};

/** Helper: build query string, bỏ các giá trị mặc định/rỗng */
function buildSearch(params: ListDecksParams): string {
  const sp = new URLSearchParams();

  if (params.q) sp.set("q", params.q.trim());

  if (params.tags && params.tags.length > 0) {
    // backend dạng repeated ?tags=a&tags=b -> nếu cần, đổi sang forEach
    // ở đây chuẩn hoá dạng "a,b" để giống ví dụ Vocab
    sp.set("tags", params.tags.join(","));
  }

  if (params.cefr) sp.set("cefr", params.cefr);

  // phân trang: chỉ gửi khi khác default
  if (params.page && params.page > 1) sp.set("page", String(params.page));
  if (params.limit && params.limit !== 20) sp.set("limit", String(params.limit));

  return sp.toString();
}

/** GET /decks */
export async function listDecks(params: ListDecksParams): Promise<Deck[]> {
  const qs = buildSearch(params);
  const url = qs ? `/decks?${qs}` : "/decks";

  const res = await http.get(url);
  if (res.status >= 400) {
    throw new Error(`Failed to fetch decks: ${res.status} ${res.statusText}`);
  }
  return res.data as Deck[];
}

/** GET /decks/:slug (slug hoặc id string – tuỳ route backend) */
export async function getDeckBySlug(slug: string): Promise<Deck | null> {
  const res = await http.get(`/decks/${encodeURIComponent(slug)}`, {
    validateStatus: () => true, // để tự xử lý 404
  });

  if (res.status === 404) return null;
  if (res.status >= 400) {
    throw new Error(`Failed to fetch deck: ${res.status} ${res.statusText}`);
  }
  return res.data as Deck;
}

/** GET /decks/:id (numeric id) */
export async function getDeckById(id: number): Promise<Deck | null> {
  const res = await http.get(`/decks/${id}`, { validateStatus: () => true });

  if (res.status === 404) return null;
  if (res.status >= 400) {
    throw new Error(`Failed to fetch deck: ${res.status} ${res.statusText}`);
  }
  return res.data as Deck;
}

/** GET /decks/:deckId/items?page=&limit= */
export async function listDeckItems(
  deckId: number,
  page = 1,
  limit = 20,
): Promise<PaginatedDeckItem> {
  const sp = new URLSearchParams();
  if (page > 1) sp.set("page", String(page));
  if (limit !== 20) sp.set("limit", String(limit));

  const qs = sp.toString();
  const url = qs ? `/decks/${deckId}/items?${qs}` : `/decks/${deckId}/items`;

  const res = await http.get(url);
  if (res.status >= 400) {
    throw new Error(`Failed to fetch deck items: ${res.status} ${res.statusText}`);
  }
  return res.data as PaginatedDeckItem;
}
