import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ReviewResult } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

const toTrimmedString = ({ value }: { value: unknown }): unknown =>
  typeof value === 'string' ? value.trim() : value;

const toDateOrUndefined = ({ value }: { value: unknown }): Date | undefined => {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  const date = new Date(value as string);
  return Number.isNaN(date.valueOf()) ? undefined : date;
};

export class ReviewVocabDto {
  @ApiProperty({
    enum: ReviewResult,
    example: 'GOOD',
    description: 'Review result for spaced repetition',
  })
  @IsEnum(ReviewResult)
  result!: ReviewResult;

  @ApiPropertyOptional({
    type: Number,
    minimum: 0,
    example: 7,
    description: 'Time taken for review in seconds',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  durationSec?: number;

  @ApiPropertyOptional({
    maxLength: 2000,
    example: 'Hesitated on definition',
    description: 'Optional review notes',
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  @Transform(toTrimmedString)
  notes?: string;

  @ApiPropertyOptional({
    type: String,
    format: 'date-time',
    example: '2025-09-22T10:00:00.000Z',
    description: 'Custom review timestamp (defaults to now)',
  })
  @IsOptional()
  @Transform(toDateOrUndefined)
  reviewedAt?: Date;
}
