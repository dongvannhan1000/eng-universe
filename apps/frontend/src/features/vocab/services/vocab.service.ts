import { http } from "@/lib/http";
import { PaginatedVocabSchema } from "types";
import type { PaginatedVocab } from "../types";
import type { CreateVocabInput } from "../types";
import type { Vocab } from "../types";

export type ListVocabParams = {
  q?: string;
  tags?: string[];
  from?: string | null; // ISO
  to?: string | null; // ISO
  page?: number; // 1-based
  limit?: number;
  includeSuspended?: boolean; // default false
};

export async function listVocabs(params: ListVocabParams): Promise<PaginatedVocab> {
  // Chuẩn hoá query: loại bỏ param default/empty
  const search = new URLSearchParams();
  if (params.q) search.set("q", params.q);
  if (params.tags && params.tags.length) search.set("tags", params.tags.join(","));
  if (params.from) search.set("from", params.from);
  if (params.to) search.set("to", params.to);
  if (params.page && params.page > 1) search.set("page", String(params.page));
  if (params.limit && params.limit !== 20) search.set("limit", String(params.limit));
  if (params.includeSuspended) search.set("includeSuspended", "true");
  const res = await http.get(`/vocab?${search.toString()}`);
  const parsed = PaginatedVocabSchema.safeParse(res.data);
  if (!parsed.success) {
    if (import.meta.env.DEV) {
      console.error("Vocab DTO mismatch:", parsed.error.flatten());
    }
    throw new Error("Invalid response from server");
  }
  return parsed.data;
}

export async function createVocab(data: CreateVocabInput): Promise<Vocab> {
  const res = await http.post("/vocab", data);
  return res.data;
}

export async function updateVocab(id: number, data: CreateVocabInput): Promise<Vocab> {
  const res = await http.patch(`/vocab/${id}`, data);
  return res.data;
}

export async function deleteVocab(id: number): Promise<void> {
  await http.delete(`/vocab/${id}`);
}

export async function toggleSuspendVocab(id: number): Promise<void> {
  await http.patch(`/vocab/toggle-suspend/${id}`);
}
