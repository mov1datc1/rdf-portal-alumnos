import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class AdminService {
  private supabase;

  constructor(private prisma: PrismaService) {
    this.supabase = createClient(
      process.env.SUPABASE_URL as string,
      process.env.SUPABASE_SERVICE_ROLE_KEY as string
    );
  }

  async getUsers() {
    return this.prisma.user.findMany({
      select: { id: true, email: true, firstName: true, lastName: true, role: true, isActive: true, currentLevelId: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getDashboardMetrics() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [activeStudents, totalResources, newStudents] = await Promise.all([
      this.prisma.user.count({ where: { role: 'STUDENT', isActive: true } }),
      this.prisma.resource.count(),
      this.prisma.user.count({ where: { role: 'STUDENT', createdAt: { gte: thirtyDaysAgo } } })
    ]);

    return { activeStudents, totalResources, newStudents };
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
        currentLevelId: data.currentLevelId || null,
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

  async getLevelsWithModules() {
    return this.prisma.level.findMany({
      include: {
        modules: {
          orderBy: { orderIndex: 'asc' }
        }
      }
    });
  }

  async scheduleClass(data: any) {
    return this.prisma.resource.create({
      data: {
        title: data.title,
        url: data.url,
        type: 'LIVE_CLASS',
        moduleId: data.moduleId,
        scheduledAt: new Date(data.scheduledAt),
        durationExpected: data.durationExpected || 3600,
      },
    });
  }

  async getScheduledClasses() {
    return this.prisma.resource.findMany({
      where: { type: 'LIVE_CLASS' },
      include: {
        module: {
          include: { level: true }
        }
      },
      orderBy: { scheduledAt: 'desc' }
    });
  }

  async deleteScheduledClass(id: string) {
    // Eliminar progresos asociados para evitar error de foreign key
    await this.prisma.userProgress.deleteMany({ where: { resourceId: id } });
    return this.prisma.resource.delete({ where: { id } });
  }

  async updateScheduledClass(id: string, data: any) {
    return this.prisma.resource.update({
      where: { id },
      data: {
        title: data.title,
        url: data.url,
        moduleId: data.moduleId,
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : undefined,
      }
    });
  }
}
