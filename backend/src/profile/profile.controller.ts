import { Controller, Post, Body, UseGuards, Req, HttpException, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { createClient } from '@supabase/supabase-js';

@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  private supabase;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL as string,
      process.env.SUPABASE_SERVICE_ROLE_KEY as string
    );
  }

  @Post('change-password')
  async changePassword(@Req() req: any, @Body() body: { currentPassword: string; newPassword: string }) {
    const userId = req.user?.sub || req.user?.id;
    if (!userId) {
      throw new HttpException('Usuario no autenticado', HttpStatus.UNAUTHORIZED);
    }

    if (!body.newPassword || body.newPassword.length < 6) {
      throw new HttpException('La nueva contraseña debe tener al menos 6 caracteres', HttpStatus.BAD_REQUEST);
    }

    // Update password via Supabase Admin API
    const { error } = await this.supabase.auth.admin.updateUserById(userId, {
      password: body.newPassword,
    });

    if (error) {
      throw new HttpException(`Error al cambiar contraseña: ${error.message}`, HttpStatus.BAD_REQUEST);
    }

    return { success: true, message: 'Contraseña actualizada exitosamente' };
  }
}
