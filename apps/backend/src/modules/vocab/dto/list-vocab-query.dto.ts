import { ApiHideProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
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

const toBooleanOrUndefined = ({
  value,
}: {
  value: unknown;
}): boolean | undefined => {
  if (value === undefined || value === null || value === '') return undefined;
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const v = value.toLowerCase().trim();
    if (v === 'true') return true;
    if (v === 'false') return false;
  }
  return undefined;
};

const toIntOrUndefined = ({
  value,
}: {
  value: unknown;
}): number | undefined => {
  if (value === undefined || value === null || value === '') return undefined;
  const n = Number(value);
  return Number.isInteger(n) ? n : undefined;
};

export class ListVocabQueryDto {
  @ApiPropertyOptional({ type: Number, minimum: 1, default: 1, example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({
    type: Number,
    minimum: 1,
    maximum: 200,
    default: 50,
    example: 20,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(200)
  limit: number = 50;

  @ApiPropertyOptional({
    type: String,
    example: 'poly',
    description: 'Search in word/meaning',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value, obj }) => value ?? obj?.search ?? undefined)
  q?: string;

  @ApiPropertyOptional({
    type: [String],
    description: 'Filter by tags (CSV or array)',
    example: ['podcast', 'yt'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(toTagArray)
  tags?: string[];

  @ApiPropertyOptional({
    type: Number,
    description: 'Filter by captureBatchId',
    example: 12,
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(toIntOrUndefined)
  captureBatchId?: number;

  @ApiPropertyOptional({
    type: String,
    enum: ['addedAt', 'dueAt'],
    example: 'dueAt',
    description: 'Sort field',
  })
  @IsOptional()
  @IsString()
  @IsIn(['addedAt', 'dueAt'])
  orderBy?: 'addedAt' | 'dueAt';

  @ApiPropertyOptional({
    type: String,
    enum: ['asc', 'desc'],
    example: 'asc',
    description: 'Sort direction',
  })
  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  orderDirection?: 'asc' | 'desc';

  @ApiPropertyOptional({
    type: Boolean,
    example: false,
    description: 'Include suspended vocabs only if true',
  })
  @IsOptional()
  @IsBoolean()
  @Transform(toBooleanOrUndefined)
  includeSuspended?: boolean;

  @ApiPropertyOptional({
    type: Boolean,
    example: true,
    description: 'Only include vocabs due for review (dueAt <= now)',
  })
  @IsOptional()
  @IsBoolean()
  @Transform(toBooleanOrUndefined)
  onlyDue?: boolean;

  @ApiPropertyOptional({
    type: String,
    format: 'date-time',
    example: '2025-09-21T23:59:59.999Z',
    description: 'Filter: dueAt <= dueBefore',
  })
  @IsOptional()
  @Transform(toDateOrUndefined)
  dueBefore?: Date;

  // --- Backward-compatible params (ẩn khỏi Swagger UI): skip/take/search ---
  @ApiHideProperty()
  @IsOptional()
  @IsInt()
  @Min(0)
  @Transform(({ value, obj }) => {
    const v = toIntOrUndefined({ value });
    if (v !== undefined) return v;
    const page = Number(obj?.page ?? 1);
    const limit = Number(obj?.limit ?? 50);
    return Math.max(0, (page - 1) * limit);
  })
  skip?: number;

  @ApiHideProperty()
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(200)
  @Transform(({ value, obj }) => {
    const v = toIntOrUndefined({ value });
    if (v !== undefined) return v;
    const limit = Number(obj?.limit ?? 50);
    return limit;
  })
  take?: number;

  @ApiHideProperty()
  @IsOptional()
  @IsString()
  search?: string;
}
