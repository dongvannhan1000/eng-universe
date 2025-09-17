import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateVocabDto } from './dto/create-vocab.dto';
import { ListVocabQueryDto } from './dto/list-vocab-query.dto';
import { ListVocabReviewsQueryDto } from './dto/list-vocab-reviews-query.dto';
import { ReviewQueueQueryDto } from './dto/review-queue-query.dto';
import { ReviewVocabDto } from './dto/review-vocab.dto';
import { UpdateVocabDto } from './dto/update-vocab.dto';
import { VocabService } from './vocab.service';

@Controller('vocab')
export class VocabController {
  constructor(private readonly vocabService: VocabService) {}

  @Post()
  create(@Body() createVocabDto: CreateVocabDto) {
    return this.vocabService.create(createVocabDto);
  }

  @Get()
  findAll(@Query() query: ListVocabQueryDto) {
    return this.vocabService.findAll(query);
  }

  @Get('summary')
  getSummary() {
    return this.vocabService.getSummary();
  }

  @Get('review/queue')
  getReviewQueue(@Query() query: ReviewQueueQueryDto) {
    return this.vocabService.getReviewQueue(query);
  }

  @Post(':id/reviews')
  review(@Param('id', ParseIntPipe) id: number, @Body() dto: ReviewVocabDto) {
    return this.vocabService.review(id, dto);
  }

  @Get(':id/reviews')
  listReviews(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: ListVocabReviewsQueryDto,
  ) {
    return this.vocabService.listReviews(id, query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.vocabService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVocabDto: UpdateVocabDto,
  ) {
    return this.vocabService.update(id, updateVocabDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.vocabService.remove(id);
  }
}
