import { useQuery } from "@tanstack/react-query";
import type { DeckListParams } from "../types";
import { listDecks } from "../services/deck.service";
import { deckQueryKeys } from "../hooks/queryKeys";

export function useDecks(params: DeckListParams) {
  const normalizedParams: DeckListParams = {
    q: params?.q?.trim() || undefined,
    tags: params?.tags?.length ? params.tags : undefined,
    cefr: params?.cefr || undefined,
  };

  return useQuery({
    queryKey: deckQueryKeys.list(normalizedParams),
    queryFn: () => listDecks(normalizedParams),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
