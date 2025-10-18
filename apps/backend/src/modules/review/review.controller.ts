import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ReviewService } from './review.service';
import { ReviewQueueQueryDto } from './dto/review-queue-query.dto';
import { ReviewVocabDto } from './dto/review-vocab.dto';
import { ListVocabReviewsQueryDto } from './dto/list-vocab-reviews-query.dto';
import {
  ListVocabReviewsDoc,
  ReviewVocabResponseDoc,
} from '../vocab/entities/list-vocab.entity';

@Controller('api/vocab')
@ApiTags('reviews')
@ApiBearerAuth()
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get('review/queue')
  @ApiOperation({ summary: 'Get due vocabs for review (SRS queue)' })
  @ApiOkResponse({ description: 'Due items', type: ListVocabReviewsDoc })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  getReviewQueue(@Query() query: ReviewQueueQueryDto) {
    return this.reviewService.getReviewQueue(query);
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
    return this.reviewService.review(id, dto);
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
    return this.reviewService.listReviews(id, query);
  }
}
