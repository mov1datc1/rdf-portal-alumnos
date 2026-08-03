import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('admin/leads')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Get()
  getAll() {
    return this.leadsService.getAll();
  }

  @Get('enrolled')
  getEnrolledLeads() {
    return this.leadsService.getEnrolledLeads();
  }

  @Get('analytics')
  getAnalytics() {
    return this.leadsService.getAnalytics();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.leadsService.getById(id);
  }

  @Post()
  create(@Body() body: any) {
    return this.leadsService.create(body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.leadsService.update(id, body);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.leadsService.updateStatus(id, body.status);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.leadsService.delete(id);
  }
}
