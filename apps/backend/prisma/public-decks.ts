/* scripts/public-decks.ts */
// ETL "topic → deck": gọi API ngoài (lần đầu), cache JSON, và ghi vào Postgres.
// Node 18+ có fetch built-in. Nếu project là ESM, file này chạy tốt với tsx.

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const prisma = new PrismaClient();

// -------------------- Paths & Utils --------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
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
    max: '50',
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

async function collocationsFor(word: string): Promise<string[]> {
  // rel_jjb: adjectives that often modify the noun; rel_jja: nouns modified by the adjective
  const [adj2noun, noun2adj] = await Promise.all([
    getJson<{ word: string }[]>(
      `https://api.datamuse.com/words?rel_jjb=${encodeURIComponent(word)}&max=5`,
    ),
    getJson<{ word: string }[]>(
      `https://api.datamuse.com/words?rel_jja=${encodeURIComponent(word)}&max=5`,
    ),
  ]);
  const a = adj2noun.map((x) => `${x.word} ${word}`);
  const b = noun2adj.map((x) => `${word} ${x.word}`);
  // unique + remove weird chars
  return Array.from(new Set([...a, ...b])).filter((s) => s.length <= 40);
}

async function enrichHeadword(
  hw: string,
  dmIndex: Map<string, DatamuseWord>,
): Promise<CacheItem> {
  const dict = await getJson<DictEntry[]>(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(hw)}`,
  ).catch(() => null);
  const entry = dict?.[0];
  const ipa = entry ? bestPhonetic(entry) : undefined;
  const m = entry ? bestMeaning(entry) : undefined;

  const collos = await collocationsFor(hw).catch(() => []);

  const dm = dmIndex.get(hw.toLowerCase());
  const dmDef = fromDatamuseDef(dm?.defs);

  return {
    headword: hw,
    pos: m?.pos ?? mapTagPos(dm?.tags) ?? dmDef?.pos ?? null,
    definition: m?.definition ?? dmDef?.definition ?? null,
    example: m?.example ?? null,
    ipa: ipa ?? null,
    collocations: collos.slice(0, 5),
    tags: [],
    source: 'dictionaryapi.dev;datamuse',
    sourceAttribution: 'DictionaryAPI.dev; Datamuse',
    sourceUrl: null,
    license: 'Mixed: see attribution',
    lang: 'en',
  };
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
  const out: CacheItem[] = [];
  for (let i = 0; i < headwords.length; i += pool) {
    const chunk = headwords.slice(i, i + pool);
    const part = await Promise.all(
      chunk.map((hw) => enrichHeadword(hw, dmIndex)),
    );
    out.push(...part);
  }

  // normalize tags cấp item
  out.forEach((it) => {
    it.tags = [`${topic}`];
  });

  // lọc item quá “rỗng”
  return out.filter((it) => it.headword && it.definition);
}

// -------------------- Cache-aware builder --------------------
function toSlug(topic: string) {
  return topic.toLowerCase().trim().replace(/\s+/g, '-');
}

export async function buildDeckWithCache(
  topic: string,
  options?: { refresh?: boolean },
) {
  const slug = toSlug(topic);
  const cacheFile = path.join(DATA_DIR, `${slug}.json`);

  let items: CacheItem[] | null = null;

  if (!options?.refresh) {
    items = await readJsonIfExists<CacheItem[]>(cacheFile);
  }

  const shouldFetch =
    !!options?.refresh ||
    !items ||
    (Array.isArray(items) && items.length === 0);

  if (shouldFetch) {
    console.log(`↻ Building from remote: ${topic}`);
    items = await fetchDeckFromRemote(topic);
    await writeJson(cacheFile, items);
    console.log(
      `💾 Cached to ${path.relative(process.cwd(), cacheFile)} (${items?.length ?? 0} items)`,
    );
  } else {
    console.log(
      `📦 Loaded from cache: ${path.relative(process.cwd(), cacheFile)} (${items?.length ?? 0} items)`,
    );
  }

  // Write to DB (idempotent): upsert deck + replace items
  await prisma.$transaction(async (tx) => {
    const title = `${topic[0].toUpperCase()}${topic.slice(1)}`;
    const deck = await tx.publicDeck.upsert({
      where: { slug },
      update: { title, tags: [topic] },
      create: { slug, title, tags: [topic] },
    });

    await tx.publicDeckItem.deleteMany({ where: { deckId: deck.id } });

    if (items?.length) {
      await tx.publicDeckItem.createMany({
        data: items.map((i) => ({
          deckId: deck.id,
          headword: i.headword,
          pos: i.pos ?? null,
          definition: i.definition ?? null,
          example: i.example ?? null,
          ipa: i.ipa ?? null,
          collocations: i.collocations ?? [],
          tags: i.tags ?? [],
          source: i.source ?? null,
          sourceAttribution: i.sourceAttribution ?? null,
          sourceUrl: i.sourceUrl ?? null,
          license: i.license ?? null,
          lang: i.lang || 'en',
        })),
        skipDuplicates: true,
      });
    }
  });

  console.log(`✓ Deck ready: ${topic} (${items?.length ?? 0} items)`);
}

export async function closePrisma() {
  await prisma.$disconnect();
}
