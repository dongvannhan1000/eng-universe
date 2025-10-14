import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Clearing VocabReview and Vocab tables...');

  // Xóa bảng phụ thuộc trước (VocabReview)
  await prisma.vocabReview.deleteMany();
  await prisma.vocab.deleteMany();

  console.log('✅ Cleared existing data.');

  // Seed dữ liệu mới cho bảng Vocab
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@learninglab.local' },
    update: {},
    create: {
      email: 'demo@learninglab.local',
      name: 'Demo User',
    },
  });

  const now = new Date();
  const vocabs = [
    { word: 'serendipity', meaningVi: 'sự tình cờ may mắn' },
    { word: 'meticulous', meaningVi: 'tỉ mỉ, chi ly' },
    { word: 'concise', meaningVi: 'ngắn gọn, súc tích' },
    { word: 'resilient', meaningVi: 'kiên cường, mau phục hồi' },
    { word: 'nuance', meaningVi: 'sắc thái nhỏ, tinh tế' },
  ];

  await prisma.vocab.createMany({
    data: vocabs.map((it) => ({
      userId: demoUser.id,
      word: it.word,
      meaningVi: it.meaningVi,
      tags: ['demo'],
      addedAt: now,
      dueAt: now,
      intervalDays: 0,
      ease: 250,
      repetitions: 0,
      lapses: 0,
    })),
  });

  console.log('🌱 Seeded demo vocabs successfully.');
}

main()
  .catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
