import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  // ── Enrollments ──

  async getAllEnrollments() {
    return this.prisma.enrollment.findMany({
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
        level: { select: { id: true, name: true, levelCode: true } },
        payments: { orderBy: { createdAt: 'desc' } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createEnrollment(data: any) {
    const enrollment = await this.prisma.enrollment.create({
      data: {
        userId: data.userId,
        levelId: data.levelId,
        planType: data.planType,
        monthlyFee: parseFloat(data.monthlyFee),
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        isActive: true,
      },
      include: {
        user: { select: { firstName: true, lastName: true } },
        level: { select: { name: true } },
      },
    });

    // Sincronizar el nivel actual del usuario
    await this.prisma.user.update({
      where: { id: data.userId },
      data: { currentLevelId: data.levelId },
    });

    return enrollment;
  }

  async updateEnrollment(id: string, data: any) {
    const update: any = {};
    if (data.planType !== undefined) update.planType = data.planType;
    if (data.monthlyFee !== undefined) update.monthlyFee = parseFloat(data.monthlyFee);
    if (data.startDate !== undefined) update.startDate = new Date(data.startDate);
    if (data.endDate !== undefined) update.endDate = data.endDate ? new Date(data.endDate) : null;
    if (data.isActive !== undefined) update.isActive = data.isActive;

    return this.prisma.enrollment.update({
      where: { id },
      data: update,
    });
  }

  async deleteEnrollment(id: string) {
    // Delete payments first, then enrollment
    await this.prisma.payment.deleteMany({ where: { enrollmentId: id } });
    return this.prisma.enrollment.delete({ where: { id } });
  }

  // ── Payments ──

  async getAllPayments() {
    return this.prisma.payment.findMany({
      include: {
        enrollment: {
          include: {
            user: { select: { firstName: true, lastName: true, email: true } },
            level: { select: { name: true, levelCode: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createPayment(data: any) {
    const payment = await this.prisma.payment.create({
      data: {
        enrollmentId: data.enrollmentId,
        amount: parseFloat(data.amount),
        paidAt: data.paidAt ? new Date(data.paidAt) : new Date(),
        method: data.method || 'PayPal',
        reference: data.reference || null,
      },
    });

    // Mark enrollment as active/paid
    await this.prisma.enrollment.update({
      where: { id: data.enrollmentId },
      data: { isActive: true },
    });

    return payment;
  }

  async deletePayment(id: string) {
    return this.prisma.payment.delete({ where: { id } });
  }

  // ── Analytics 360° ──

  async getAnalytics360() {
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [
      totalStudents,
      totalTeachers,
      totalGroups,
      totalLeads,
      enrolledLeads,
      activeEnrollments,
      thisMonthRevenue,
      lastMonthRevenue,
      allTimeRevenue,
      groupsByModality,
      groupsByRhythm,
      enrollmentsByPlan,
      paymentsByMethod,
      studentsByLevel,
      recentPayments,
      recentLeads,
    ] = await Promise.all([
      // Users
      this.prisma.user.count({ where: { role: 'STUDENT' } }),
      this.prisma.user.count({ where: { role: 'TEACHER' } }),
      this.prisma.level.count(),

      // Leads
      this.prisma.lead.count(),
      this.prisma.lead.count({ where: { status: 'ENROLLED' } }),

      // Enrollments
      this.prisma.enrollment.count({ where: { isActive: true } }),

      // Revenue this month
      this.prisma.payment.aggregate({
        _sum: { amount: true },
        where: { paidAt: { gte: thisMonthStart } },
      }),

      // Revenue last month
      this.prisma.payment.aggregate({
        _sum: { amount: true },
        where: { paidAt: { gte: lastMonthStart, lt: thisMonthStart } },
      }),

      // All time revenue
      this.prisma.payment.aggregate({ _sum: { amount: true } }),

      // Groups by modality
      this.prisma.level.groupBy({ by: ['modality'], _count: true }),

      // Groups by rhythm
      this.prisma.level.groupBy({ by: ['rhythm'], _count: true, where: { rhythm: { not: null } } }),

      // Enrollments by plan type
      this.prisma.enrollment.groupBy({ by: ['planType'], _count: true }),

      // Payments by method
      this.prisma.payment.groupBy({ by: ['method'], _count: true, _sum: { amount: true } }),

      // Students per level
      this.prisma.level.findMany({
        select: {
          id: true, name: true, levelCode: true, maxStudents: true, modality: true,
          _count: { select: { users: true } },
        },
        orderBy: { name: 'asc' },
      }),

      // Recent 5 payments
      this.prisma.payment.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          enrollment: {
            include: {
              user: { select: { firstName: true, lastName: true } },
              level: { select: { name: true } },
            },
          },
        },
      }),

      // Recent 5 leads
      this.prisma.lead.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    // Get settings for ad budgets
    let settings: any = null;
    try {
      settings = await this.prisma.appSettings.findUnique({ where: { id: 'global' } });
    } catch { /* no settings */ }

    const conversionRate = totalLeads > 0 ? ((enrolledLeads / totalLeads) * 100).toFixed(1) : '0';
    const totalAdSpend = (settings?.googleAdsBudget || 10000) + (settings?.metaAdsBudget || 3000);
    const costPerStudent = enrolledLeads > 0 ? Math.round(totalAdSpend / enrolledLeads) : null;

    return {
      summary: {
        totalStudents,
        totalTeachers,
        totalGroups,
        activeEnrollments,
        totalLeads,
        enrolledLeads,
        conversionRate: `${conversionRate}%`,
        costPerStudent,
      },
      revenue: {
        thisMonth: thisMonthRevenue._sum.amount || 0,
        lastMonth: lastMonthRevenue._sum.amount || 0,
        allTime: allTimeRevenue._sum.amount || 0,
        monthOverMonth: lastMonthRevenue._sum.amount
          ? (((thisMonthRevenue._sum.amount || 0) - lastMonthRevenue._sum.amount) / lastMonthRevenue._sum.amount * 100).toFixed(1)
          : null,
      },
      distribution: {
        groupsByModality: groupsByModality.map(g => ({ modality: g.modality, count: g._count })),
        groupsByRhythm: groupsByRhythm.map(g => ({ rhythm: g.rhythm, count: g._count })),
        enrollmentsByPlan: enrollmentsByPlan.map(e => ({ plan: e.planType, count: e._count })),
        paymentsByMethod: paymentsByMethod.map(p => ({ method: p.method, count: p._count, total: p._sum.amount || 0 })),
      },
      occupancy: studentsByLevel.map(l => ({
        id: l.id,
        name: l.name,
        levelCode: l.levelCode,
        modality: l.modality,
        current: l._count.users,
        max: l.maxStudents,
        pct: l.maxStudents > 0 ? Math.round((l._count.users / l.maxStudents) * 100) : 0,
      })),
      recent: {
        payments: recentPayments,
        leads: recentLeads,
      },
      adBudgets: {
        google: settings?.googleAdsBudget || 10000,
        meta: settings?.metaAdsBudget || 3000,
        total: totalAdSpend,
      },
    };
  }
}
