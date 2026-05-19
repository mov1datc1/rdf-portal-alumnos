import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('progress')
@UseGuards(JwtAuthGuard)
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get(':userId')
  async getUserProgress(@Param('userId') userId: string) {
    return this.progressService.getUserProgress(userId);
  }
}
