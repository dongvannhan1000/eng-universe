// src/modules/vocab/entities/vocab.entity.ts
import { ApiProperty } from '@nestjs/swagger';
import { Vocab as PrismaVocab, ReviewResult } from '@prisma/client';

export type VocabRow = PrismaVocab;

export class VocabEntityDoc {
  @ApiProperty({ example: 1 }) id!: number;
  @ApiProperty({ example: 1 }) userId!: number;

  @ApiProperty({ example: 'polyglot', maxLength: 128 }) word!: string;
  @ApiProperty({ example: 'đa ngữ' }) meaningVi!: string;
  @ApiProperty({
    example: 'someone who knows several languages',
    nullable: true,
  })
  explanationEn!: string | null;

  @ApiProperty({ example: 'Gặp trong podcast', nullable: true })
  notes!: string | null;

  @ApiProperty({ type: [String], example: ['podcast', 'yt'] })
  tags!: string[];

  @ApiProperty({ nullable: true, example: 95 })
  timecodeSec!: number | null;

  @ApiProperty({ nullable: true, example: 12 })
  captureBatchId!: number | null;

  @ApiProperty({ format: 'date-time', example: '2025-09-20T10:00:00.000Z' })
  addedAt!: Date;

  @ApiProperty({ format: 'date-time', nullable: true, example: null })
  lastReviewedAt!: Date | null;

  @ApiProperty({ example: false })
  isSuspended!: boolean;

  @ApiProperty({ format: 'date-time', example: '2025-09-22T10:00:00.000Z' })
  dueAt!: Date;

  @ApiProperty({ example: 0 }) intervalDays!: number;
  @ApiProperty({ example: 250 }) ease!: number;
  @ApiProperty({ example: 0 }) repetitions!: number;
  @ApiProperty({ example: 0 }) lapses!: number;

  @ApiProperty({ nullable: true, enum: ReviewResult, example: 'GOOD' })
  lastResult!: ReviewResult | null;
}
