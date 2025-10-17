/* scripts/public-decks.ts */
// ETL "topic → deck": gọi API ngoài (lần đầu), cache JSON, và ghi vào Postgres.
// Node 18+ có fetch built-in. Nếu project là ESM, file này chạy tốt với tsx.

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

// -------------------- Paths & Utils --------------------

const DATA_DIR = path.resolve(__dirname, '..', 'data', 'public-decks');

async function ensureDir(p: string) {
  await fs.mkdir(p, { recursive: true });
}

async function readJsonIfExists<T>(filePath: string): Promise<T | null> {
  try {
    const txt = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(txt) as T;
  } catch (e: any) {
    if (e?.code === 'ENOENT') return null;
    throw e;
  }
}

async function writeJson(filePath: string, data: any) {
  await ensureDir(path.dirname(filePath));
  const txt = JSON.stringify(data, null, 2);
  await fs.writeFile(filePath, txt, 'utf-8');
}

// -------------------- Types --------------------
type CacheItem = {
  headword: string;
  pos?: string | null;
  definition?: string | null;
  example?: string | null;
  ipa?: string | null;
  collocations: string[];
  tags: string[];
  source?: string | null;
  sourceAttribution?: string | null;
  sourceUrl?: string | null;
  license?: string | null;
  lang: string; // e.g., "en"
};

type DatamuseWord = {
  word: string;
  tags?: string[]; // may include pos
  defs?: string[]; // entries like "n\tdefinition"
};

type DictEntry = {
  word: string;
  phonetic?: string;
  phonetics?: { text?: string }[];
  meanings?: {
    partOfSpeech?: string;
    definitions?: { definition: string; example?: string }[];
  }[];
};

// -------------------- Remote helpers (Datamuse + DictionaryAPI) --------------------

function buildDatamuseUrl(topic: string) {
  const q = topic.trim().replace(/\s+/g, ' '); // normalize spaces
  const params = new URLSearchParams({
    ml: q,
    max: '100',
    md: 'dp',
  });
  return `https://api.datamuse.com/words?${params.toString()}`;
}

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'LearningLab/1.0' },
  });
  if (!res.ok)
    throw new Error(`HTTP ${res.status} ${res.statusText} for ${url}`);
  return res.json() as Promise<T>;
}

function mapTagPos(tags?: string[]): string | undefined {
  if (!tags) return;
  const map: Record<string, string> = {
    n: 'noun',
    v: 'verb',
    adj: 'adjective',
    adv: 'adverb',
  };
  const t = tags.find((x) => map[x]);
  return t ? map[t] : undefined;
}

function fromDatamuseDef(
  defs?: string[],
): { pos?: string; definition?: string } | undefined {
  if (!defs?.length) return;
  const [posRaw, def] = defs[0].split('\t');
  const map: Record<string, string> = {
    n: 'noun',
    v: 'verb',
    adj: 'adjective',
    adv: 'adverb',
  };
  return { pos: map[posRaw] ?? undefined, definition: def };
}

function bestPhonetic(e: DictEntry): string | undefined {
  return e.phonetic || e.phonetics?.find((p) => p.text)?.text;
}

function bestMeaning(
  e: DictEntry,
): { pos?: string; definition?: string; example?: string } | undefined {
  const m = e.meanings?.[0];
  const d = m?.definitions?.[0];
  if (!m || !d) return;
  return { pos: m.partOfSpeech, definition: d.definition, example: d.example };
}

// async function collocationsFor(word: string): Promise<string[]> {
//   // rel_jjb: adjectives that often modify the noun; rel_jja: nouns modified by the adjective
//   const [adj2noun, noun2adj] = await Promise.all([
//     getJson<{ word: string }[]>(
//       `https://api.datamuse.com/words?rel_jjb=${encodeURIComponent(word)}&max=5`,
//     ),
//     getJson<{ word: string }[]>(
//       `https://api.datamuse.com/words?rel_jja=${encodeURIComponent(word)}&max=5`,
//     ),
//   ]);
//   const a = adj2noun.map((x) => `${x.word} ${word}`);
//   const b = noun2adj.map((x) => `${word} ${x.word}`);
//   // unique + remove weird chars
//   return Array.from(new Set([...a, ...b])).filter((s) => s.length <= 40);
// }

