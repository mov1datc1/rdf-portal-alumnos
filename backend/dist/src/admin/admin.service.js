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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const zoom_service_1 = require("../zoom/zoom.service");
const supabase_js_1 = require("@supabase/supabase-js");
let AdminService = class AdminService {
    prisma;
    zoomService;
    supabase;
    constructor(prisma, zoomService) {
        this.prisma = prisma;
        this.zoomService = zoomService;
        this.supabase = (0, supabase_js_1.createClient)(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    }
    async getUsers() {
        return this.prisma.user.findMany({
            select: {
                id: true, email: true, firstName: true, lastName: true, phone: true,
                role: true, isActive: true, currentLevelId: true, createdAt: true,
                currentLevel: {
                    select: {
                        id: true,
                        name: true,
                        levelCode: true,
                        schedule: true,
                        modality: true,
                        zoomLink: true,
                        zoomHostGroup: { select: { permanentLink: true, displayName: true } },
                        teacher: { select: { firstName: true, lastName: true, email: true } },
                    }
                },
                _count: {
                    select: {
                        attendances: true,
                        evaluations: true,
                    }
                }
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
    async createUser(data) {
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
            throw new common_1.HttpException(authError.message, common_1.HttpStatus.BAD_REQUEST);
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
    async updateUser(id, data) {
        const updateData = {};
        if (data.firstName !== undefined)
            updateData.firstName = data.firstName;
        if (data.lastName !== undefined)
            updateData.lastName = data.lastName;
        if (data.phone !== undefined)
            updateData.phone = data.phone;
        if (data.role !== undefined)
            updateData.role = data.role;
        if (data.isActive !== undefined)
            updateData.isActive = data.isActive;
        if (data.currentLevelId !== undefined)
            updateData.currentLevelId = data.currentLevelId || null;
        if (data.role !== undefined || data.firstName !== undefined || data.lastName !== undefined) {
            const user_metadata = {};
            if (data.role !== undefined)
                user_metadata.role = data.role;
            if (data.firstName !== undefined)
                user_metadata.firstName = data.firstName;
            if (data.lastName !== undefined)
                user_metadata.lastName = data.lastName;
            const { error } = await this.supabase.auth.admin.updateUserById(id, { user_metadata });
            if (error) {
                console.error('Error actualizando metadata en Supabase:', error);
            }
        }
        return this.prisma.user.update({ where: { id }, data: updateData });
    }
    async resetPassword(userId, newPassword) {
        if (!newPassword || newPassword.length < 6) {
            throw new common_1.HttpException('La contraseña debe tener al menos 6 caracteres', common_1.HttpStatus.BAD_REQUEST);
        }
        const { error } = await this.supabase.auth.admin.updateUserById(userId, {
            password: newPassword,
        });
        if (error) {
            throw new common_1.HttpException(`Error al resetear contraseña: ${error.message}`, common_1.HttpStatus.BAD_REQUEST);
        }
        return { success: true, message: 'Contraseña actualizada exitosamente' };
    }
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
    async deleteResource(id) {
        return this.prisma.resource.delete({ where: { id } });
    }
    async batchDeleteResources(ids) {
        if (!ids || ids.length === 0)
            return { count: 0 };
        await this.prisma.attendance.deleteMany({ where: { resourceId: { in: ids } } });
        await this.prisma.userProgress.deleteMany({ where: { resourceId: { in: ids } } });
        return this.prisma.resource.deleteMany({
            where: {
                id: { in: ids }
            }
        });
    }
    async updateResource(id, data) {
        return this.prisma.resource.update({
            where: { id },
            data: {
                title: data.title,
                url: data.url
            }
        });
    }
    async createResource(data) {
        let moduleIds = [];
        if (data.moduleIds && Array.isArray(data.moduleIds) && data.moduleIds.length > 0) {
            moduleIds = data.moduleIds;
        }
        else if (data.levelIds && Array.isArray(data.levelIds) && data.levelIds.length > 0) {
            for (const levelId of data.levelIds) {
                let mod = await this.prisma.module.findFirst({ where: { levelId }, orderBy: { orderIndex: 'asc' } });
                if (!mod) {
                    mod = await this.prisma.module.create({
                        data: { levelId, title: 'Unidad 1', orderIndex: 1 }
                    });
                }
                moduleIds.push(mod.id);
            }
        }
        else if (data.levelId) {
            let mod = await this.prisma.module.findFirst({ where: { levelId: data.levelId }, orderBy: { orderIndex: 'asc' } });
            if (!mod) {
                mod = await this.prisma.module.create({
                    data: { levelId: data.levelId, title: 'Unidad 1', orderIndex: 1 }
                });
            }
            moduleIds.push(mod.id);
        }
        else if (data.moduleId) {
            moduleIds.push(data.moduleId);
        }
        if (moduleIds.length === 0) {
            throw new common_1.HttpException('No se especificó ningún grupo o módulo válido', common_1.HttpStatus.BAD_REQUEST);
        }
        const created = await Promise.all(moduleIds.map((modId) => this.prisma.resource.create({
            data: {
                title: data.title,
                url: data.url,
                type: data.type || 'RECORDED_VIDEO',
                moduleId: modId,
                durationExpected: data.durationExpected || 0,
            }
        })));
        return { success: true, count: created.length };
    }
    async getLevelsWithModules() {
        return this.prisma.level.findMany({
            include: {
                modules: { orderBy: { orderIndex: 'asc' } },
                teacher: { select: { id: true, firstName: true, lastName: true, email: true } },
                zoomHostGroup: { select: { id: true, displayName: true, email: true, permanentLink: true } },
                users: {
                    select: {
                        id: true, email: true, firstName: true, lastName: true, phone: true,
                        role: true, isActive: true, createdAt: true,
                    },
                    orderBy: { firstName: 'asc' },
                },
                _count: { select: { users: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async createLevel(data) {
        const level = await this.prisma.level.create({
            data: {
                name: data.name,
                levelCode: data.levelCode || 'Basico1',
                modality: data.modality || 'GROUP',
                rhythm: data.rhythm || null,
                schedule: data.schedule || null,
                startDate: data.startDate ? new Date(data.startDate) : null,
                maxStudents: data.maxStudents || 8,
                zoomLink: data.zoomLink || null,
                zoomHostId: data.zoomHostId || null,
                teacherId: data.teacherId || null,
                totalScoreTarget: 100,
            }
        });
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
        }
        else {
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
    async updateLevel(id, data) {
        const updateData = {};
        if (data.name !== undefined)
            updateData.name = data.name;
        if (data.levelCode !== undefined)
            updateData.levelCode = data.levelCode;
        if (data.modality !== undefined)
            updateData.modality = data.modality;
        if (data.rhythm !== undefined)
            updateData.rhythm = data.rhythm;
        if (data.schedule !== undefined)
            updateData.schedule = data.schedule;
        if (data.startDate !== undefined)
            updateData.startDate = data.startDate ? new Date(data.startDate) : null;
        if (data.maxStudents !== undefined)
            updateData.maxStudents = data.maxStudents;
        if (data.zoomLink !== undefined)
            updateData.zoomLink = data.zoomLink;
        if (data.zoomHostId !== undefined)
            updateData.zoomHostId = data.zoomHostId || null;
        if (data.teacherId !== undefined)
            updateData.teacherId = data.teacherId || null;
        return this.prisma.level.update({ where: { id }, data: updateData });
    }
    async deleteLevel(id) {
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
    async validateTeacherAvailability(teacherId, scheduledStart, scheduledEnd, excludeClassId) {
        if (!teacherId)
            return;
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
            if (!cls.scheduledAt)
                continue;
            const actualTeacherId = cls.teacherId || cls.module?.level?.teacherId;
            if (actualTeacherId !== teacherId)
                continue;
            const clsStart = new Date(cls.scheduledAt);
            const clsEnd = new Date(clsStart.getTime() + (cls.durationExpected || 3600) * 1000);
            if (scheduledStart < clsEnd && scheduledEnd > clsStart) {
                const allTeachers = await this.prisma.user.findMany({ where: { role: 'TEACHER' } });
                const allClasses = await this.prisma.resource.findMany({
                    where: { type: 'LIVE_CLASS', scheduledAt: { not: null } },
                    include: { module: { include: { level: true } } }
                });
                const availableTeachers = allTeachers.filter(t => {
                    return !allClasses.some(c => {
                        const cTid = c.teacherId || c.module?.level?.teacherId;
                        if (cTid !== t.id)
                            return false;
                        const cStart = new Date(c.scheduledAt);
                        const cEnd = new Date(cStart.getTime() + (c.durationExpected || 3600) * 1000);
                        return scheduledStart < cEnd && scheduledEnd > cStart;
                    });
                });
                const availNames = availableTeachers.map(t => `${t.firstName} ${t.lastName}`).join(', ');
                throw new common_1.HttpException(`El profesor ya tiene una clase programada en ese horario.\nProfesores disponibles: ${availNames || 'Ninguno'}`, common_1.HttpStatus.BAD_REQUEST);
            }
        }
    }
    async validateZoomAvailability(zoomHostId, scheduledStart, scheduledEnd, excludeClassId) {
        if (!zoomHostId)
            return;
        const overlappingClasses = await this.prisma.resource.findMany({
            where: {
                type: 'LIVE_CLASS',
                id: excludeClassId ? { not: excludeClassId } : undefined,
                OR: [
                    { zoomHostId: zoomHostId },
                    { module: { level: { zoomHostId: zoomHostId } } }
                ]
            },
            include: { module: { include: { level: true } }, zoomHost: true }
        });
        for (const cls of overlappingClasses) {
            if (!cls.scheduledAt)
                continue;
            const actualZoomHostId = cls.zoomHostId || cls.module?.level?.zoomHostId;
            if (actualZoomHostId !== zoomHostId)
                continue;
            const clsStart = new Date(cls.scheduledAt);
            const clsEnd = new Date(clsStart.getTime() + (cls.durationExpected || 3600) * 1000);
            if (scheduledStart < clsEnd && scheduledEnd > clsStart) {
                const hostName = cls.zoomHost?.displayName || 'esta cuenta de Zoom';
                throw new common_1.HttpException(`Esa cuenta de Zoom (${hostName}) ya está ocupada en ese mismo horario por otra clase (${cls.title}). No se pueden cruzar.`, common_1.HttpStatus.BAD_REQUEST);
            }
        }
    }
    async batchScheduleClasses(data) {
        const { levelId, classes, durationExpected = 3600 } = data;
        if (!levelId || !classes || !Array.isArray(classes) || classes.length === 0) {
            throw new common_1.HttpException('Debes proporcionar un grupo y al menos una fecha de clase.', common_1.HttpStatus.BAD_REQUEST);
        }
        const level = await this.prisma.level.findUnique({
            where: { id: levelId },
            include: { zoomHostGroup: true }
        });
        if (!level) {
            throw new common_1.HttpException('El grupo especificado no existe.', common_1.HttpStatus.NOT_FOUND);
        }
        const zoomJoinUrl = data.url || level.zoomLink || level.zoomHostGroup?.permanentLink || null;
        const zoomHostId = data.zoomHostId || level.zoomHostId || null;
        const teacherId = data.teacherId || level.teacherId || null;
        let defaultModuleId = data.moduleId;
        if (!defaultModuleId) {
            const existingModule = await this.prisma.module.findFirst({
                where: { levelId },
                orderBy: { orderIndex: 'asc' }
            });
            if (existingModule) {
                defaultModuleId = existingModule.id;
            }
            else {
                const count = await this.prisma.module.count({ where: { levelId } });
                const newModule = await this.prisma.module.create({
                    data: {
                        levelId,
                        title: data.moduleName || `Unidad 1`,
                        orderIndex: count + 1
                    }
                });
                defaultModuleId = newModule.id;
            }
        }
        const validDates = classes.map((c) => new Date(c.scheduledAt).getTime()).filter((t) => !isNaN(t));
        if (validDates.length > 0) {
            const minStart = new Date(Math.min(...validDates));
            const maxEnd = new Date(Math.max(...validDates) + Number(durationExpected) * 1000);
            const existingClasses = await this.prisma.resource.findMany({
                where: {
                    type: 'LIVE_CLASS',
                    scheduledAt: { gte: new Date(minStart.getTime() - 86400000), lte: maxEnd },
                    OR: [
                        ...(zoomHostId ? [{ zoomHostId }, { module: { level: { zoomHostId } } }] : []),
                        ...(teacherId ? [{ teacherId }, { module: { level: { teacherId } } }] : [])
                    ]
                },
                include: { module: { include: { level: true } }, zoomHost: true, teacher: true }
            });
            for (const item of classes) {
                if (!item.scheduledAt)
                    continue;
                const scheduledStart = new Date(item.scheduledAt);
                const scheduledEnd = new Date(scheduledStart.getTime() + Number(durationExpected) * 1000);
                for (const cls of existingClasses) {
                    if (!cls.scheduledAt)
                        continue;
                    const clsStart = new Date(cls.scheduledAt);
                    const clsEnd = new Date(clsStart.getTime() + (cls.durationExpected || 3600) * 1000);
                    if (scheduledStart < clsEnd && scheduledEnd > clsStart) {
                        const actualZoomHostId = cls.zoomHostId || cls.module?.level?.zoomHostId;
                        if (zoomHostId && actualZoomHostId === zoomHostId) {
                            const hostName = cls.zoomHost?.displayName || 'esta sala de Zoom';
                            const clashDate = scheduledStart.toLocaleDateString('es-ES', { weekday: 'short', day: '2-digit', month: 'short' });
                            throw new common_1.HttpException(`El día ${clashDate} la cuenta de Zoom (${hostName}) ya está ocupada por otra clase (${cls.title}). Excluye esa fecha o cambia el horario/Zoom.`, common_1.HttpStatus.BAD_REQUEST);
                        }
                        const actualTeacherId = cls.teacherId || cls.module?.level?.teacherId;
                        if (teacherId && actualTeacherId === teacherId) {
                            const teacherName = cls.teacher ? `${cls.teacher.firstName} ${cls.teacher.lastName}` : 'el profesor';
                            const clashDate = scheduledStart.toLocaleDateString('es-ES', { weekday: 'short', day: '2-digit', month: 'short' });
                            throw new common_1.HttpException(`El día ${clashDate} el profesor (${teacherName}) ya tiene una clase asignada (${cls.title}). Excluye esa fecha o cambia de profesor.`, common_1.HttpStatus.BAD_REQUEST);
                        }
                    }
                }
            }
        }
        const resourcesToInsert = [];
        const moduleCache = {};
        for (const item of classes) {
            if (!item.scheduledAt)
                continue;
            let itemModuleId = defaultModuleId;
            if (item.moduleName && item.moduleName !== data.moduleName) {
                if (!moduleCache[item.moduleName]) {
                    let mod = await this.prisma.module.findFirst({
                        where: { levelId, title: item.moduleName }
                    });
                    if (!mod) {
                        const count = await this.prisma.module.count({ where: { levelId } });
                        mod = await this.prisma.module.create({
                            data: {
                                levelId,
                                title: item.moduleName,
                                orderIndex: count + 1
                            }
                        });
                    }
                    moduleCache[item.moduleName] = mod.id;
                }
                itemModuleId = moduleCache[item.moduleName];
            }
            const scheduledStart = new Date(item.scheduledAt);
            resourcesToInsert.push({
                title: item.title,
                url: item.url || zoomJoinUrl,
                type: 'LIVE_CLASS',
                moduleId: itemModuleId,
                teacherId: teacherId || null,
                scheduledAt: scheduledStart,
                durationExpected: Number(durationExpected),
                zoomHostId: zoomHostId || null,
            });
        }
        await this.prisma.resource.createMany({
            data: resourcesToInsert,
        });
        return {
            success: true,
            count: resourcesToInsert.length,
        };
    }
    async scheduleClass(data) {
        let zoomMeetingId = null;
        let zoomJoinUrl = data.url || null;
        let zoomHostId = data.zoomHostId || null;
        if (data.levelId && (!zoomHostId || !zoomJoinUrl)) {
            const level = await this.prisma.level.findUnique({
                where: { id: data.levelId },
                include: { zoomHostGroup: true }
            });
            if (!zoomHostId && level?.zoomHostId) {
                zoomHostId = level.zoomHostId;
            }
            if (!zoomJoinUrl) {
                zoomJoinUrl = level?.zoomLink || level?.zoomHostGroup?.permanentLink || null;
            }
        }
        if (zoomHostId && this.zoomService) {
            try {
                const durationMinutes = Math.round((data.durationExpected || 3600) / 60);
                const result = await this.zoomService.createMeeting(zoomHostId, data.title, new Date(data.scheduledAt), durationMinutes);
                if (result?.meetingId)
                    zoomMeetingId = result.meetingId;
                if (result?.joinUrl)
                    zoomJoinUrl = result.joinUrl;
            }
            catch (err) {
                console.error('Zoom meeting creation failed, falling back:', err?.message || err);
            }
        }
        let moduleId = data.moduleId;
        if (!moduleId && data.levelId) {
            const existingModule = await this.prisma.module.findFirst({
                where: { levelId: data.levelId },
                orderBy: { orderIndex: 'asc' }
            });
            if (existingModule) {
                moduleId = existingModule.id;
            }
            else {
                const count = await this.prisma.module.count({ where: { levelId: data.levelId } });
                const newModule = await this.prisma.module.create({
                    data: {
                        levelId: data.levelId,
                        title: data.moduleName || `Unidad ${count + 1}`,
                        orderIndex: count + 1
                    }
                });
                moduleId = newModule.id;
            }
        }
        else if (data.moduleName && data.levelId) {
            const existingModule = await this.prisma.module.findFirst({
                where: { levelId: data.levelId, title: data.moduleName }
            });
            if (existingModule) {
                moduleId = existingModule.id;
            }
            else {
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
        if (!moduleId) {
            throw new common_1.HttpException('No se encontró ni se pudo crear un módulo para la clase', common_1.HttpStatus.BAD_REQUEST);
        }
        let teacherId = data.teacherId;
        if (!teacherId && data.levelId) {
            const level = await this.prisma.level.findUnique({ where: { id: data.levelId } });
            if (level?.teacherId)
                teacherId = level.teacherId;
        }
        const scheduledStart = new Date(data.scheduledAt);
        const scheduledEnd = new Date(scheduledStart.getTime() + (data.durationExpected || 3600) * 1000);
        if (teacherId) {
            await this.validateTeacherAvailability(teacherId, scheduledStart, scheduledEnd);
        }
        if (zoomHostId) {
            await this.validateZoomAvailability(zoomHostId, scheduledStart, scheduledEnd);
        }
        return this.prisma.resource.create({
            data: {
                title: data.title,
                url: zoomJoinUrl,
                type: 'LIVE_CLASS',
                moduleId: moduleId,
                teacherId: teacherId || null,
                scheduledAt: scheduledStart,
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
                    include: {
                        level: {
                            include: {
                                zoomHostGroup: true,
                                users: {
                                    select: { id: true, firstName: true, lastName: true, email: true, phone: true }
                                }
                            }
                        }
                    }
                },
                zoomHost: { select: { id: true, displayName: true, email: true } },
                teacher: { select: { id: true, firstName: true, lastName: true } },
            },
            orderBy: { scheduledAt: 'desc' }
        });
    }
    async deleteScheduledClass(id) {
        const resource = await this.prisma.resource.findUnique({ where: { id } });
        if (resource?.zoomMeetingId && resource?.zoomHostId && this.zoomService) {
            this.zoomService.deleteMeeting(resource.zoomHostId, resource.zoomMeetingId).catch(err => {
                console.warn('Background Zoom meeting deletion error:', err?.message || err);
            });
        }
        await this.prisma.attendance.deleteMany({ where: { resourceId: id } });
        await this.prisma.userProgress.deleteMany({ where: { resourceId: id } });
        return this.prisma.resource.delete({ where: { id } });
    }
    async batchDeleteScheduledClasses(ids) {
        if (!ids || ids.length === 0)
            return { count: 0 };
        await this.prisma.attendance.deleteMany({ where: { resourceId: { in: ids } } });
        await this.prisma.userProgress.deleteMany({ where: { resourceId: { in: ids } } });
        const result = await this.prisma.resource.deleteMany({ where: { id: { in: ids } } });
        return { count: result.count };
    }
    async updateScheduledClass(id, data) {
        const currentClass = await this.prisma.resource.findUnique({ where: { id }, include: { module: { include: { level: true } } } });
        if (!currentClass)
            throw new Error('Clase no encontrada');
        const teacherId = data.teacherId !== undefined ? data.teacherId : (currentClass.teacherId || currentClass.module?.level?.teacherId);
        const zoomHostId = data.zoomHostId !== undefined ? data.zoomHostId : (currentClass.zoomHostId || currentClass.module?.level?.zoomHostId);
        const scheduledStart = data.scheduledAt ? new Date(data.scheduledAt) : (currentClass.scheduledAt ? new Date(currentClass.scheduledAt) : new Date());
        const duration = data.durationExpected || currentClass.durationExpected || 3600;
        const scheduledEnd = new Date(scheduledStart.getTime() + duration * 1000);
        if (teacherId) {
            await this.validateTeacherAvailability(teacherId, scheduledStart, scheduledEnd, id);
        }
        if (zoomHostId) {
            await this.validateZoomAvailability(zoomHostId, scheduledStart, scheduledEnd, id);
        }
        return this.prisma.resource.update({
            where: { id },
            data: {
                title: data.title,
                description: data.description !== undefined ? data.description : undefined,
                url: data.url,
                moduleId: data.moduleId,
                scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : undefined,
                teacherId: data.teacherId !== undefined ? data.teacherId : undefined,
                zoomHostId: data.zoomHostId !== undefined ? data.zoomHostId : undefined,
            }
        });
    }
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
    async createEvaluation(data) {
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
                evaluatedById: data.evaluatedById || null,
                notes: data.notes || null,
            }
        });
    }
    async getSettings() {
        let settings = await this.prisma.appSettings.findUnique({ where: { id: 'global' } });
        if (!settings) {
            settings = await this.prisma.appSettings.create({
                data: {
                    id: 'global',
                    schoolName: 'Les Rois du Français',
                    googleAdsBudget: 10000,
                    metaAdsBudget: 3000,
                    heroSlides: DEFAULT_HERO_SLIDES,
                    teachers: DEFAULT_TEACHERS,
                    levelsData: DEFAULT_LEVELS,
                }
            });
        }
        else {
            let updated = false;
            const updateData = {};
            if (!settings.heroSlides) {
                updateData.heroSlides = DEFAULT_HERO_SLIDES;
                settings.heroSlides = DEFAULT_HERO_SLIDES;
                updated = true;
            }
            if (!settings.teachers) {
                updateData.teachers = DEFAULT_TEACHERS;
                settings.teachers = DEFAULT_TEACHERS;
                updated = true;
            }
            if (!settings.levelsData) {
                updateData.levelsData = DEFAULT_LEVELS;
                settings.levelsData = DEFAULT_LEVELS;
                updated = true;
            }
            if (updated) {
                await this.prisma.appSettings.update({
                    where: { id: 'global' },
                    data: updateData
                });
            }
        }
        return settings;
    }
    async updateSettings(data) {
        return this.prisma.appSettings.upsert({
            where: { id: 'global' },
            update: data,
            create: { id: 'global', ...data },
        });
    }
    async uploadImage(filename, base64Data) {
        const fs = require('fs');
        const path = require('path');
        if (!base64Data) {
            throw new common_1.HttpException('No se proporcionaron datos de imagen', common_1.HttpStatus.BAD_REQUEST);
        }
        const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        const buffer = matches ? Buffer.from(matches[2], 'base64') : Buffer.from(base64Data, 'base64');
        const ext = path.extname(filename || '') || '.webp';
        const base = path.basename(filename || 'image', ext).replace(/[^a-zA-Z0-9_-]/g, '_');
        const safeFilename = `upload_${Date.now()}_${base}${ext}`;
        const uploadsDir = path.resolve(process.cwd(), '../frontend/public/imagenes-lp/uploads');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }
        const fullPath = path.join(uploadsDir, safeFilename);
        fs.writeFileSync(fullPath, buffer);
        return {
            url: `/imagenes-lp/uploads/${safeFilename}`,
            filename: safeFilename
        };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Optional)()),
    __param(1, (0, common_1.Inject)(zoom_service_1.ZoomService)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        zoom_service_1.ZoomService])
], AdminService);
const DEFAULT_HERO_SLIDES = [
    { id: 'slide-1', src: '/imagenes-lp/rey.webp', alt: 'Rey Oficial Les Rois du Français', active: true },
    { id: 'slide-2', src: '/imagenes-lp/hero_slide_1.webp', alt: 'Reina con Corona Les Rois du Français', active: true },
    { id: 'slide-3', src: '/imagenes-lp/hero_slide_2.webp', alt: 'Estudiante con Celular Les Rois du Français', active: true },
    { id: 'slide-4', src: '/imagenes-lp/hero_slide_3.webp', alt: 'Comunidad Les Rois du Français', active: true }
];
const DEFAULT_TEACHERS = [
    {
        id: 'jean-luc',
        name: 'Jean-Luc',
        role: 'Le Roi du Fun & Conversación',
        city: 'París, Francia',
        exp: '8 años de experiencia',
        image: '/imagenes-lp/teacher_royal_jean_luc.webp',
        badge: 'Actitud Royal',
        hashtag: '#ReyDelFrancés',
        quote: '¡Bonjour! Mi misión es que hables francés con total confianza, soltura y cero miedo a equivocarte.',
        bullets: ['100% Hablante Nativo de París', 'Especialista en Metodología MRAF® y Fluidez', 'Clases interactivas en vivo con grupos máx. 8']
    },
    {
        id: 'sophie',
        name: 'Sophie',
        role: 'La Reine de la Culture & Estilo',
        city: 'Lyon, Francia',
        exp: '6 años de experiencia',
        image: '/imagenes-lp/teacher_royal_sophie.webp',
        badge: 'Cero Aburrimiento',
        hashtag: '#FrancésDivertido',
        quote: '¡C\'est la vie! Aprenderás el francés de verdad, el que se habla en las calles y cafés de Francia con elegancia.',
        bullets: ['Nativa de Lyon, Francia', 'Rotación de acentos y cultura francófona viva', 'Práctica comunicativa para viajes y vida diaria']
    },
    {
        id: 'pierre',
        name: 'Pierre',
        role: 'El Gran Canciller del Francés',
        city: 'Burdeos, Francia',
        exp: '10 años de experiencia',
        image: '/imagenes-lp/teacher_royal_pierre.webp',
        badge: 'Savoir-Faire Royal',
        hashtag: '#AprendeComoRey',
        quote: '¡Le français, c\'est cool! Olvídate de las clases tradicionales y aburridas. Tu coronación en francés empieza aquí.',
        bullets: ['Evaluador de Exámenes Escritos y Orales', 'Dominio del idioma sin estrés ni tecnicismos', 'Puntualidad y atención 100% personalizada']
    }
];
const DEFAULT_LEVELS = {
    A1: {
        code: 'A1',
        sub: 'Básico 1',
        subLabel: 'Básico 1',
        levelTag: 'Básico 1 – Fundamentos • 4 Meses',
        titleLine1: 'Fundamentos del francés.',
        titleLine2: '¡Empieza a hablar!',
        desc: 'En este nivel, los estudiantes se introducen en los fundamentos del francés. Aprenden el alfabeto, la pronunciación básica, la familia, la hora, la descripción física y las frases esenciales para la comunicación diaria. El objetivo principal es desarrollar la capacidad de comprender y usar expresiones cotidianas y frases sencillas para satisfacer necesidades inmediatas. Los alumnos empiezan a formar oraciones simples y a familiarizarse con la gramática elemental.',
        bullets: [
            { icon: 'chat', text: 'Presentación personal, saludos y situaciones cotidianas' },
            { icon: 'trophy', text: 'Desarrollo de las 4 competencias: habla, escucha, lectura y escritura' },
            { icon: 'book', text: '4 unidades (~1 mes c/u) con libro de actividades 100% gratis' },
            { icon: 'people', text: 'Examen escrito y oral al finalizar con certificación oficial' }
        ],
        characterImage: '/imagenes-lp/level_char_a1.webp',
        characterAlt: 'Alumna aprendiendo fundamentos de francés con libros y laptop - Nivel A1'
    },
    A2: {
        code: 'A2',
        sub: 'Básico 2',
        subLabel: 'Básico 2',
        levelTag: 'Básico 2 – Supervivencia y Rutina • 4 Meses',
        titleLine1: 'Profundiza tu comunicación.',
        titleLine2: '¡Conéctate con Francia!',
        desc: 'El nivel Básico 2 profundiza en los conocimientos adquiridos previamente. Los estudiantes amplían su vocabulario y mejoran su capacidad de comunicación en situaciones más variadas. Se enfocan en construir oraciones más complejas en presente y pasado y en comprender conversaciones sencillas. Este nivel refuerza la comprensión auditiva y la expresión oral, permitiendo a los alumnos interactuar en contextos cotidianos con mayor confianza.',
        bullets: [
            { icon: 'chat', text: 'Conversación sobre rutina diaria, compras, viajes y entorno' },
            { icon: 'people', text: 'Clases en vivo por Zoom con grupos reducidos (máx. 8 alumnos)' },
            { icon: 'trophy', text: 'Rotación con profesores nativos de distintas regiones de Francia' },
            { icon: 'book', text: '4 unidades temáticas, evaluación oral y escrita con certificado' }
        ],
        characterImage: '/imagenes-lp/level_char_a2.webp',
        characterAlt: 'Alumno practicando rutina y comunicación en francés - Nivel A2'
    },
    'A2+': {
        code: 'A2+',
        sub: 'Intermedio 1',
        subLabel: 'Intermedio 1',
        levelTag: 'Intermedio 1 – Exploración y Fluidez • 4 Meses',
        titleLine1: 'Explora temas complejos.',
        titleLine2: '¡Gana fluidez y precisión!',
        desc: 'En el nivel Intermedio 1, los estudiantes ya tienen una base sólida y empiezan a explorar temas más complejos. Se trabaja intensamente en la gramática y en la ampliación del vocabulario (los pasatiempos, los deportes, ir al médico, invitar a alguien a salir...). Los alumnos aprenden a expresarse con mayor fluidez y precisión, pudiendo hablar sobre experiencias personales, describir eventos y expresar opiniones en presente, pasado y futuro. La comprensión de textos escritos más largos y complejos también es un objetivo clave en este nivel.',
        bullets: [
            { icon: 'chat', text: 'Autonomía para viajar y desenvolverte en países francófonos' },
            { icon: 'people', text: 'Expresión fluida de opiniones, ambiciones, proyectos y relatos' },
            { icon: 'book', text: '4 unidades de estudio práctico con material pedagógico gratuito' },
            { icon: 'trophy', text: 'Acreditación oficial mediante examen oral y escrito final' }
        ],
        characterImage: '/imagenes-lp/level_char_a2_plus.webp',
        characterAlt: 'Alumna con corona ganando fluidez y soltura en francés - Nivel A2+'
    },
    B1: {
        code: 'B1',
        sub: 'Intermedio 2',
        subLabel: 'Intermedio 2',
        levelTag: 'Intermedio 2 – Consolidación y Debate • 4 Meses',
        titleLine1: 'Consolida tu autonomía.',
        titleLine2: '¡Debate y exprésate!',
        desc: 'Este nivel está diseñado para consolidar y expandir las habilidades intermedias. Los estudiantes trabajan en la comprensión y producción de textos más detallados y en la participación en conversaciones más fluidas. Se enfoca en el desarrollo de habilidades para debatir temas abstractos y complejos (vocabulario del trabajo, describir una historia en pasado...), así como en la mejora de la pronunciación y la entonación. Los alumnos también se familiarizan con expresiones idiomáticas y el lenguaje formal e informal.',
        bullets: [
            { icon: 'chat', text: 'Conversaciones espontáneas en contextos laborales y sociales' },
            { icon: 'trophy', text: 'Dominio de estructuras complejas con método MRAF® sin rodeos' },
            { icon: 'people', text: 'Inmersión cultural con múltiples acentos regionales franceses' },
            { icon: 'book', text: 'Certificado de nivel intermedio y pase directo a nivel Avanzado' }
        ],
        characterImage: '/imagenes-lp/level_char_b1.webp',
        characterAlt: 'Alumno con corona debatiendo y consolidando su francés - Nivel B1'
    },
    'B1+': {
        code: 'B1+',
        sub: 'Avanzado 1',
        subLabel: 'Avanzado 1',
        levelTag: 'Avanzado 1 – Argumentación y Dominio • 4 Meses',
        titleLine1: 'Argumenta con claridad.',
        titleLine2: '¡Comunica con soltura!',
        desc: 'En el nivel Avanzado 1, los estudiantes alcanzan un alto grado de competencia en el idioma. Son capaces de comprender y producir textos detallados y bien estructurados sobre temas complejos. Se les enseña a argumentar con claridad y coherencia, utilizando una variedad de estructuras gramaticales y vocabulario avanzado. La interacción en discusiones formales e informales se convierte en una parte esencial del aprendizaje.',
        bullets: [
            { icon: 'chat', text: 'Debates sobre temas complejos, culturales, profesionales y abstractos' },
            { icon: 'people', text: 'Comprensión auditiva completa de nativos y modismos cotidianos' },
            { icon: 'book', text: '4 unidades avanzadas con dinámicas interactivas y roleplays' },
            { icon: 'trophy', text: 'Examen oral y escrito riguroso con certificado avalado' }
        ],
        characterImage: '/imagenes-lp/level_char_b1_plus.webp',
        characterAlt: 'Profesor entusiasta con bandana y guiño royal - Nivel B1+'
    },
    B2: {
        code: 'B2',
        sub: 'Avanzado 2',
        subLabel: 'Avanzado 2',
        levelTag: 'Avanzado 2 – Perfeccionamiento y Certificación • 4 Meses',
        titleLine1: 'Fluidez y precisión nativa.',
        titleLine2: '¡Sé un verdadero rey!',
        desc: 'El nivel Avanzado 2 es el más alto ofrecido por Les Rois du Français. Aquí, los estudiantes perfeccionan sus habilidades lingüísticas, alcanzando una fluidez y precisión casi nativas. Son capaces de comprender prácticamente todo lo que leen y escuchan, y pueden expresarse de manera espontánea, muy fluida y precisa, incluso en situaciones complejas. Este nivel también prepara a los estudiantes para exámenes de certificación avanzada y para el uso del francés en entornos profesionales y académicos.',
        bullets: [
            { icon: 'chat', text: 'Bilingüismo y precisión comunicativa equivalente a hablante nativo' },
            { icon: 'trophy', text: 'Certificación de máxima maestría y graduación oficial de la escuela' },
            { icon: 'people', text: 'Argumentación espontánea, negociación y expresión de alto nivel' },
            { icon: 'book', text: 'Maestría total de la lengua, modismos, cultura y humor francés' }
        ],
        characterImage: '/imagenes-lp/french_guy_pointing.webp',
        characterAlt: 'Profesor de francés en boina señalando la maestría total - Nivel B2'
    }
};
//# sourceMappingURL=admin.service.js.map