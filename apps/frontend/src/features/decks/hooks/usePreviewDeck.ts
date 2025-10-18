import { useQuery } from "@tanstack/react-query";
import { previewDeck } from "../services/deck.service";

export function usePreviewDeck(topic: string, page: number, limit: number, refresh = false) {
  return useQuery({
    queryKey: ["preview-deck", topic, page, limit, refresh],
    queryFn: () => previewDeck(topic, page, limit, refresh),
    enabled: !!topic,
    staleTime: 60_000,
  });
}
