import { PrismaClient, SourceKind } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'demo@learninglab.local' },
    update: {},
    create: {
      email: 'demo@learninglab.local',
      name: 'Demo User',
    },
  });

  const source = await prisma.source.upsert({
    where: {
      userId_url: {
        userId: user.id,
        url: 'https://youtu.be/dQw4w9WgXcQ',
      },
    },
    update: {},
    create: {
      userId: user.id,
      kind: SourceKind.YOUTUBE,
      title: 'English Vocab - Episode 1',
      url: 'https://youtu.be/dQw4w9WgXcQ',
      author: 'Learning Channel',
      defaultTags: ['YouTube', 'Episode1'],
      defaultNotes: 'Demo source for MVP',
    },
  });

  const batch = await prisma.captureBatch.create({
    data: {
      userId: user.id,
      sourceId: source.id,
      tags: ['Session-Demo'],
    },
  });

  const now = new Date();

  const items = [
    { word: 'serendipity', meaningVi: 'sự tình cờ may mắn', timecodeSec: 754 },
    { word: 'meticulous', meaningVi: 'tỉ mỉ, chi ly', timecodeSec: 935 },
    { word: 'concise', meaningVi: 'ngắn gọn, súc tích', timecodeSec: 1042 },
    {
      word: 'resilient',
      meaningVi: 'kiên cường, mau phục hồi',
      timecodeSec: 1310,
    },
    { word: 'nuance', meaningVi: 'sắc thái nhỏ, tinh tế', timecodeSec: 1625 },
  ];

  await prisma.$transaction(
    items.map((it) =>
      prisma.vocab.create({
        data: {
          userId: user.id,
          word: it.word,
          meaningVi: it.meaningVi,
          tags: ['demo', ...source.defaultTags],
          sourceId: source.id,
          timecodeSec: it.timecodeSec,
          captureBatchId: batch.id,

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

  await prisma.captureBatch.update({
    where: { id: batch.id },
    data: { endedAt: new Date() },
  });

  console.log('✅ Seeded: 1 user, 1 source, 1 batch, 5 vocabs');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
