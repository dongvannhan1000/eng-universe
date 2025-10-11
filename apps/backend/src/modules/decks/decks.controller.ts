import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DecksService } from './decks.service';
import { CreateDeckDto } from './dto/create-deck.dto';
import { UpdateDeckDto } from './dto/update-deck.dto';

@Controller('api/decks')
export class DecksController {
  constructor(private readonly decksService: DecksService) {}

  @Get()
  async findAll() {
    return this.decksService.findAll();
  }

  @Post()
  create(@Body() createDeckDto: CreateDeckDto) {
    return this.decksService.create(createDeckDto);
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
