import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, ReviewResult } from '@prisma/client';
import { ActiveUserService } from '../../common/active-user.service';
import { PrismaService } from '../../infra/prisma/prisma.service';
import { CreateVocabDto } from './dto/create-vocab.dto';
import { ListVocabQueryDto } from './dto/list-vocab-query.dto';
import { ListVocabReviewsQueryDto } from './dto/list-vocab-reviews-query.dto';
import { ReviewQueueQueryDto } from './dto/review-queue-query.dto';
import { ReviewVocabDto } from './dto/review-vocab.dto';
import { UpdateVocabDto } from './dto/update-vocab.dto';
import { VocabRow } from './entities/vocab.entity';

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const HOUR_IN_MS = 60 * 60 * 1000;
const MIN_EASE = 130;
const MAX_EASE = 350;

@Injectable()
export class VocabService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activeUser: ActiveUserService,
  ) {}

  async create(dto: CreateVocabDto) {
    const userId = this.activeUser.getUserId();

    const vocab = await this.prisma.vocab.create({
      data: {
        userId,
        word: dto.word.trim(),
        meaningVi: dto.meaningVi.trim(),
        explanationEn: dto.explanationEn?.trim() ?? null,
        notes: dto.notes?.trim() ?? null,
        tags: dto.tags?.length
          ? dto.tags.map((tag) => tag.trim()).filter(Boolean)
          : [],
        captureBatchId: dto.captureBatchId ?? null,
        timecodeSec: dto.timecodeSec ?? null,
        dueAt: dto.dueAt ?? new Date(),
        isSuspended: dto.isSuspended ?? false,
      },
      include: {
        captureBatch: true,
      },
    });

    return vocab;
  }

  async findAll(query: ListVocabQueryDto) {
    const userId = this.activeUser.getUserId();
    const skip = query.skip ?? 0;
    const take = query.take ?? 50;
    const where = this.buildListWhere(userId, query);

    const orderByField = query.orderBy ?? (query.onlyDue ? 'dueAt' : 'addedAt');
    const orderDirection =
      query.orderDirection ?? (orderByField === 'addedAt' ? 'desc' : 'asc');

    const orderBy: Prisma.VocabOrderByWithRelationInput[] = [
      {
        [orderByField]: orderDirection,
      } as Prisma.VocabOrderByWithRelationInput,
      { id: 'asc' },
    ];

    const [items, total] = await this.prisma.$transaction([
      this.prisma.vocab.findMany({
        where,
        skip,
        take,
        orderBy,
        // include: {
        //   captureBatch: true,
        // },
      }),
      this.prisma.vocab.count({ where }),
    ]);

    return { items, total, skip, take };
  }

  async findOne(id: number) {
    const userId = this.activeUser.getUserId();
    const vocab = await this.prisma.vocab.findFirst({
      where: { id, userId },
      include: { captureBatch: true },
    });

    if (!vocab) {
      throw new NotFoundException(`Vocab ${id} not found`);
    }

    return vocab;
  }

  async update(id: number, dto: UpdateVocabDto) {
    await this.ensureOwnership(id);

    const data: Prisma.VocabUpdateInput = {};

    if (dto.word !== undefined) {
      data.word = dto.word.trim();
    }

    if (dto.meaningVi !== undefined) {
      data.meaningVi = dto.meaningVi.trim();
    }

    if (dto.explanationEn !== undefined) {
      const value = dto.explanationEn?.trim();
      data.explanationEn = value ? value : null;
    }

    if (dto.notes !== undefined) {
      const value = dto.notes?.trim();
      data.notes = value ? value : null;
    }

    if (dto.tags !== undefined) {
      data.tags = dto.tags.map((tag) => tag.trim()).filter(Boolean);
    }

    if (dto.captureBatchId !== undefined) {
      data.captureBatch = dto.captureBatchId
        ? { connect: { id: dto.captureBatchId } }
        : { disconnect: true };
    }

    if (dto.timecodeSec !== undefined) {
      data.timecodeSec = dto.timecodeSec;
    }

    if (dto.dueAt !== undefined) {
      data.dueAt = dto.dueAt;
    }

    if (dto.isSuspended !== undefined) {
      data.isSuspended = dto.isSuspended;
    }

    const vocab = await this.prisma.vocab.update({
      where: { id },
      data,
      include: {
        captureBatch: true,
      },
    });

    return vocab;
  }

  async remove(id: number) {
    await this.ensureOwnership(id);
    await this.prisma.vocab.delete({ where: { id } });
    return { id };
  }

  async getReviewQueue(query: ReviewQueueQueryDto) {
    const userId = this.activeUser.getUserId();
    const dueBefore = query.dueBefore ?? new Date();
    const take = query.take ?? 20;

    const items = await this.prisma.vocab.findMany({
      where: {
        userId,
        isSuspended: false,
        dueAt: { lte: dueBefore },
      },
      orderBy: [{ dueAt: 'asc' }, { ease: 'asc' }, { id: 'asc' }],
      take,
      include: {
        captureBatch: true,
      },
    });

    return { items, dueBefore };
  }

  async review(id: number, dto: ReviewVocabDto) {
    const vocab = await this.ensureOwnership(id);
    const reviewedAt = dto.reviewedAt ?? new Date();

    const next = this.calculateNextScheduling(vocab, dto.result, reviewedAt);

    const [updated, review] = await this.prisma.$transaction([
      this.prisma.vocab.update({
        where: { id: vocab.id },
        data: next,
        include: {
          captureBatch: true,
        },
      }),
      this.prisma.vocabReview.create({
        data: {
          vocabId: vocab.id,
          userId: vocab.userId,
          reviewedAt,
          result: dto.result,
          durationSec: dto.durationSec ?? null,
          notes: dto.notes ?? null,
        },
      }),
    ]);

    return { updated, review };
  }

  async listReviews(id: number, query: ListVocabReviewsQueryDto) {
    const vocab = await this.ensureOwnership(id);
    const take = query.take ?? 20;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.vocabReview.findMany({
        where: {
          vocabId: vocab.id,
          userId: vocab.userId,
        },
        orderBy: { reviewedAt: 'desc' },
        take,
      }),
      this.prisma.vocabReview.count({
        where: { vocabId: vocab.id, userId: vocab.userId },
      }),
    ]);

    return { items, total };
  }

  async getSummary() {
    const userId = this.activeUser.getUserId();
    const now = new Date();
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    const [total, dueNow, dueToday, suspended, learning, fresh] =
      await this.prisma.$transaction([
        this.prisma.vocab.count({ where: { userId } }),
        this.prisma.vocab.count({
          where: { userId, isSuspended: false, dueAt: { lte: now } },
        }),
        this.prisma.vocab.count({
          where: { userId, isSuspended: false, dueAt: { lte: endOfDay } },
        }),
        this.prisma.vocab.count({ where: { userId, isSuspended: true } }),
        this.prisma.vocab.count({ where: { userId, repetitions: { gt: 0 } } }),
        this.prisma.vocab.count({ where: { userId, repetitions: 0 } }),
      ]);

    return {
      total,
      dueNow,
      dueToday,
      suspended,
      learning,
      newWords: fresh,
    };
  }

  private buildListWhere(
    userId: number,
    query: ListVocabQueryDto,
  ): Prisma.VocabWhereInput {
    const conditions: Prisma.VocabWhereInput[] = [{ userId }];

    if (!query.includeSuspended) {
      conditions.push({ isSuspended: false });
    }

    if (query.tags?.length) {
      conditions.push({ tags: { hasEvery: query.tags } });
    }

    if (query.captureBatchId) {
      conditions.push({ captureBatchId: query.captureBatchId });
    }

    if (query.onlyDue || query.dueBefore) {
      const dueBefore = query.dueBefore ?? new Date();
      conditions.push({ dueAt: { lte: dueBefore } });
    }

    // if (query.search) {
    const term = query.q?.trim();
    if (term) {
      conditions.push({
        OR: [
          { word: { contains: term, mode: 'insensitive' } },
          { meaningVi: { contains: term, mode: 'insensitive' } },
          { explanationEn: { contains: term, mode: 'insensitive' } },
          { notes: { contains: term, mode: 'insensitive' } },
          { tags: { has: term } },
        ],
      });
    }
    // }

    return { AND: conditions };
  }

  private async ensureOwnership(id: number): Promise<VocabRow> {
    const userId = this.activeUser.getUserId();
    const vocab = await this.prisma.vocab.findFirst({
      where: { id, userId },
    });

    if (!vocab) {
      throw new NotFoundException(`Vocab ${id} not found`);
    }

    return vocab;
  }

  private calculateNextScheduling(
    vocab: VocabRow,
    result: ReviewResult,
    reviewedAt: Date,
  ): Prisma.VocabUpdateInput {
    let ease = vocab.ease;
    let repetitions = vocab.repetitions;
    let interval = vocab.intervalDays;
    let lapses = vocab.lapses;
    let dueAt = reviewedAt;

    switch (result) {
      case ReviewResult.AGAIN: {
        ease = Math.max(MIN_EASE, ease - 20);
        repetitions = 0;
        interval = 0;
        lapses += 1;
        dueAt = new Date(reviewedAt.getTime() + 4 * HOUR_IN_MS);
        break;
      }
      case ReviewResult.HARD: {
        ease = Math.max(MIN_EASE, ease - 5);
        repetitions = Math.max(1, repetitions);
        interval = Math.max(1, Math.round(Math.max(1, interval) * 1.2));
        dueAt = new Date(reviewedAt.getTime() + interval * DAY_IN_MS);
        break;
      }
      case ReviewResult.GOOD: {
        ease = Math.max(MIN_EASE, Math.min(MAX_EASE, ease));
        repetitions += 1;
        if (repetitions === 1) {
          interval = 1;
        } else if (repetitions === 2) {
          interval = 3;
        } else {
          interval = Math.max(1, Math.round(interval * (ease / 100))); // ease scaled by 100
        }
        dueAt = new Date(reviewedAt.getTime() + interval * DAY_IN_MS);
        break;
      }
      case ReviewResult.EASY: {
        ease = Math.min(MAX_EASE, ease + 15);
        repetitions += 1;
        if (repetitions === 1) {
          interval = 3;
        } else if (repetitions === 2) {
          interval = 5;
        } else {
          interval = Math.max(1, Math.round(interval * (ease / 100) * 1.3));
        }
        dueAt = new Date(reviewedAt.getTime() + interval * DAY_IN_MS);
        break;
      }
      default: {
        break;
      }
    }

    ease = Math.min(MAX_EASE, Math.max(MIN_EASE, ease));

    return {
      ease,
      repetitions,
      intervalDays: interval,
      lapses,
      dueAt,
      lastReviewedAt: reviewedAt,
      lastResult: result,
    };
  }
}
