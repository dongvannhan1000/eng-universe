import { PartialType } from '@nestjs/mapped-types';
import { CreateVocabDto } from './create-vocab.dto';

export class UpdateVocabDto extends PartialType(CreateVocabDto) {}
