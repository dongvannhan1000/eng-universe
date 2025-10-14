import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class ListVocabReviewsQueryDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  take?: number = 20;
}
