import { Module } from '@nestjs/common';
import { VocabService } from './vocab.service';
import { VocabController } from './vocab.controller';

@Module({
  controllers: [VocabController],
  providers: [VocabService],
})
export class VocabModule {}
