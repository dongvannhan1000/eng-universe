import type { VocabListParams } from "../types";

export const vocabQueryKeys = {
  all: ["vocabs"] as const,
  lists: () => [...vocabQueryKeys.all, "list"] as const,
  list: (params: VocabListParams) => [...vocabQueryKeys.lists(), params] as const,
};
