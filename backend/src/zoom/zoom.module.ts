import { Module } from '@nestjs/common';
import { ZoomController } from './zoom.controller';
import { ZoomService } from './zoom.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [ZoomController],
  providers: [ZoomService, PrismaService],
  exports: [ZoomService],
})
export class ZoomModule {}
