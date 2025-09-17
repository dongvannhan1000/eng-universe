import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

const toTagArray = ({ value }: { value: unknown }): string[] | undefined => {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === 'string' ? item.trim() : undefined))
      .filter((item): item is string => Boolean(item));
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return undefined;
};

const toDateOrUndefined = ({ value }: { value: unknown }): Date | undefined => {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  const date = new Date(value as string);
  return Number.isNaN(date.valueOf()) ? undefined : date;
};

export class ListVocabQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(toTagArray)
  tags?: string[];

  @IsOptional()
  @IsInt()
  @Min(0)
  skip?: number = 0;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(200)
  take?: number = 50;

  @IsOptional()
  @IsBoolean()
  includeSuspended?: boolean;

  @IsOptional()
  @IsBoolean()
  onlyDue?: boolean;

  @IsOptional()
  @Transform(toDateOrUndefined)
  dueBefore?: Date;

  @IsOptional()
  @IsInt()
  @Min(1)
  captureBatchId?: number;

  @IsOptional()
  @IsString()
  @IsIn(['addedAt', 'dueAt'])
  orderBy?: 'addedAt' | 'dueAt';

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  orderDirection?: 'asc' | 'desc';
}
