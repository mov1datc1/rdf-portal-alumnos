import { Controller, Get } from '@nestjs/common';
import { ClassesService } from './classes.service';

@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Get('upcoming')
  async getUpcomingClasses() {
    return this.classesService.getUpcomingClasses();
  }
}
