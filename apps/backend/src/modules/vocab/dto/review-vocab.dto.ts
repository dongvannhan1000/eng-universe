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
  @IsEnum(ReviewResult)
  result!: ReviewResult;

  @IsOptional()
  @IsInt()
  @Min(0)
  durationSec?: number;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  @Transform(toTrimmedString)
  notes?: string;

  @IsOptional()
  @Transform(toDateOrUndefined)
  reviewedAt?: Date;
}
