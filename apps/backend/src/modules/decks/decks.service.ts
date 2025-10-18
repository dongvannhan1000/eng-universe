import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma/prisma.service';
import { CreateDeckDto } from './dto/create-deck.dto';
import { UpdateDeckDto } from './dto/update-deck.dto';
import { ListDeckItemsQueryDto } from './dto/list-deck-items-query.dto';
import { buildDeckPreview } from './decks.utils';

@Injectable()
export class DecksService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.publicDeck.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  // create(createDeckDto: CreateDeckDto) {
  //   return 'This action adds a new deck';
  // }

  async findOneBySlug(slug: string) {
    const deck = await this.prisma.publicDeck.findUnique({
      where: { slug },
    });

    if (!deck) {
      throw new NotFoundException(`Public deck with slug "${slug}" not found`);
    }

    return deck;
  }

  findOne(id: number) {
    return `This action returns a #${id} deck`;
  }

  async findItemsBySlug(slug: string, query: ListDeckItemsQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const deck = await this.prisma.publicDeck.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!deck) {
      throw new NotFoundException(`Public deck with slug "${slug}" not found`);
    }

    const skip = (page - 1) * limit;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.publicDeckItem.findMany({
        where: { deckId: deck.id },
        orderBy: { headword: 'asc' },
        skip,
        take: limit,
      }),
      this.prisma.publicDeckItem.count({
        where: { deckId: deck.id },
      }),
    ]);

    return {
      total,
      page,
      limit,
      items,
    };
  }

  async preview(topic: string, opts: { refresh: boolean }) {
    return buildDeckPreview(topic, { refresh: opts.refresh });
  }

  // update(id: number, updateDeckDto: UpdateDeckDto) {
  //   return `This action updates a #${id} deck`;
  // }

  remove(id: number) {
    return `This action removes a #${id} deck`;
  }
}
