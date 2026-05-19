import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { ProgressModule } from './progress/progress.module';
import { ClassesModule } from './classes/classes.module';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [ProgressModule, ClassesModule, AiModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
