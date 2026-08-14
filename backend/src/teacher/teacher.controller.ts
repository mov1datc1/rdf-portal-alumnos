import { Controller, Get, Post, Body, Param, UseGuards, Request, Patch, Delete } from '@nestjs/common';
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
    return this.teacherService.getDashboard(req.user.userId);
  }

  @Get('groups')
  getMyGroups(@Request() req: any) {
    return this.teacherService.getMyGroups(req.user.userId);
  }

  @Get('students')
  getMyStudents(@Request() req: any) {
    return this.teacherService.getMyStudents(req.user.userId);
  }

  @Get('schedule')
  getMySchedule(@Request() req: any) {
    return this.teacherService.getMySchedule(req.user.userId);
  }

  @Get('attendance/schedule')
  getAttendanceSchedule(@Request() req: any) {
    return this.teacherService.getAttendanceSchedule(req.user.userId);
  }

  @Post('attendance')
  recordAttendance(@Body() body: { resourceId: string; levelId: string; attendees: { userId: string; attended: boolean }[] }) {
    return this.teacherService.recordAttendance(body);
  }

  @Get('attendance/:resourceId')
  getAttendance(@Param('resourceId') resourceId: string) {
    return this.teacherService.getAttendance(resourceId);
  }

  @Get('attendance/audit/:studentId')
  getStudentAttendanceAudit(@Param('studentId') studentId: string) {
    return this.teacherService.getStudentAttendanceAudit(studentId);
  }

  @Get('attendance/audit/group/:levelId')
  getGroupAttendanceAudit(@Param('levelId') levelId: string) {
    return this.teacherService.getGroupAttendanceAudit(levelId);
  }

  @Get('evaluations')
  getMyEvaluations(@Request() req: any) {
    return this.teacherService.getMyEvaluations(req.user.userId);
  }

  @Post('evaluations')
  createEvaluation(@Request() req: any, @Body() body: any) {
    return this.teacherService.createEvaluation(req.user.userId, body);
  }

  @Get('logs')
  getClassLogs(@Request() req: any) {
    return this.teacherService.getClassLogs(req.user.userId);
  }

  @Post('logs')
  createClassLog(@Request() req: any, @Body() body: { levelId: string; title: string; description: string; date?: string }) {
    return this.teacherService.createClassLog(req.user.userId, body);
  }

  @Patch('logs/:id')
  updateClassLog(@Request() req: any, @Param('id') id: string, @Body() body: { title: string; description: string; date?: string }) {
    return this.teacherService.updateClassLog(req.user.userId, id, body);
  }

  @Delete('logs/:id')
  deleteClassLog(@Request() req: any, @Param('id') id: string) {
    return this.teacherService.deleteClassLog(req.user.userId, id);
  }
}
