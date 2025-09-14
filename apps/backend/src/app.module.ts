import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health.controller';
import { VocabModule } from './modules/vocab/vocab.module';
import { PrismaService } from './infra/prisma/prisma.service';
import { PrismaModule } from './infra/prisma/prisma.module';

@Module({
  imports: [VocabModule, PrismaModule],
  controllers: [AppController, HealthController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
