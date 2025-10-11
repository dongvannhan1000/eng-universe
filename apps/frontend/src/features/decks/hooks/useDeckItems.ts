import { useQuery } from "@tanstack/react-query";
import { listDeckItems } from "../services/deck.service";
import { deckQueryKeys } from "../hooks/queryKeys";

export function useDeckItems(deckId: number, page: number, limit = 20) {
  return useQuery({
    queryKey: [...deckQueryKeys.detail(deckId), "items", page, limit],
    queryFn: () => listDeckItems(deckId, page, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: deckId > 0,
  });
}
