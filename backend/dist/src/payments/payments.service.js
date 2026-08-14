"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let PaymentsService = class PaymentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
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
    async createEnrollment(data) {
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
        await this.prisma.user.update({
            where: { id: data.userId },
            data: { currentLevelId: data.levelId },
        });
        return enrollment;
    }
    async updateEnrollment(id, data) {
        const update = {};
        if (data.planType !== undefined)
            update.planType = data.planType;
        if (data.monthlyFee !== undefined)
            update.monthlyFee = parseFloat(data.monthlyFee);
        if (data.startDate !== undefined)
            update.startDate = new Date(data.startDate);
        if (data.endDate !== undefined)
            update.endDate = data.endDate ? new Date(data.endDate) : null;
        if (data.isActive !== undefined)
            update.isActive = data.isActive;
        return this.prisma.enrollment.update({
            where: { id },
            data: update,
        });
    }
    async deleteEnrollment(id) {
        await this.prisma.payment.deleteMany({ where: { enrollmentId: id } });
        return this.prisma.enrollment.delete({ where: { id } });
    }
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
    async createPayment(data) {
        const payment = await this.prisma.payment.create({
            data: {
                enrollmentId: data.enrollmentId,
                amount: parseFloat(data.amount),
                paidAt: data.paidAt ? new Date(data.paidAt) : new Date(),
                method: data.method || 'PayPal',
                reference: data.reference || null,
            },
        });
        await this.prisma.enrollment.update({
            where: { id: data.enrollmentId },
            data: { isActive: true },
        });
        return payment;
    }
    async deletePayment(id) {
        return this.prisma.payment.delete({ where: { id } });
    }
    async getAnalytics360() {
        const now = new Date();
        const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const [totalStudents, totalTeachers, totalGroups, totalLeads, enrolledLeads, activeEnrollments, thisMonthRevenue, lastMonthRevenue, allTimeRevenue, groupsByModality, groupsByRhythm, enrollmentsByPlan, paymentsByMethod, studentsByLevel, recentPayments, recentLeads,] = await Promise.all([
            this.prisma.user.count({ where: { role: 'STUDENT' } }),
            this.prisma.user.count({ where: { role: 'TEACHER' } }),
            this.prisma.level.count(),
            this.prisma.lead.count(),
            this.prisma.lead.count({ where: { status: 'ENROLLED' } }),
            this.prisma.enrollment.count({ where: { isActive: true } }),
            this.prisma.payment.aggregate({
                _sum: { amount: true },
                where: { paidAt: { gte: thisMonthStart } },
            }),
            this.prisma.payment.aggregate({
                _sum: { amount: true },
                where: { paidAt: { gte: lastMonthStart, lt: thisMonthStart } },
            }),
            this.prisma.payment.aggregate({ _sum: { amount: true } }),
            this.prisma.level.groupBy({ by: ['modality'], _count: true }),
            this.prisma.level.groupBy({ by: ['rhythm'], _count: true, where: { rhythm: { not: null } } }),
            this.prisma.enrollment.groupBy({ by: ['planType'], _count: true }),
            this.prisma.payment.groupBy({ by: ['method'], _count: true, _sum: { amount: true } }),
            this.prisma.level.findMany({
                select: {
                    id: true, name: true, levelCode: true, maxStudents: true, modality: true,
                    _count: { select: { users: true } },
                },
                orderBy: { name: 'asc' },
            }),
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
            this.prisma.lead.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
            }),
        ]);
        let settings = null;
        try {
            settings = await this.prisma.appSettings.findUnique({ where: { id: 'global' } });
        }
        catch { }
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
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map