import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TeacherService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get all groups assigned to a teacher.
   */
  async getMyGroups(teacherId: string) {
    return this.prisma.level.findMany({
      where: { teacherId },
      include: {
        modules: { orderBy: { orderIndex: 'asc' } },
        _count: { select: { users: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  /**
   * Get all students across all of the teacher's groups.
   */
  async getMyStudents(teacherId: string) {
    const groups = await this.prisma.level.findMany({
      where: { teacherId },
      select: { id: true },
    });
    const groupIds = groups.map(g => g.id);

    return this.prisma.user.findMany({
      where: {
        role: 'STUDENT',
        currentLevelId: { in: groupIds },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        currentLevel: { select: { id: true, name: true, levelCode: true } },
        _count: { select: { progress: true } },
      },
      orderBy: { firstName: 'asc' },
    });
  }

  /**
   * Get upcoming classes across teacher's groups.
   */
  async getMySchedule(teacherId: string) {
    const groups = await this.prisma.level.findMany({
      where: { teacherId },
      select: { id: true },
    });
    const groupIds = groups.map(g => g.id);

    const modules = await this.prisma.module.findMany({
      where: { levelId: { in: groupIds } },
      select: { id: true },
    });
    const moduleIds = modules.map(m => m.id);

    return this.prisma.resource.findMany({
      where: {
        type: 'LIVE_CLASS',
        moduleId: { in: moduleIds },
        scheduledAt: { gte: new Date() },
      },
      include: {
        module: { include: { level: true } },
      },
      orderBy: { scheduledAt: 'asc' },
      take: 50,
    });
  }

  /**
   * Get upcoming and recent classes across teacher's groups for attendance.
   * Includes classes from the last 7 days.
   */
  async getAttendanceSchedule(teacherId: string) {
    const groups = await this.prisma.level.findMany({
      where: { teacherId },
      select: { id: true },
    });
    const groupIds = groups.map(g => g.id);

    const modules = await this.prisma.module.findMany({
      where: { levelId: { in: groupIds } },
      select: { id: true },
    });
    const moduleIds = modules.map(m => m.id);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return this.prisma.resource.findMany({
      where: {
        type: 'LIVE_CLASS',
        moduleId: { in: moduleIds },
        scheduledAt: { gte: sevenDaysAgo },
      },
      include: {
        module: { include: { level: true } },
      },
      orderBy: { scheduledAt: 'asc' },
      take: 100, // Slightly higher limit to accommodate past classes
    });
  }

  /**
   * Get teacher dashboard summary.
   */
  async getDashboard(teacherId: string) {
    const groups = await this.prisma.level.findMany({
      where: { teacherId },
      select: { id: true },
    });
    const groupIds = groups.map(g => g.id);

    const [totalGroups, totalStudents, upcomingClasses] = await Promise.all([
      groupIds.length,
      this.prisma.user.count({ where: { role: 'STUDENT', currentLevelId: { in: groupIds } } }),
      this.prisma.resource.count({
        where: {
          type: 'LIVE_CLASS',
          scheduledAt: { gte: new Date() },
          module: { levelId: { in: groupIds } },
        },
      }),
    ]);

    // Next class
    const modules = await this.prisma.module.findMany({
      where: { levelId: { in: groupIds } },
      select: { id: true },
    });
    const moduleIds = modules.map(m => m.id);

    const nextClass = await this.prisma.resource.findFirst({
      where: {
        type: 'LIVE_CLASS',
        moduleId: { in: moduleIds },
        scheduledAt: { gte: new Date() },
      },
      include: { module: { include: { level: true } } },
      orderBy: { scheduledAt: 'asc' },
    });

    return { totalGroups, totalStudents, upcomingClasses, nextClass };
  }

  /**
   * Record attendance for a class.
   */
  async recordAttendance(data: { resourceId: string; levelId: string; attendees: { userId: string; attended: boolean }[] }) {
    const results: any[] = [];

    for (const entry of data.attendees) {
      const record = await this.prisma.attendance.upsert({
        where: {
          userId_resourceId: {
            userId: entry.userId,
            resourceId: data.resourceId,
          },
        },
        update: { attended: entry.attended },
        create: {
          userId: entry.userId,
          resourceId: data.resourceId,
          levelId: data.levelId,
          attended: entry.attended,
        },
      });
      results.push(record);
    }

    return results;
  }

  /**
   * Get attendance for a specific class.
   */
  async getAttendance(resourceId: string) {
    if (!resourceId || resourceId === 'schedule' || resourceId === 'audit') {
      return [];
    }
    return this.prisma.attendance.findMany({
      where: { resourceId },
      include: {
        user: { select: { id: true, firstName: true, lastName: true } },
      },
    });
  }

  /**
   * Audit attendance for an entire group.
   */
  async getGroupAttendanceAudit(levelId: string) {
    const students = await this.prisma.user.findMany({
      where: { currentLevelId: levelId },
      orderBy: { firstName: 'asc' }
    });

    const pastClasses = await this.prisma.resource.findMany({
      where: {
        type: 'LIVE_CLASS',
        module: { levelId: levelId },
        scheduledAt: { lte: new Date() }
      },
      orderBy: { scheduledAt: 'desc' },
      include: { module: true }
    });

    const attendances = await this.prisma.attendance.findMany({
      where: { levelId: levelId }
    });

    // Create a map: "userId-resourceId" => boolean
    const attendanceMap = new Map();
    for (const a of attendances) {
      attendanceMap.set(`${a.userId}-${a.resourceId}`, a.attended);
    }

    return {
      students,
      classes: pastClasses,
      attendanceMap: Object.fromEntries(attendanceMap)
    };
  }

  /**
   * Audit attendance for a specific student.
   */
  async getStudentAttendanceAudit(studentId: string) {
    const student = await this.prisma.user.findUnique({
      where: { id: studentId },
      include: {
        currentLevel: true
      }
    });

    if (!student || !student.currentLevelId) {
      throw new Error('Student not found or not in a group');
    }

    // Get all past classes for this group
    const pastClasses = await this.prisma.resource.findMany({
      where: {
        type: 'LIVE_CLASS',
        module: { levelId: student.currentLevelId },
        scheduledAt: { lte: new Date() }
      },
      orderBy: { scheduledAt: 'desc' },
      include: { module: true }
    });

    // Get all attendance records for this student
    const attendances = await this.prisma.attendance.findMany({
      where: { userId: studentId }
    });

    const attendanceMap = new Map(attendances.map(a => [a.resourceId, a.attended]));

    return {
      student,
      audit: pastClasses.map(cls => ({
        class: cls,
        attended: attendanceMap.has(cls.id) ? attendanceMap.get(cls.id) : null // null means attendance was not taken yet
      }))
    };
  }

  /**
   * Teacher creates an evaluation for a student.
   */
  async createEvaluation(evaluatorId: string, data: any) {
    const oralScore = data.oralScore != null ? parseFloat(data.oralScore) : null;
    const writtenScore = data.writtenScore != null ? parseFloat(data.writtenScore) : null;
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
        evaluatedById: evaluatorId,
        notes: data.notes || null,
      },
    });
  }

  /**
   * Get evaluations across teacher's groups.
   */
  async getMyEvaluations(teacherId: string) {
    const groups = await this.prisma.level.findMany({
      where: { teacherId },
      select: { id: true },
    });
    const groupIds = groups.map(g => g.id);

    return this.prisma.evaluation.findMany({
      where: { levelId: { in: groupIds } },
      include: {
        user: { select: { id: true, firstName: true, lastName: true } },
        level: { select: { id: true, name: true, levelCode: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Create a new class log (bitacora).
   */
  async createClassLog(teacherId: string, data: { levelId: string; title: string; description: string; date?: string }) {
    const level = await this.prisma.level.findFirst({
      where: { id: data.levelId, teacherId: teacherId },
      include: { modules: { orderBy: { orderIndex: 'asc' }, take: 1 } },
    });
    
    if (!level) throw new Error('Grupo no encontrado o no autorizado');
    
    const moduleId = level.modules[0]?.id;
    if (!moduleId) throw new Error('El grupo no tiene módulos configurados para guardar la bitácora');

    return this.prisma.resource.create({
      data: {
        moduleId,
        type: 'LIVE_CLASS',
        title: data.title,
        description: data.description,
        scheduledAt: data.date ? new Date(data.date) : new Date(),
        durationExpected: 3600, // Default 1 hr
      },
      include: {
        module: { include: { level: true } }
      }
    });
  }

  /**
   * Get all class logs for a teacher.
   */
  async getClassLogs(teacherId: string) {
    const groups = await this.prisma.level.findMany({
      where: { teacherId },
      select: { id: true },
    });
    const groupIds = groups.map(g => g.id);

    const modules = await this.prisma.module.findMany({
      where: { levelId: { in: groupIds } },
      select: { id: true },
    });
    const moduleIds = modules.map(m => m.id);

    return this.prisma.resource.findMany({
      where: {
        type: 'LIVE_CLASS',
        moduleId: { in: moduleIds },
        description: { not: null },
      },
      include: {
        module: { include: { level: true } },
      },
      orderBy: { scheduledAt: 'desc' },
    });
  }

  /**
   * Update a class log (bitacora).
   */
  async updateClassLog(teacherId: string, logId: string, data: { title: string; description: string; date?: string }) {
    // Verificar que el log pertenezca a un grupo de este profesor
    const log = await this.prisma.resource.findUnique({
      where: { id: logId },
      include: { module: { include: { level: true } } },
    });
    if (!log || log.module?.level?.teacherId !== teacherId) {
      throw new Error('Bitácora no encontrada o no autorizada');
    }

    return this.prisma.resource.update({
      where: { id: logId },
      data: {
        title: data.title,
        description: data.description,
        ...(data.date ? { scheduledAt: new Date(data.date) } : {}),
      },
      include: {
        module: { include: { level: true } }
      }
    });
  }

  /**
   * Delete a class log (bitacora).
   */
  async deleteClassLog(teacherId: string, logId: string) {
    const log = await this.prisma.resource.findUnique({
      where: { id: logId },
      include: { module: { include: { level: true } } },
    });
    
    console.log('--- DELETE CLASS LOG DEBUG ---');
    console.log('Passed teacherId:', teacherId);
    console.log('Log found:', !!log);
    if (log) {
      console.log('Log level teacherId:', log.module?.level?.teacherId);
    }
    
    if (!log || log.module?.level?.teacherId !== teacherId) {
      throw new NotFoundException('Bitácora no encontrada o no autorizada');
    }

    return this.prisma.resource.delete({
      where: { id: logId }
    });
  }
}
