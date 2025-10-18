import type { VocabListParams, PaginatedVocab } from "../types";
import { VOCAB_DATASET } from "./dataset";

export async function fetchVocabs(params: VocabListParams): Promise<PaginatedVocab> {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 250));

  const { q = "", tags = [], from, to, page = 1, limit = 20 } = params;

  let filteredVocabs = [...VOCAB_DATASET];

  // Apply search filter (case-insensitive substring match)
  if (q.trim()) {
    const searchTerm = q.toLowerCase().trim();
    filteredVocabs = filteredVocabs.filter(
      (vocab) =>
        vocab.word.toLowerCase().includes(searchTerm) ||
        vocab.explanationEn.toLowerCase().includes(searchTerm),
    );
  }

  // Apply tags filter (intersection: vocab must contain all selected tags)
  if (tags.length > 0) {
    filteredVocabs = filteredVocabs.filter((vocab) =>
      tags.every((tag) => vocab.tags.includes(tag)),
    );
  }

  // Apply date range filter
  if (from) {
    const fromDate = new Date(from);
    filteredVocabs = filteredVocabs.filter((vocab) => new Date(vocab.addedAt) >= fromDate);
  }

  if (to) {
    const toDate = new Date(to);
    toDate.setHours(23, 59, 59, 999); // Include the entire day
    filteredVocabs = filteredVocabs.filter((vocab) => new Date(vocab.addedAt) <= toDate);
  }

  // Sort by addedAt desc (newest first)
  filteredVocabs.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());

  // Apply pagination
  const total = filteredVocabs.length;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const items = filteredVocabs.slice(startIndex, endIndex);

  return {
    total,
    page,
    limit,
    items,
  };
}
