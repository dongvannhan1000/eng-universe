import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, ReviewResult } from '@prisma/client';
import { ActiveUserService } from '../../common/active-user.service';
import { PrismaService } from '../../infra/prisma/prisma.service';
import { ReviewQueueQueryDto } from './dto/review-queue-query.dto';
import { ReviewVocabDto } from './dto/review-vocab.dto';
import { ListVocabReviewsQueryDto } from './dto/list-vocab-reviews-query.dto';
import { VocabRow } from '../vocab/entities/vocab.entity';

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const HOUR_IN_MS = 60 * 60 * 1000;
const MIN_EASE = 130;
const MAX_EASE = 350;

@Injectable()
export class ReviewService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activeUser: ActiveUserService,
  ) {}

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
          interval = Math.max(1, Math.round(interval * (ease / 100)));
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
