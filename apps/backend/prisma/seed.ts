/* scripts/seed.ts */
// Seed tổng: (1) user demo cá nhân (tuỳ chọn) và (2) public decks (cache-aware)

import { PrismaClient } from '@prisma/client';
import { buildDeckWithCache, closePrisma } from './public-decks';

const prisma = new PrismaClient();

function parseArgFlag(name: string) {
  // e.g. --refresh
  return process.argv.includes(`--${name}`);
}
function parseArgList(name: string): string[] | null {
  // e.g. --topics=environment,education
  const p = process.argv.find((a) => a.startsWith(`--${name}=`));
  if (!p) return null;
  return p
    .split('=')[1]
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

async function seedUserDemo() {
  // Optional: vẫn giữ vài mẫu Vocab cá nhân cho tài khoản demo
  const user = await prisma.user.upsert({
    where: { email: 'demo@learninglab.local' },
    update: {},
    create: {
      email: 'demo@learninglab.local',
      name: 'Demo User',
    },
  });

  const now = new Date();
  const items = [
    { word: 'serendipity', meaningVi: 'sự tình cờ may mắn' },
    { word: 'meticulous', meaningVi: 'tỉ mỉ, chi ly' },
    { word: 'concise', meaningVi: 'ngắn gọn, súc tích' },
    { word: 'resilient', meaningVi: 'kiên cường, mau phục hồi' },
    { word: 'nuance', meaningVi: 'sắc thái nhỏ, tinh tế' },
  ];

  await prisma.$transaction(
    items.map((it) =>
      prisma.vocab.upsert({
        where: { userId_word: { userId: user.id, word: it.word } },
        update: {
          meaningVi: it.meaningVi,
          tags: ['demo'],
          addedAt: now,
          dueAt: now,
        },
        create: {
          userId: user.id,
          word: it.word,
          meaningVi: it.meaningVi,
          tags: ['demo'],
          addedAt: now,
          dueAt: now,
          intervalDays: 0,
          ease: 250,
          repetitions: 0,
          lapses: 0,
        },
      }),
    ),
  );

  console.log('👤 Seeded demo user & 5 personal vocabs (no CaptureBatch).');
}

async function seedPublicDecks() {
  const refresh = parseArgFlag('refresh');
  const cmdTopics = parseArgList('topics');

  const topics = cmdTopics ?? [
    'environment',
    'health',
    'education',
    'culture',
    'politics',
    'society',
    'business',
    'economy',
    'technology',
    'work and career',
    'finance',
    'travel and tourism',
    'media and communication',
    'global issues',
    'science',
    'food',
    'sports',
    'lifestyle',
    'relationships',
    'housing and transport',
  ];

  console.log(
    `🌐 Public decks → topics=${topics.join(', ')}  refresh=${refresh}`,
  );

  for (const t of topics) {
    await buildDeckWithCache(t, { refresh });
  }
}

async function main() {
  await seedUserDemo(); // Nếu không cần user demo, comment dòng này
  await seedPublicDecks(); // Xây & nạp các deck public (cache-aware)
  console.log('✅ Seed finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await closePrisma();
    await prisma.$disconnect();
  });
