import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ActiveUserService } from '../../common/active-user.service';
import { PrismaService } from '../../infra/prisma/prisma.service';
import { CreateCaptureBatchDto } from './dto/create-capture-batch.dto';
import { ListCaptureBatchesQueryDto } from './dto/list-capture-batches-query.dto';
import { UpdateCaptureBatchDto } from './dto/update-capture-batch.dto';

@Injectable()
export class CaptureBatchesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activeUser: ActiveUserService,
  ) {}

  async create(dto: CreateCaptureBatchDto) {
    const userId = this.activeUser.getUserId();

    return this.prisma.captureBatch.create({
      data: {
        userId,
        tags: dto.tags?.map((tag) => tag.trim()).filter(Boolean) ?? [],
        startedAt: dto.startedAt,
        endedAt: dto.endedAt ?? null,
      },
      include: {
        _count: { select: { items: true } },
      },
    });
  }

  async findAll(query: ListCaptureBatchesQueryDto) {
    const userId = this.activeUser.getUserId();
    const skip = query.skip ?? 0;
    const take = query.take ?? 20;

    const where: Prisma.CaptureBatchWhereInput = {
      userId,
    };

    if (query.activeOnly) {
      where.endedAt = null;
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.captureBatch.findMany({
        where,
        skip,
        take,
        orderBy: { startedAt: 'desc' },
        include: {
          _count: { select: { items: true } },
        },
      }),
      this.prisma.captureBatch.count({ where }),
    ]);

    return { items, total, skip, take };
  }

  async findOne(id: number) {
    const batch = await this.prisma.captureBatch.findFirst({
      where: { id, userId: this.activeUser.getUserId() },
      include: {
        _count: { select: { items: true } },
        items: {
          orderBy: { addedAt: 'desc' },
          take: 20,
          select: {
            id: true,
            word: true,
            meaningVi: true,
            addedAt: true,
            dueAt: true,
            tags: true,
          },
        },
      },
    });

    if (!batch) {
      throw new NotFoundException(`Capture batch ${id} not found`);
    }

    return batch;
  }

  async update(id: number, dto: UpdateCaptureBatchDto) {
    await this.ensureOwnership(id);

    const data: Prisma.CaptureBatchUpdateInput = {};

    if (dto.tags !== undefined) {
      data.tags = dto.tags.map((tag) => tag.trim()).filter(Boolean);
    }

    if (dto.startedAt !== undefined) {
      data.startedAt = dto.startedAt;
    }

    if (dto.endedAt !== undefined) {
      data.endedAt = dto.endedAt;
    }

    return this.prisma.captureBatch.update({
      where: { id },
      data,
      include: {
        _count: { select: { items: true } },
      },
    });
  }

  async remove(id: number) {
    await this.ensureOwnership(id);
    await this.prisma.captureBatch.delete({ where: { id } });
    return { id };
  }

  private async ensureOwnership(id: number) {
    const batch = await this.prisma.captureBatch.findFirst({
      where: { id, userId: this.activeUser.getUserId() },
    });

    if (!batch) {
      throw new NotFoundException(`Capture batch ${id} not found`);
    }

    return batch;
  }
}
