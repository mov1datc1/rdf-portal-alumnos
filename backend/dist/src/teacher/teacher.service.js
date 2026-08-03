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
exports.TeacherService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let TeacherService = class TeacherService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getMyGroups(teacherId) {
        return this.prisma.level.findMany({
            where: { teacherId },
            include: {
                modules: { orderBy: { orderIndex: 'asc' } },
                _count: { select: { users: true } },
            },
            orderBy: { name: 'asc' },
        });
    }
    async getMyStudents(teacherId) {
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
    async getMySchedule(teacherId) {
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
    async getDashboard(teacherId) {
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
    async recordAttendance(data) {
        const results = [];
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
    async getAttendance(resourceId) {
        return this.prisma.attendance.findMany({
            where: { resourceId },
            include: {
                user: { select: { id: true, firstName: true, lastName: true } },
            },
        });
    }
    async createEvaluation(evaluatorId, data) {
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
    async getMyEvaluations(teacherId) {
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
};
exports.TeacherService = TeacherService;
exports.TeacherService = TeacherService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TeacherService);
//# sourceMappingURL=teacher.service.js.map