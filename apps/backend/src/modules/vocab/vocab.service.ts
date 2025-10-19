import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ActiveUserService } from '../../common/active-user.service';
import { PrismaService } from '../../infra/prisma/prisma.service';
import { CreateVocabDto } from './dto/create-vocab.dto';
import { ListVocabQueryDto } from './dto/list-vocab-query.dto';
import { UpdateVocabDto } from './dto/update-vocab.dto';
import { VocabRow } from './entities/vocab.entity';

@Injectable()
export class VocabService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activeUser: ActiveUserService,
  ) {}

  async create(dto: CreateVocabDto) {
    const userId = this.activeUser.getUserId();

    try {
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
          dueAt: dto.dueAt ?? new Date(),
          isSuspended: dto.isSuspended ?? false,
        },
      });

      return vocab;
    } catch (error) {
      if ((error as Prisma.PrismaClientKnownRequestError).code === 'P2002') {
        throw new BadRequestException(
          `The word "${dto.word}" is already exists`,
        );
      }
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException({
        message:
          'Failed to create new word, please try again or contact support',
        detail: (error as Error).message,
      });
    }
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
      // include: { captureBatch: true },
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

    // if (dto.captureBatchId !== undefined) {
    //   data.captureBatch = dto.captureBatchId
    //     ? { connect: { id: dto.captureBatchId } }
    //     : { disconnect: true };
    // }

    // if (dto.timecodeSec !== undefined) {
    //   data.timecodeSec = dto.timecodeSec;
    // }

    if (dto.dueAt !== undefined) {
      data.dueAt = dto.dueAt;
    }

    if (dto.isSuspended !== undefined) {
      data.isSuspended = dto.isSuspended;
    }

    const vocab = await this.prisma.vocab.update({
      where: { id },
      data,
      // include: {
      //   captureBatch: true,
      // },
    });

    return vocab;
  }

  async remove(id: number) {
    await this.ensureOwnership(id);
    await this.prisma.vocab.delete({ where: { id } });
    return { id };
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

    // if (query.captureBatchId) {
    //   conditions.push({ captureBatchId: query.captureBatchId });
    // }

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
}
