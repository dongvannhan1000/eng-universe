import { Module } from '@nestjs/common';
import { CaptureBatchesController } from './capture-batches.controller';
import { CaptureBatchesService } from './capture-batches.service';

@Module({
  controllers: [CaptureBatchesController],
  providers: [CaptureBatchesService],
})
export class CaptureBatchesModule {}
