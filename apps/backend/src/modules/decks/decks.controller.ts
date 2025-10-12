import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { DecksService } from './decks.service';
import { CreateDeckDto } from './dto/create-deck.dto';
import { UpdateDeckDto } from './dto/update-deck.dto';
import { ListDeckItemsQueryDto } from './dto/list-deck-items-query.dto';

@Controller('api/decks')
export class DecksController {
  constructor(private readonly decksService: DecksService) {}

  @Get()
  async findAll() {
    return this.decksService.findAll();
  }

  @Get(':slug')
  findOneBySlug(@Param('slug') slug: string) {
    return this.decksService.findOneBySlug(slug);
  }

  @Post()
  create(@Body() createDeckDto: CreateDeckDto) {
    return this.decksService.create(createDeckDto);
  }

  @Get(':slug/items')
  findItems(
    @Param('slug') slug: string,
    @Query() query: ListDeckItemsQueryDto,
  ) {
    return this.decksService.findItemsBySlug(slug, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.decksService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDeckDto: UpdateDeckDto) {
    return this.decksService.update(+id, updateDeckDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.decksService.remove(+id);
  }
}