async function enrichHeadword(
  hw: string,
  dmIndex: Map<string, DatamuseWord>,
): Promise<CacheItem> {
  // const collos = await collocationsFor(hw).catch(() => []);

  const dm = dmIndex.get(hw.toLowerCase());
  const dmDef = fromDatamuseDef(dm?.defs);

  if (dmDef?.definition) {
    const item: CacheItem = {
      headword: hw,
      pos: mapTagPos(dm?.tags) ?? dmDef.pos ?? null,
      definition: dmDef.definition,
      example: null,
      ipa: null,
      collocations: [],
      tags: [],
      source: 'datamuse',
      sourceAttribution: 'Datamuse',
      sourceUrl: null,
      license: 'Datamuse API',
      lang: 'en',
    };
    return item;
  }

  const dict = await getJson<DictEntry[]>(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(hw)}`,
  ).catch(() => null);
  const entry = dict?.[0];
  const ipa = entry ? bestPhonetic(entry) : undefined;
  const m = entry ? bestMeaning(entry) : undefined;

  const item: CacheItem = {
    headword: hw,
    pos: m?.pos ?? mapTagPos(dm?.tags) ?? dmDef?.pos ?? null,
    definition: m?.definition ?? dmDef?.definition ?? null,
    example: m?.example ?? null,
    ipa: ipa ?? null,
    collocations: [],
    tags: [],
    source: m?.definition ? 'dictionaryapi.dev' : 'datamuse',
    sourceAttribution: m?.definition ? 'DictionaryAPI.dev' : 'Datamuse',
    sourceUrl: null,
    license: 'Mixed: see attribution',
    lang: 'en',
  };

  return item;
}

async function fetchDeckFromRemote(topic: string): Promise<CacheItem[]> {
  // 1) candidates
  const candidates = await getJson<DatamuseWord[]>(
    `${buildDatamuseUrl(topic)}`,
  );

  const dmIndex = new Map(candidates.map((c) => [c.word.toLowerCase(), c]));

  // dedupe & filter words
  const headwords = Array.from(
    new Set(
      candidates
        .map((c) => c.word.toLowerCase())
        .filter((w) => /^[a-z][a-z\-]*$/.test(w)),
    ),
  ).slice(0, 180);

  // basic concurrency (pool=6) để đỡ “đập” API
  const pool = 6;
  const limit = 60;
  const out: CacheItem[] = [];
  for (let i = 0; i < headwords.length && out.length < limit; i += pool) {
    const chunk = headwords.slice(i, i + pool);
    const part = await Promise.all(
      chunk.map((hw) => enrichHeadword(hw, dmIndex)),
    );

    const remaining = limit - out.length;
    const valid = part.filter(Boolean).slice(0, remaining) as CacheItem[];
    out.push(...valid);
  }

  const items = out.slice(0, limit).map((it) => ({ ...it, tags: [topic] }));

  // lọc item quá “rỗng”
  return items.filter((it) => it.headword && it.definition);
}

// -------------------- Cache-aware builder --------------------
function toSlug(topic: string) {
  return topic.toLowerCase().trim().replace(/\s+/g, '-');
}

export async function closePrisma() {
  await prisma.$disconnect();
}

async function loadDeckItemsCache(topic: string, refresh?: boolean) {
  const slug = toSlug(topic);
  const cacheFile = path.join(DATA_DIR, `${slug}.json`);

  let items: CacheItem[] | null = null;
  if (!refresh) {
    items = await readJsonIfExists<CacheItem[]>(cacheFile);
  }
  const shouldFetch =
    !!refresh || !items || (Array.isArray(items) && items.length === 0);
  if (shouldFetch) {
    console.log(`↻ [preview] Building from remote: ${topic}`);
    items = await fetchDeckFromRemote(topic);
    await writeJson(cacheFile, items);
    console.log(
      `💾 [preview] Cached to ${path.relative(process.cwd(), cacheFile)} (${items?.length ?? 0} items)`,
    );
  } else {
    console.log(
      `📦 [preview] Loaded from cache: ${path.relative(process.cwd(), cacheFile)} (${items?.length ?? 0} items)`,
    );
  }
  return { slug, items: items ?? [] };
}

export async function buildDeckPreview(
  rawTopic: string,
  options?: { refresh?: boolean },
) {
  const topic = rawTopic
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/\s+/g, ' ');
  const { slug, items } = await loadDeckItemsCache(topic, options?.refresh);
  const title = `${topic[0].toUpperCase()}${topic.slice(1)}`;
  const deckMeta = {
    slug,
    title,
    description: `Auto-generated preview for topic "${topic}"`,
    tags: [topic],
    cefr: null as string | null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  return {
    deck: deckMeta,
    items,
    total: items.length,
  };
}
