import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  getDashboardMetrics() {
    return this.adminService.getDashboardMetrics();
  }

  // ── Users ──

  @Get('users')
  getUsers() {
    return this.adminService.getUsers();
  }

  @Post('users')
  createUser(@Body() body: any) {
    return this.adminService.createUser(body);
  }

  @Patch('users/:id')
  updateUser(@Param('id') id: string, @Body() body: any) {
    return this.adminService.updateUser(id, body);
  }

  @Get('teachers')
  getTeachers() {
    return this.adminService.getTeachers();
  }

  @Post('users/:id/reset-password')
  resetPassword(@Param('id') id: string, @Body() body: { newPassword: string }) {
    return this.adminService.resetPassword(id, body.newPassword);
  }

  // ── Resources ──

  @Post('resources')
  createResource(@Body() body: any) {
    return this.adminService.createResource(body);
  }

  // ── Levels / Groups ──

  @Get('levels')
  getLevelsWithModules() {
    return this.adminService.getLevelsWithModules();
  }

  @Post('levels')
  createLevel(@Body() body: any) {
    return this.adminService.createLevel(body);
  }

  @Patch('levels/:id')
  updateLevel(@Param('id') id: string, @Body() body: any) {
    return this.adminService.updateLevel(id, body);
  }

  @Delete('levels/:id')
  deleteLevel(@Param('id') id: string) {
    return this.adminService.deleteLevel(id);
  }

  // ── Schedule ──

  @Post('schedule')
  scheduleClass(@Body() body: any) {
    return this.adminService.scheduleClass(body);
  }

  @Get('schedule')
  getScheduledClasses() {
    return this.adminService.getScheduledClasses();
  }

  @Delete('schedule/:id')
  deleteScheduledClass(@Param('id') id: string) {
    return this.adminService.deleteScheduledClass(id);
  }

  @Patch('schedule/:id')
  updateScheduledClass(@Param('id') id: string, @Body() body: any) {
    return this.adminService.updateScheduledClass(id, body);
  }

  // ── Evaluations ──

  @Get('evaluations')
  getEvaluations() {
    return this.adminService.getEvaluations();
  }

  @Post('evaluations')
  createEvaluation(@Body() body: any) {
    return this.adminService.createEvaluation(body);
  }

  // ── Settings ──

  @Get('settings')
  getSettings() {
    return this.adminService.getSettings();
  }

  @Patch('settings')
  updateSettings(@Body() body: any) {
    return this.adminService.updateSettings(body);
  }
}
