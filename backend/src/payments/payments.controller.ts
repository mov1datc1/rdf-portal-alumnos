import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // ── Enrollments ──

  @Get('enrollments')
  getAllEnrollments() {
    return this.paymentsService.getAllEnrollments();
  }

  @Post('enrollments')
  createEnrollment(@Body() body: any) {
    return this.paymentsService.createEnrollment(body);
  }

  @Patch('enrollments/:id')
  updateEnrollment(@Param('id') id: string, @Body() body: any) {
    return this.paymentsService.updateEnrollment(id, body);
  }

  @Delete('enrollments/:id')
  deleteEnrollment(@Param('id') id: string) {
    return this.paymentsService.deleteEnrollment(id);
  }

  // ── Payments ──

  @Get('payments')
  getAllPayments() {
    return this.paymentsService.getAllPayments();
  }

  @Post('payments')
  createPayment(@Body() body: any) {
    return this.paymentsService.createPayment(body);
  }

  @Delete('payments/:id')
  deletePayment(@Param('id') id: string) {
    return this.paymentsService.deletePayment(id);
  }

  // ── Analytics 360° ──

  @Get('analytics360')
  getAnalytics360() {
    return this.paymentsService.getAnalytics360();
  }
}
