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
import { VocabEntityDoc } from './entities/vocab.entity';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  ListVocabReviewsDoc,
  PaginatedVocabDoc,
} from './entities/list-vocab.entity';
import { ReviewVocabResponseDoc } from './entities/list-vocab.entity';

@Controller('vocab')
@ApiTags('vocabs')
@ApiBearerAuth()
@ApiExtraModels(VocabEntityDoc, PaginatedVocabDoc)
export class VocabController {
  constructor(private readonly vocabService: VocabService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new vocab' })
  @ApiCreatedResponse({ description: 'Created', type: VocabEntityDoc })
  @ApiBadRequestResponse({ description: 'Validation error' })
  create(@Body() createVocabDto: CreateVocabDto) {
    return this.vocabService.create(createVocabDto);
  }

  @Get()
  @ApiOperation({ summary: 'List vocabs (filter & pagination)' })
  @ApiOkResponse({ description: 'List', type: PaginatedVocabDoc })
  list(@Query() q: ListVocabQueryDto) {
    return this.vocabService.findAll(q);
  }

  @Get('summary')
  getSummary() {
    return this.vocabService.getSummary();
  }

  @Get('review/queue')
  @ApiOperation({ summary: 'Get due vocabs for review (SRS queue)' })
  @ApiOkResponse({ description: 'Due items', type: ListVocabReviewsDoc })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  getReviewQueue(@Query() query: ReviewQueueQueryDto) {
    return this.vocabService.getReviewQueue(query);
  }

  @Post(':id/reviews')
  @ApiOperation({ summary: 'Submit review for a vocab (SRS)' })
  @ApiParam({ name: 'id', description: 'Vocab ID', example: 1 })
  @ApiOkResponse({
    description: 'Review submitted, vocab rescheduled',
    type: ReviewVocabResponseDoc,
  })
  @ApiBadRequestResponse({ description: 'Invalid review data' })
  @ApiNotFoundResponse({ description: 'Vocab not found' })
  review(@Param('id', ParseIntPipe) id: number, @Body() dto: ReviewVocabDto) {
    return this.vocabService.review(id, dto);
  }

  @Get(':id/reviews')
  @ApiOperation({ summary: 'Get review history for a vocab' })
  @ApiParam({ name: 'id', description: 'Vocab ID', example: 1 })
  @ApiOkResponse({
    description: 'Review history',
    schema: { type: 'array', items: { type: 'object' } },
  })
  @ApiNotFoundResponse({ description: 'Vocab not found' })
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
