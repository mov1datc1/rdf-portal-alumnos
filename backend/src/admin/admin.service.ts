import { Injectable, HttpException, HttpStatus, Inject, Optional } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ZoomService } from '../zoom/zoom.service';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class AdminService {
  private supabase;

  constructor(
    private prisma: PrismaService,
    @Optional() @Inject(ZoomService) private zoomService?: ZoomService,
  ) {
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
    let zoomMeetingId: string | null = null;
    let zoomJoinUrl: string | null = data.url || null;
    const zoomHostId: string | null = data.zoomHostId || null;

    // If a Zoom host is selected, auto-create the meeting
    if (zoomHostId && this.zoomService) {
      const durationMinutes = Math.round((data.durationExpected || 3600) / 60);
      const result = await this.zoomService.createMeeting(
        zoomHostId,
        data.title,
        new Date(data.scheduledAt),
        durationMinutes,
      );
      zoomMeetingId = result.meetingId;
      zoomJoinUrl = result.joinUrl;
    }

    return this.prisma.resource.create({
      data: {
        title: data.title,
        url: zoomJoinUrl,
        type: 'LIVE_CLASS',
        moduleId: data.moduleId,
        scheduledAt: new Date(data.scheduledAt),
        durationExpected: data.durationExpected || 3600,
        zoomMeetingId,
        zoomHostId,
      },
    });
  }

  async getScheduledClasses() {
    return this.prisma.resource.findMany({
      where: { type: 'LIVE_CLASS' },
      include: {
        module: {
          include: { level: true }
        },
        zoomHost: {
          select: { id: true, displayName: true, email: true }
        },
      },
      orderBy: { scheduledAt: 'desc' }
    });
  }

  async deleteScheduledClass(id: string) {
    // Cancel Zoom meeting if one exists
    const resource = await this.prisma.resource.findUnique({ where: { id } });
    if (resource?.zoomMeetingId && resource?.zoomHostId && this.zoomService) {
      await this.zoomService.deleteMeeting(resource.zoomHostId, resource.zoomMeetingId);
    }

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

  async createLevel(data: any) {
    const level = await this.prisma.level.create({
      data: {
        name: data.name,
        levelCode: data.levelCode || 'A1',
        schedule: data.schedule || null,
        totalScoreTarget: 100,
      }
    });
    
    await this.prisma.module.create({
      data: {
        levelId: level.id,
        title: 'Módulo Único',
        orderIndex: 1,
      }
    });
    
    return level;
  }

  async updateLevel(id: string, data: any) {
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.levelCode !== undefined) updateData.levelCode = data.levelCode;
    if (data.schedule !== undefined) updateData.schedule = data.schedule;

    return this.prisma.level.update({
      where: { id },
      data: updateData,
    });
  }

  async deleteLevel(id: string) {
    const modules = await this.prisma.module.findMany({ where: { levelId: id } });
    const moduleIds = modules.map(m => m.id);
    
    const resources = await this.prisma.resource.findMany({ where: { moduleId: { in: moduleIds } } });
    const resourceIds = resources.map(r => r.id);
    
    await this.prisma.userProgress.deleteMany({ where: { resourceId: { in: resourceIds } } });
    await this.prisma.resource.deleteMany({ where: { moduleId: { in: moduleIds } } });
    await this.prisma.module.deleteMany({ where: { levelId: id } });
    await this.prisma.user.updateMany({ where: { currentLevelId: id }, data: { currentLevelId: null } });
    
    return this.prisma.level.delete({ where: { id } });
  }
}
