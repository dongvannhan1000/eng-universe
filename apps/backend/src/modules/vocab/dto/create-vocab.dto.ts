import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateIf,
} from 'class-validator';

const toTrimmedString = ({ value }: { value: unknown }): unknown =>
  typeof value === 'string' ? value.trim() : value;

const toTagArray = ({ value }: { value: unknown }): string[] | undefined => {
  if (value === undefined || value === null || value === '') {
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

const toNullableInt = ({
  value,
}: {
  value: unknown;
}): number | null | undefined => {
  if (value === undefined || value === '') {
    return undefined;
  }

  if (value === null) {
    return null;
  }

  if (typeof value === 'string' && value.toLowerCase() === 'null') {
    return null;
  }

  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    return undefined;
  }

  return Math.trunc(parsed);
};

export class CreateVocabDto {
  @ApiProperty({ maxLength: 128, example: 'polyglot' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  @Transform(toTrimmedString)
  word!: string;

  @ApiProperty({ example: 'đa ngữ' })
  @IsString()
  @IsNotEmpty()
  @Transform(toTrimmedString)
  meaningVi!: string;

  @ApiPropertyOptional({
    example: 'a polyglot is someone who can speak many languages',
  })
  @IsOptional()
  @IsString()
  @Transform(toTrimmedString)
  explanationEn?: string;

  @ApiPropertyOptional({ example: 'learn with podcast' })
  @IsOptional()
  @IsString()
  @Transform(toTrimmedString)
  notes?: string;

  @ApiPropertyOptional({
    type: [String],
    maxItems: 32,
    example: ['podcast', 'yt'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(32)
  @Transform(toTagArray)
  tags?: string[];

  @ApiPropertyOptional({
    type: Number,
    nullable: true,
    minimum: 1,
    example: 12,
  })
  @IsOptional()
  @ValidateIf((_, v) => v !== null)
  @IsInt()
  @Min(1)
  @Transform(toNullableInt)
  captureBatchId?: number | null;

  @ApiPropertyOptional({
    type: Number,
    nullable: true,
    minimum: 0,
    example: 95,
  })
  @IsOptional()
  @ValidateIf((_, v) => v !== null)
  @IsInt()
  @Min(0)
  @Transform(toNullableInt)
  timecodeSec?: number | null;

  @ApiPropertyOptional({
    type: String,
    format: 'date-time',
    example: '2025-09-22T10:00:00.000Z',
  })
  @IsOptional()
  @Transform(toDateOrUndefined)
  dueAt?: Date;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isSuspended?: boolean;
}
