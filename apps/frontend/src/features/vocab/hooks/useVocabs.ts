import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { qk } from "./queryKeys";
import { listVocabs, type ListVocabParams } from "../services/vocab.service";

export function useVocabs(filters: ListVocabParams) {
  return useQuery({
    queryKey: qk.vocabs(filters),
    queryFn: () => listVocabs(filters),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
    retry: (failureCount, error: any) => {
      const status = error?.response?.status;
      if (status && status >= 400 && status < 500) return false;
      return failureCount < 2;
    },
  });
}
