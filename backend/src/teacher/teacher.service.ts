import { Injectable } from '@nestjs/common';
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
    return this.prisma.attendance.findMany({
      where: { resourceId },
      include: {
        user: { select: { id: true, firstName: true, lastName: true } },
      },
    });
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
}
