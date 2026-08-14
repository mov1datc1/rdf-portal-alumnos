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
    async getAttendanceSchedule(teacherId) {
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
            take: 100,
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
    async getGroupAttendanceAudit(levelId) {
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
    async getStudentAttendanceAudit(studentId) {
        const student = await this.prisma.user.findUnique({
            where: { id: studentId },
            include: {
                currentLevel: true
            }
        });
        if (!student || !student.currentLevelId) {
            throw new Error('Student not found or not in a group');
        }
        const pastClasses = await this.prisma.resource.findMany({
            where: {
                type: 'LIVE_CLASS',
                module: { levelId: student.currentLevelId },
                scheduledAt: { lte: new Date() }
            },
            orderBy: { scheduledAt: 'desc' },
            include: { module: true }
        });
        const attendances = await this.prisma.attendance.findMany({
            where: { userId: studentId }
        });
        const attendanceMap = new Map(attendances.map(a => [a.resourceId, a.attended]));
        return {
            student,
            audit: pastClasses.map(cls => ({
                class: cls,
                attended: attendanceMap.has(cls.id) ? attendanceMap.get(cls.id) : null
            }))
        };
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
    async createClassLog(teacherId, data) {
        const level = await this.prisma.level.findFirst({
            where: { id: data.levelId, teacherId: teacherId },
            include: { modules: { orderBy: { orderIndex: 'asc' }, take: 1 } },
        });
        if (!level)
            throw new Error('Grupo no encontrado o no autorizado');
        const moduleId = level.modules[0]?.id;
        if (!moduleId)
            throw new Error('El grupo no tiene módulos configurados para guardar la bitácora');
        return this.prisma.resource.create({
            data: {
                moduleId,
                type: 'LIVE_CLASS',
                title: data.title,
                description: data.description,
                scheduledAt: data.date ? new Date(data.date) : new Date(),
                durationExpected: 3600,
            },
            include: {
                module: { include: { level: true } }
            }
        });
    }
    async getClassLogs(teacherId) {
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
    async updateClassLog(teacherId, logId, data) {
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
    async deleteClassLog(teacherId, logId) {
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
            throw new common_1.NotFoundException('Bitácora no encontrada o no autorizada');
        }
        return this.prisma.resource.delete({
            where: { id: logId }
        });
    }
};
exports.TeacherService = TeacherService;
exports.TeacherService = TeacherService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TeacherService);
//# sourceMappingURL=teacher.service.js.map