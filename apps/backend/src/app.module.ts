import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { HealthController } from './health.controller';
import { PrismaModule } from './infra/prisma/prisma.module';
import { CaptureBatchesModule } from './modules/capture-batches/capture-batches.module';
import { VocabModule } from './modules/vocab/vocab.module';
import { DecksModule } from './modules/decks/decks.module';
import { ReviewModule } from './modules/review/review.module';

@Module({
  imports: [
    CommonModule,
    VocabModule,
    CaptureBatchesModule,
    PrismaModule,
    DecksModule,
    ReviewModule,
  ],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
