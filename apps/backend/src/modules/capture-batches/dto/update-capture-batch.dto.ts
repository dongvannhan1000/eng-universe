import { PartialType } from '@nestjs/mapped-types';
import { CreateCaptureBatchDto } from './create-capture-batch.dto';

export class UpdateCaptureBatchDto extends PartialType(CreateCaptureBatchDto) {}
