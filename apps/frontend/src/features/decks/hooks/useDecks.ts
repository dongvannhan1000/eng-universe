import { useQuery } from "@tanstack/react-query";
import { listDecks } from "../services/deck.service";
import { deckQueryKeys } from "../hooks/queryKeys";

export function useDecks() {
  return useQuery({
    queryKey: deckQueryKeys.all(),
    queryFn: () => listDecks(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
