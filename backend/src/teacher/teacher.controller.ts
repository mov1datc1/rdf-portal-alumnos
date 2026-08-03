import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('teacher')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('TEACHER')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Get('dashboard')
  getDashboard(@Request() req: any) {
    return this.teacherService.getDashboard(req.user.id);
  }

  @Get('groups')
  getMyGroups(@Request() req: any) {
    return this.teacherService.getMyGroups(req.user.id);
  }

  @Get('students')
  getMyStudents(@Request() req: any) {
    return this.teacherService.getMyStudents(req.user.id);
  }

  @Get('schedule')
  getMySchedule(@Request() req: any) {
    return this.teacherService.getMySchedule(req.user.id);
  }

  @Post('attendance')
  recordAttendance(@Body() body: { resourceId: string; levelId: string; attendees: { userId: string; attended: boolean }[] }) {
    return this.teacherService.recordAttendance(body);
  }

  @Get('attendance/:resourceId')
  getAttendance(@Param('resourceId') resourceId: string) {
    return this.teacherService.getAttendance(resourceId);
  }

  @Get('evaluations')
  getMyEvaluations(@Request() req: any) {
    return this.teacherService.getMyEvaluations(req.user.id);
  }

  @Post('evaluations')
  createEvaluation(@Request() req: any, @Body() body: any) {
    return this.teacherService.createEvaluation(req.user.id, body);
  }
}
