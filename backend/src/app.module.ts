import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { ProgressModule } from './progress/progress.module';
import { ClassesModule } from './classes/classes.module';
import { AiModule } from './ai/ai.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { ResourcesModule } from './resources/resources.module';

@Module({
  imports: [ProgressModule, ClassesModule, AiModule, AuthModule, AdminModule, ResourcesModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
