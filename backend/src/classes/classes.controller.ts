import { Controller, Get, UseGuards } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('classes')
@UseGuards(JwtAuthGuard)
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Get('upcoming')
  async getUpcomingClasses() {
    return this.classesService.getUpcomingClasses();
  }
}
