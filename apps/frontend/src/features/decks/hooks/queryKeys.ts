import type { DeckListParams } from "../types";

export const deckQueryKeys = {
  all: ["decks"] as const,
  lists: () => [...deckQueryKeys.all, "list"] as const,
  list: (params: DeckListParams) => [...deckQueryKeys.lists(), params] as const,
  details: () => [...deckQueryKeys.all, "detail"] as const,
  detail: (id: number) => [...deckQueryKeys.details(), id] as const,
};
