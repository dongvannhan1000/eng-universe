import { useQuery } from "@tanstack/react-query";
import { listDeckItems } from "../services/deck.service";
import { deckQueryKeys } from "../hooks/queryKeys";

export function useDeckItems(slug: string, page: number, limit = 20) {
  return useQuery({
    queryKey: [...deckQueryKeys.items(slug), page, limit],
    queryFn: () => listDeckItems(slug, page, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!slug,
  });
}
