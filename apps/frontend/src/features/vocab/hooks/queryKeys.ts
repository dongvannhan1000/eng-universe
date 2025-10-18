export const qk = {
  vocabs: (p: {
    q?: string;
    tags?: string[];
    from?: string | null;
    to?: string | null;
    page?: number;
    limit?: number;
  }) => ["vocabs", p] as const,
};
