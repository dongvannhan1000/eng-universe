import { ApiProperty } from '@nestjs/swagger';
import { VocabEntityDoc } from './vocab.entity';
import { ReviewResult } from '@prisma/client';

export class PaginatedVocabDoc {
  @ApiProperty({ example: 42 }) total!: number;
  @ApiProperty({ example: 1 }) page!: number;
  @ApiProperty({ example: 20 }) limit!: number;
  @ApiProperty({ type: () => [VocabEntityDoc] }) items!: VocabEntityDoc[];
}

export class ReviewVocabDtoDoc {
  @ApiProperty({ enum: ReviewResult, example: 'GOOD' })
  result!: ReviewResult;
  @ApiProperty({ required: false, example: 7 })
  durationSec?: number;
  @ApiProperty({ required: false, example: 'Hesitated on definition' })
  notes?: string;
}

export class ReviewVocabResponseDoc {
  @ApiProperty({ type: () => VocabEntityDoc })
  updated!: VocabEntityDoc;
  @ApiProperty({ type: () => ReviewVocabDtoDoc })
  review!: ReviewVocabDtoDoc;
}

export class ListVocabReviewsDoc {
  @ApiProperty({ type: () => [VocabEntityDoc] })
  items!: VocabEntityDoc[];
  @ApiProperty({ example: '2025-09-24T15:25:19.000Z' }) dueBefore!: Date;
}
