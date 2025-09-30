import { useQuery, keepPreviousData } from "@tanstack/react-query";
import type { VocabListParams } from "../types";
import { fetchVocabs } from "../mock/repo";
import { vocabQueryKeys } from "../utils/queryKeys";

export function useVocabs(params: VocabListParams) {
  // Normalize params to ensure consistent cache keys
  const normalizedParams: VocabListParams = {
    q: params.q?.trim() || undefined,
    tags: params.tags?.length ? params.tags : undefined,
    from: params.from || undefined,
    to: params.to || undefined,
    page: params.page || 1,
    limit: params.limit || 20,
  };

  return useQuery({
    queryKey: vocabQueryKeys.list(normalizedParams),
    queryFn: () => fetchVocabs(normalizedParams),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
