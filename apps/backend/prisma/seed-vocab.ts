import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomPastDate(daysAgoMax: number): Date {
  const now = new Date();
  const daysAgo = randomInt(0, daysAgoMax);
  now.setDate(now.getDate() - daysAgo);
  return now;
}

async function main() {
  console.log('🧹 Clearing VocabReview and Vocab tables...');
  await prisma.vocabReview.deleteMany();
  await prisma.vocab.deleteMany();
  console.log('✅ Cleared existing data.');

  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@learninglab.local' },
    update: {},
    create: {
      email: 'demo@learninglab.local',
      name: 'Demo User',
    },
  });

  console.log('👤 Using demo user:', demoUser.email);

  const topics: Record<string, { word: string; meaningVi: string }[]> = {
    education: [
      { word: 'curriculum', meaningVi: 'chương trình giảng dạy' },
      { word: 'scholarship', meaningVi: 'học bổng' },
      { word: 'literacy', meaningVi: 'trình độ học vấn' },
      { word: 'discipline', meaningVi: 'kỷ luật, môn học' },
      { word: 'tuition', meaningVi: 'học phí' },
    ],
    environment: [
      { word: 'ecosystem', meaningVi: 'hệ sinh thái' },
      { word: 'pollution', meaningVi: 'ô nhiễm' },
      { word: 'sustainable', meaningVi: 'bền vững' },
      { word: 'biodiversity', meaningVi: 'đa dạng sinh học' },
      { word: 'deforestation', meaningVi: 'phá rừng' },
    ],
    technology: [
      { word: 'algorithm', meaningVi: 'thuật toán' },
      { word: 'automation', meaningVi: 'tự động hóa' },
      { word: 'innovation', meaningVi: 'sự đổi mới' },
      { word: 'cybersecurity', meaningVi: 'an ninh mạng' },
      { word: 'artificial', meaningVi: 'nhân tạo' },
    ],
    health: [
      { word: 'nutrition', meaningVi: 'dinh dưỡng' },
      { word: 'immunity', meaningVi: 'hệ miễn dịch' },
      { word: 'therapy', meaningVi: 'liệu pháp' },
      { word: 'disease', meaningVi: 'bệnh tật' },
      { word: 'wellness', meaningVi: 'sức khỏe toàn diện' },
    ],
    culture: [
      { word: 'heritage', meaningVi: 'di sản' },
      { word: 'custom', meaningVi: 'phong tục' },
      { word: 'ritual', meaningVi: 'nghi lễ' },
      { word: 'diversity', meaningVi: 'đa dạng' },
      { word: 'tradition', meaningVi: 'truyền thống' },
    ],
    work: [
      { word: 'collaboration', meaningVi: 'sự hợp tác' },
      { word: 'deadline', meaningVi: 'hạn chót' },
      { word: 'efficiency', meaningVi: 'hiệu suất' },
      { word: 'promotion', meaningVi: 'thăng chức' },
      { word: 'supervisor', meaningVi: 'người giám sát' },
    ],
  };

  const allVocabs = Object.entries(topics).flatMap(([tag, list]) =>
    list.map((it) => ({
      ...it,
      tags: [tag],
    })),
  );

  const now = new Date();

  const data = allVocabs.map((it) => {
    const repetitions = randomInt(0, 5);
    const lapses = randomInt(0, 2);
    const intervalDays = repetitions > 0 ? randomInt(1, 30) : 0;
    const ease = 250 + randomInt(-50, 100); // khoảng 200–350
    const lastReviewedAt = repetitions > 0 ? randomPastDate(10) : null;
    const dueAt =
      repetitions > 0
        ? randomPastDate(intervalDays)
        : new Date(now.getTime() + randomInt(1, 3) * 24 * 60 * 60 * 1000);

    return {
      userId: demoUser.id,
      word: it.word,
      meaningVi: it.meaningVi,
      tags: it.tags,
      addedAt: randomPastDate(30),
      dueAt,
      lastReviewedAt,
      intervalDays,
      ease,
      repetitions,
      lapses,
    };
  });

  await prisma.vocab.createMany({ data });

  console.log(
    `🌱 Seeded ${data.length} vocabs across ${Object.keys(topics).length} topics.`,
  );
}

main()
  .catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
