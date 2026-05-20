import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('classes')
@UseGuards(JwtAuthGuard)
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Get('upcoming')
  async getUpcomingClasses(@Req() req: any) {
    return this.classesService.getUpcomingClasses(req.user.userId);
  }
}
