import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class AdminService {
  private supabase;

  constructor(private prisma: PrismaService) {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
  }

  async getUsers() {
    return this.prisma.user.findMany({
      select: { id: true, email: true, firstName: true, lastName: true, role: true, isActive: true },
    });
  }

  async createUser(data: any) {
    // 1. Create user in Supabase Auth
    const { data: authData, error: authError } = await this.supabase.auth.admin.createUser({
      email: data.email,
      password: data.password || 'LesRois2026!',
      email_confirm: true,
      user_metadata: {
        firstName: data.firstName,
        lastName: data.lastName,
      }
    });

    if (authError) {
      throw new HttpException(authError.message, HttpStatus.BAD_REQUEST);
    }

    // 2. Create in Prisma
    return this.prisma.user.create({
      data: {
        id: authData.user.id,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role || 'STUDENT',
      },
    });
  }

  async updateUser(id: string, data: any) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async createResource(data: any) {
    return this.prisma.resource.create({
      data: {
        title: data.title,
        url: data.url,
        type: data.type || 'RECORDED_VIDEO',
        moduleId: data.moduleId,
        durationExpected: data.durationExpected || 0,
      },
    });
  }
}
