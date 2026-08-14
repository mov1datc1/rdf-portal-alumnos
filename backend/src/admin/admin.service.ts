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

  // ── Users ──

  async getUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true, email: true, firstName: true, lastName: true, phone: true,
        role: true, isActive: true, currentLevelId: true,
        currentLevel: { select: { name: true, levelCode: true } },
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getTeachers() {
    return this.prisma.user.findMany({
      where: { role: 'TEACHER' },
      select: {
        id: true, email: true, firstName: true, lastName: true,
        _count: { select: { teacherGroups: true } },
      },
      orderBy: { firstName: 'asc' }
    });
  }

  async getDashboardMetrics() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [activeStudents, totalResources, newStudents, totalGroups, totalTeachers, totalLeads, convertedLeads] = await Promise.all([
      this.prisma.user.count({ where: { role: 'STUDENT', isActive: true } }),
      this.prisma.resource.count(),
      this.prisma.user.count({ where: { role: 'STUDENT', createdAt: { gte: thirtyDaysAgo } } }),
      this.prisma.level.count(),
      this.prisma.user.count({ where: { role: 'TEACHER' } }),
      this.prisma.lead.count().catch(() => 0),
      this.prisma.lead.count({ where: { status: 'ENROLLED' } }).catch(() => 0),
    ]);

    return { activeStudents, totalResources, newStudents, totalGroups, totalTeachers, totalLeads, convertedLeads };
  }

  async createUser(data: any) {
    const { data: authData, error: authError } = await this.supabase.auth.admin.createUser({
      email: data.email,
      password: data.password || 'LesRois2026!',
      email_confirm: true,
      user_metadata: {
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role || 'STUDENT',
      }
    });

    if (authError) {
      throw new HttpException(authError.message, HttpStatus.BAD_REQUEST);
    }

    return this.prisma.user.create({
      data: {
        id: authData.user.id,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone || null,
        role: data.role || 'STUDENT',
        currentLevelId: data.currentLevelId || null,
      },
    });
  }

  async updateUser(id: string, data: any) {
    const updateData: any = {};
    if (data.firstName !== undefined) updateData.firstName = data.firstName;
    if (data.lastName !== undefined) updateData.lastName = data.lastName;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.role !== undefined) updateData.role = data.role;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.currentLevelId !== undefined) updateData.currentLevelId = data.currentLevelId || null;

    // Sincronizar metadata con Supabase
    if (data.role !== undefined || data.firstName !== undefined || data.lastName !== undefined) {
      const user_metadata: any = {};
      if (data.role !== undefined) user_metadata.role = data.role;
      if (data.firstName !== undefined) user_metadata.firstName = data.firstName;
      if (data.lastName !== undefined) user_metadata.lastName = data.lastName;

      const { error } = await this.supabase.auth.admin.updateUserById(id, { user_metadata });
      if (error) {
        console.error('Error actualizando metadata en Supabase:', error);
      }
    }

    return this.prisma.user.update({ where: { id }, data: updateData });
  }

  async resetPassword(userId: string, newPassword: string) {
    if (!newPassword || newPassword.length < 6) {
      throw new HttpException('La contraseña debe tener al menos 6 caracteres', HttpStatus.BAD_REQUEST);
    }

    const { error } = await this.supabase.auth.admin.updateUserById(userId, {
      password: newPassword,
    });

    if (error) {
      throw new HttpException(`Error al resetear contraseña: ${error.message}`, HttpStatus.BAD_REQUEST);
    }

    return { success: true, message: 'Contraseña actualizada exitosamente' };
  }

  // ── Resources ──

  async getResources() {
    return this.prisma.resource.findMany({
      include: {
        module: {
          include: {
            level: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async deleteResource(id: string) {
    return this.prisma.resource.delete({ where: { id } });
  }

  async batchDeleteResources(ids: string[]) {
    return this.prisma.resource.deleteMany({
      where: {
        id: { in: ids }
      }
    });
  }

  async updateResource(id: string, data: any) {
    return this.prisma.resource.update({
      where: { id },
      data: {
        title: data.title,
        url: data.url
      }
    });
  }

  async createResource(data: any) {
    // Si viene un array de moduleIds (publicación masiva)
    if (data.moduleIds && Array.isArray(data.moduleIds)) {
      const created = await Promise.all(data.moduleIds.map((modId: string) => 
        this.prisma.resource.create({
          data: {
            title: data.title,
            url: data.url,
            type: data.type || 'RECORDED_VIDEO',
            moduleId: modId,
            durationExpected: data.durationExpected || 0,
          }
        })
      ));
      return { success: true, count: created.length };
    }

    // Comportamiento normal (un solo grupo)
    return this.prisma.resource.create({
      data: {
        title: data.title,
        url: data.url,
        type: data.type || 'RECORDED_VIDEO',
        moduleId: data.moduleId,
        durationExpected: data.durationExpected || 0,
      }
    });
  }

  // ── Levels / Groups ──

  async getLevelsWithModules() {
    return this.prisma.level.findMany({
      include: {
        modules: { orderBy: { orderIndex: 'asc' } },
        teacher: { select: { id: true, firstName: true, lastName: true, email: true } },
        zoomHostGroup: { select: { id: true, displayName: true, email: true, permanentLink: true } },
        _count: { select: { users: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createLevel(data: any) {
    const level = await this.prisma.level.create({
      data: {
        name: data.name,
        levelCode: data.levelCode || 'Basico1',
        modality: data.modality || 'GROUP',
        rhythm: data.rhythm || null,
        schedule: data.schedule || null,
        maxStudents: data.maxStudents || 8,
        zoomLink: data.zoomLink || null,
        zoomHostId: data.zoomHostId || null,
        teacherId: data.teacherId || null,
        totalScoreTarget: 100,
      }
    });

    // Auto-create 4 units (Unidades) for groups
    if (data.modality === 'GROUP' || !data.modality) {
      for (let i = 1; i <= 4; i++) {
        await this.prisma.module.create({
          data: {
            levelId: level.id,
            title: `Unidad ${i}`,
            orderIndex: i,
          }
        });
      }
    } else {
      // For Individual/PartDuo, single module
      await this.prisma.module.create({
        data: {
          levelId: level.id,
          title: 'Módulo Principal',
          orderIndex: 1,
        }
      });
    }

    return level;
  }

  async updateLevel(id: string, data: any) {
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.levelCode !== undefined) updateData.levelCode = data.levelCode;
    if (data.modality !== undefined) updateData.modality = data.modality;
    if (data.rhythm !== undefined) updateData.rhythm = data.rhythm;
    if (data.schedule !== undefined) updateData.schedule = data.schedule;
    if (data.maxStudents !== undefined) updateData.maxStudents = data.maxStudents;
    if (data.zoomLink !== undefined) updateData.zoomLink = data.zoomLink;
    if (data.zoomHostId !== undefined) updateData.zoomHostId = data.zoomHostId || null;
    if (data.teacherId !== undefined) updateData.teacherId = data.teacherId || null;

    return this.prisma.level.update({ where: { id }, data: updateData });
  }

  async deleteLevel(id: string) {
    const modules = await this.prisma.module.findMany({ where: { levelId: id } });
    const moduleIds = modules.map(m => m.id);

    const resources = await this.prisma.resource.findMany({ where: { moduleId: { in: moduleIds } } });
    const resourceIds = resources.map(r => r.id);

    await this.prisma.attendance.deleteMany({ where: { levelId: id } });
    await this.prisma.evaluation.deleteMany({ where: { levelId: id } });
    await this.prisma.enrollment.deleteMany({ where: { levelId: id } });
    await this.prisma.userProgress.deleteMany({ where: { resourceId: { in: resourceIds } } });
    await this.prisma.resource.deleteMany({ where: { moduleId: { in: moduleIds } } });
    await this.prisma.module.deleteMany({ where: { levelId: id } });
    await this.prisma.user.updateMany({ where: { currentLevelId: id }, data: { currentLevelId: null } });

    return this.prisma.level.delete({ where: { id } });
  }

  private async validateTeacherAvailability(teacherId: string, scheduledStart: Date, scheduledEnd: Date, excludeClassId?: string) {
    if (!teacherId) return;

    const overlappingClasses = await this.prisma.resource.findMany({
      where: {
        type: 'LIVE_CLASS',
        id: excludeClassId ? { not: excludeClassId } : undefined,
        OR: [
          { teacherId: teacherId },
          { module: { level: { teacherId: teacherId } } }
        ]
      },
      include: { module: { include: { level: true } } }
    });

    for (const cls of overlappingClasses) {
      if (!cls.scheduledAt) continue;
      
      const actualTeacherId = cls.teacherId || cls.module?.level?.teacherId;
      if (actualTeacherId !== teacherId) continue;

      const clsStart = new Date(cls.scheduledAt);
      const clsEnd = new Date(clsStart.getTime() + (cls.durationExpected || 3600) * 1000);
      if (scheduledStart < clsEnd && scheduledEnd > clsStart) {
        // Find available teachers
        const allTeachers = await this.prisma.user.findMany({ where: { role: 'TEACHER' } });
        const allClasses = await this.prisma.resource.findMany({
          where: { type: 'LIVE_CLASS', scheduledAt: { not: null } },
          include: { module: { include: { level: true } } }
        });

        const availableTeachers = allTeachers.filter(t => {
          return !allClasses.some(c => {
            const cTid = c.teacherId || c.module?.level?.teacherId;
            if (cTid !== t.id) return false;
            const cStart = new Date(c.scheduledAt!);
            const cEnd = new Date(cStart.getTime() + (c.durationExpected || 3600) * 1000);
            return scheduledStart < cEnd && scheduledEnd > cStart;
          });
        });

        const availNames = availableTeachers.map(t => `${t.firstName} ${t.lastName}`).join(', ');
        throw new HttpException(
          `El profesor ya tiene una clase programada en ese horario.\nProfesores disponibles: ${availNames || 'Ninguno'}`,
          HttpStatus.BAD_REQUEST
        );
      }
    }
  }

  // ── Schedule ──

  async scheduleClass(data: any) {
    let zoomMeetingId: string | null = null;
    let zoomJoinUrl: string | null = data.url || null;
    const zoomHostId: string | null = data.zoomHostId || null;

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

    // Find or create the module by name
    let moduleId = data.moduleId;
    if (data.moduleName && data.levelId) {
      const existingModule = await this.prisma.module.findFirst({
        where: { levelId: data.levelId, title: data.moduleName }
      });
      if (existingModule) {
        moduleId = existingModule.id;
      } else {
        const count = await this.prisma.module.count({ where: { levelId: data.levelId } });
        const newModule = await this.prisma.module.create({
          data: {
            levelId: data.levelId,
            title: data.moduleName,
            orderIndex: count + 1
          }
        });
        moduleId = newModule.id;
      }
    }

    // Get level to get default teacher if not provided
    let teacherId = data.teacherId;
    if (!teacherId && data.levelId) {
      const level = await this.prisma.level.findUnique({ where: { id: data.levelId } });
      if (level?.teacherId) teacherId = level.teacherId;
    }

    // TEACHER OVERLAP CHECK
    if (teacherId) {
      const scheduledStart = new Date(data.scheduledAt);
      const scheduledEnd = new Date(scheduledStart.getTime() + (data.durationExpected || 3600) * 1000);
      await this.validateTeacherAvailability(teacherId, scheduledStart, scheduledEnd);
    }

    return this.prisma.resource.create({
      data: {
        title: data.title,
        url: zoomJoinUrl,
        type: 'LIVE_CLASS',
        moduleId: moduleId,
        teacherId: teacherId || null,
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
        module: { include: { level: true } },
        zoomHost: { select: { id: true, displayName: true, email: true } },
        teacher: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { scheduledAt: 'desc' }
    });
  }

  async deleteScheduledClass(id: string) {
    const resource = await this.prisma.resource.findUnique({ where: { id } });
    if (resource?.zoomMeetingId && resource?.zoomHostId && this.zoomService) {
      await this.zoomService.deleteMeeting(resource.zoomHostId, resource.zoomMeetingId);
    }
    await this.prisma.attendance.deleteMany({ where: { resourceId: id } });
    await this.prisma.userProgress.deleteMany({ where: { resourceId: id } });
    return this.prisma.resource.delete({ where: { id } });
  }

  async updateScheduledClass(id: string, data: any) {
    // Get current class to know its teacher and duration if not provided
    const currentClass = await this.prisma.resource.findUnique({ where: { id }, include: { module: { include: { level: true } } } });
    if (!currentClass) throw new Error('Clase no encontrada');

    const teacherId = data.teacherId !== undefined ? data.teacherId : (currentClass.teacherId || currentClass.module?.level?.teacherId);
    const scheduledStart = data.scheduledAt ? new Date(data.scheduledAt) : (currentClass.scheduledAt ? new Date(currentClass.scheduledAt) : new Date());
    const duration = data.durationExpected || currentClass.durationExpected || 3600;
    const scheduledEnd = new Date(scheduledStart.getTime() + duration * 1000);

    // TEACHER OVERLAP CHECK
    if (teacherId) {
      await this.validateTeacherAvailability(teacherId, scheduledStart, scheduledEnd, id);
    }

    return this.prisma.resource.update({
      where: { id },
      data: {
        title: data.title,
        url: data.url,
        moduleId: data.moduleId,
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : undefined,
        teacherId: data.teacherId !== undefined ? data.teacherId : undefined,
      }
    });
  }

  // ── Evaluations ──

  async getEvaluations() {
    return this.prisma.evaluation.findMany({
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
        level: { select: { id: true, name: true, levelCode: true } },
        evaluatedBy: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createEvaluation(data: any) {
    const oralScore = data.oralScore != null ? parseFloat(data.oralScore) : null;
    const writtenScore = data.writtenScore != null ? parseFloat(data.writtenScore) : null;

    // Determine pass: oral ≥ 60 is required, written ≥ 60 if provided
    const oralPassed = oralScore != null && oralScore >= 60;
    const writtenPassed = writtenScore == null || writtenScore >= 60;
    const passed = oralPassed && writtenPassed;

    return this.prisma.evaluation.create({
      data: {
        userId: data.userId,
        levelId: data.levelId,
        oralScore,
        writtenScore,
        passed,
        evaluatedById: data.evaluatedById || null,
        notes: data.notes || null,
      }
    });
  }

  // ── App Settings ──

  async getSettings() {
    let settings = await this.prisma.appSettings.findUnique({ where: { id: 'global' } });
    if (!settings) {
      settings = await this.prisma.appSettings.create({
        data: { id: 'global', googleAdsBudget: 10000, metaAdsBudget: 3000 }
      });
    }
    return settings;
  }

  async updateSettings(data: any) {
    return this.prisma.appSettings.upsert({
      where: { id: 'global' },
      update: data,
      create: { id: 'global', ...data },
    });
  }
}
