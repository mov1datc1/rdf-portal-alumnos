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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const supabase_js_1 = require("@supabase/supabase-js");
let AdminService = class AdminService {
    prisma;
    supabase;
    constructor(prisma) {
        this.prisma = prisma;
        this.supabase = (0, supabase_js_1.createClient)(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
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
    async createUser(data) {
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
            throw new common_1.HttpException(authError.message, common_1.HttpStatus.BAD_REQUEST);
        }
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
    async updateUser(id, data) {
        return this.prisma.user.update({
            where: { id },
            data,
        });
    }
    async createResource(data) {
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
    async scheduleClass(data) {
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
    async deleteScheduledClass(id) {
        await this.prisma.userProgress.deleteMany({ where: { resourceId: id } });
        return this.prisma.resource.delete({ where: { id } });
    }
    async updateScheduledClass(id, data) {
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
    async createLevel(data) {
        const level = await this.prisma.level.create({
            data: {
                name: data.name,
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
    async updateLevel(id, data) {
        return this.prisma.level.update({
            where: { id },
            data: { name: data.name }
        });
    }
    async deleteLevel(id) {
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
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map