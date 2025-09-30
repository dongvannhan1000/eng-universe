import type { Vocab } from "../types";
import { TAGS, WORD_POOLS, MEANINGS_VI } from "./fixtures";

// Generate deterministic dates over the last 180 days
const generateDate = (index: number): string => {
  const now = new Date();
  const daysAgo = Math.floor((index * 7) % 180); // Spread over 180 days
  const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
  return date.toISOString();
};

// Generate deterministic tags for each vocab
const generateTags = (index: number): string[] => {
  const tagCount = (index % 3) + 1; // 1-3 tags per vocab
  const selectedTags: string[] = [];

  for (let i = 0; i < tagCount; i++) {
    const tagIndex = (index + i) % TAGS.length;
    if (!selectedTags.includes(TAGS[tagIndex])) {
      selectedTags.push(TAGS[tagIndex]);
    }
  }

  return selectedTags;
};

// Create comprehensive vocabulary dataset
const createVocabDataset = (): Vocab[] => {
  const vocabs: Vocab[] = [];
  let id = 1;

  // Business words
  WORD_POOLS.business.forEach((word, index) => {
    vocabs.push({
      id: id++,
      word,
      meaningVi: MEANINGS_VI[word as keyof typeof MEANINGS_VI] || `nghĩa của ${word}`,
      explanationEn: `${word} is commonly used in business contexts to describe professional activities and strategies.`,
      tags: [...generateTags(index), "Business"],
      addedAt: generateDate(index),
    });
  });

  // Tech words
  WORD_POOLS.tech.forEach((word, index) => {
    vocabs.push({
      id: id++,
      word,
      meaningVi: MEANINGS_VI[word as keyof typeof MEANINGS_VI] || `nghĩa của ${word}`,
      explanationEn: `${word} is a technical term frequently used in software development and IT industry.`,
      tags: [...generateTags(index + 20), "Tech"],
      addedAt: generateDate(index + 20),
    });
  });

  // General words
  WORD_POOLS.general.forEach((word, index) => {
    vocabs.push({
      id: id++,
      word,
      meaningVi: MEANINGS_VI[word as keyof typeof MEANINGS_VI] || `nghĩa của ${word}`,
      explanationEn: `${word} is an advanced English word that can enhance your vocabulary and communication skills.`,
      tags: generateTags(index + 40),
      addedAt: generateDate(index + 40),
    });
  });

  // Additional vocabulary to reach ~200 items
  const additionalWords = [
    {
      word: "procrastinate",
      meaningVi: "trì hoãn",
      explanation: "to delay or postpone action; put off doing something",
    },
    {
      word: "meticulous",
      meaningVi: "tỉ mỉ",
      explanation: "showing great attention to detail; very careful and precise",
    },
    {
      word: "ubiquitous",
      meaningVi: "có mặt khắp nơi",
      explanation: "present, appearing, or found everywhere",
    },
    {
      word: "serendipity",
      meaningVi: "may mắn bất ngờ",
      explanation: "the occurrence of events by chance in a happy way",
    },
    {
      word: "resilience",
      meaningVi: "khả năng phục hồi",
      explanation: "the ability to recover quickly from difficulties",
    },
    {
      word: "ambiguous",
      meaningVi: "mơ hồ",
      explanation: "open to more than one interpretation; not having one obvious meaning",
    },
    {
      word: "pragmatic",
      meaningVi: "thực dụng",
      explanation: "dealing with things sensibly and realistically",
    },
    {
      word: "eloquent",
      meaningVi: "hùng biện",
      explanation: "fluent or persuasive in speaking or writing",
    },
    {
      word: "versatile",
      meaningVi: "đa năng",
      explanation: "able to adapt or be adapted to many different functions",
    },
    {
      word: "tenacious",
      meaningVi: "kiên trì",
      explanation: "tending to keep a firm hold of something; persistent",
    },
  ];

  additionalWords.forEach((item, index) => {
    // Create multiple variations with different contexts
    for (let i = 0; i < 15; i++) {
      vocabs.push({
        id: id++,
        word: item.word,
        meaningVi: item.meaningVi,
        explanationEn: item.explanation,
        tags: generateTags(index + i + 60),
        addedAt: generateDate(index + i + 60),
      });
    }
  });

  return vocabs.slice(0, 200); // Ensure exactly 200 items
};

export const VOCAB_DATASET: Vocab[] = createVocabDataset();
