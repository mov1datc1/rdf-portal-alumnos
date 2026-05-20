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

  @Post('resources')
  createResource(@Body() body: any) {
    return this.adminService.createResource(body);
  }

  @Get('levels')
  getLevelsWithModules() {
    return this.adminService.getLevelsWithModules();
  }

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
}
