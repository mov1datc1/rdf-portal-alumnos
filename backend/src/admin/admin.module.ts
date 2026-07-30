import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { PrismaService } from '../prisma.service';
import { ZoomModule } from '../zoom/zoom.module';

@Module({
  imports: [ZoomModule],
  controllers: [AdminController],
  providers: [AdminService, PrismaService],
})
export class AdminModule {}

