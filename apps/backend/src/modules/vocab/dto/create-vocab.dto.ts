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
  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  @Transform(toTrimmedString)
  word!: string;

  @IsString()
  @IsNotEmpty()
  @Transform(toTrimmedString)
  meaningVi!: string;

  @IsOptional()
  @IsString()
  @Transform(toTrimmedString)
  explanationEn?: string;

  @IsOptional()
  @IsString()
  @Transform(toTrimmedString)
  notes?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(32)
  @Transform(toTagArray)
  tags?: string[];

  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(toNullableInt)
  captureBatchId?: number | null;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Transform(toNullableInt)
  timecodeSec?: number | null;

  @IsOptional()
  @Transform(toDateOrUndefined)
  dueAt?: Date;

  @IsOptional()
  @IsBoolean()
  isSuspended?: boolean;
}
