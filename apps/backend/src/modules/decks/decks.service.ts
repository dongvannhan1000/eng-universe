import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma/prisma.service';
import { CreateDeckDto } from './dto/create-deck.dto';
import { UpdateDeckDto } from './dto/update-deck.dto';

@Injectable()
export class DecksService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.publicDeck.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  create(createDeckDto: CreateDeckDto) {
    return 'This action adds a new deck';
  }

  findOne(id: number) {
    return `This action returns a #${id} deck`;
  }

  update(id: number, updateDeckDto: UpdateDeckDto) {
    return `This action updates a #${id} deck`;
  }

  remove(id: number) {
    return `This action removes a #${id} deck`;
  }
}
