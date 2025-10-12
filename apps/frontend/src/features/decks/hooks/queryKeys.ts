export const deckQueryKeys = {
  all: () => ["decks"] as const,
  lists: () => [...deckQueryKeys.all(), "list"] as const,
  details: () => [...deckQueryKeys.all(), "detail"] as const,
  detail: (id: number) => [...deckQueryKeys.details(), id] as const,
  detailBySlug: (slug: string) => [...deckQueryKeys.details(), slug] as const,
  items: (slug: string) => [...deckQueryKeys.detailBySlug(slug), "items"] as const,
};
