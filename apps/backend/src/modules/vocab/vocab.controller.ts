import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { VocabService } from './vocab.service';
import { CreateVocabDto } from './dto/create-vocab.dto';
import { UpdateVocabDto } from './dto/update-vocab.dto';

@Controller('vocab')
export class VocabController {
  constructor(private readonly vocabService: VocabService) {}

  @Post()
  create(@Body() createVocabDto: CreateVocabDto) {
    return this.vocabService.create(createVocabDto);
  }

  @Get()
  findAll() {
    return this.vocabService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vocabService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVocabDto: UpdateVocabDto) {
    return this.vocabService.update(+id, updateVocabDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vocabService.remove(+id);
  }
}
