import { useQuery } from "@tanstack/react-query";
import { getDeckBySlug } from "../services/deck.service";
import { deckQueryKeys } from "../hooks/queryKeys";

export function useDeckDetail(slug: string) {
  return useQuery({
    queryKey: [...deckQueryKeys.list({}), "detail", slug],
    queryFn: () => getDeckBySlug(slug),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!slug,
  });
}
