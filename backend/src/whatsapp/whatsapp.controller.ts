import { Controller, Get, Post, Body, Query, UseGuards, HttpCode, ForbiddenException } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('whatsapp')
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) {}

  /**
   * GET /whatsapp/webhook — Meta verification endpoint
   */
  @Get('webhook')
  verifyWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
  ) {
    const result = this.whatsappService.verifyWebhook(mode, token, challenge);
    if (result) {
      return result;
    }
    throw new ForbiddenException('Webhook verification failed');
  }

  /**
   * POST /whatsapp/webhook — Incoming message webhook
   */
  @Post('webhook')
  @HttpCode(200)
  async handleWebhook(@Body() body: any) {
    await this.whatsappService.processWebhook(body);
    return 'EVENT_RECEIVED';
  }

  /**
   * GET /whatsapp/status — Check if WhatsApp is configured
   */
  @Get('status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  getStatus() {
    return {
      configured: this.whatsappService.isConfigured(),
      phoneId: process.env.WHATSAPP_PHONE_ID ? '***configured***' : null,
    };
  }

  /**
   * POST /whatsapp/send — Admin sends a message via WhatsApp
   */
  @Post('send')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async sendMessage(@Body() body: { to: string; message: string }) {
    return this.whatsappService.sendText({ to: body.to, body: body.message });
  }

  /**
   * POST /whatsapp/welcome-lead — Welcome a new lead via WhatsApp
   */
  @Post('welcome-lead')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async welcomeLead(@Body() body: { name: string; phone: string }) {
    return this.whatsappService.welcomeLead(body.name, body.phone);
  }

  /**
   * POST /whatsapp/remind-class — Send class reminder
   */
  @Post('remind-class')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async remindClass(@Body() body: { phone: string; studentName: string; groupName: string; dateTime: string; zoomLink: string }) {
    return this.whatsappService.remindClass(body.phone, body.studentName, body.groupName, body.dateTime, body.zoomLink);
  }

  /**
   * POST /whatsapp/confirm-payment — Confirm payment via WhatsApp
   */
  @Post('confirm-payment')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async confirmPayment(@Body() body: { phone: string; studentName: string; amount: string; method: string }) {
    return this.whatsappService.confirmPayment(body.phone, body.studentName, body.amount, body.method);
  }
}
