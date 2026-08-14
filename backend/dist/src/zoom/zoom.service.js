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
var ZoomService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZoomService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let ZoomService = ZoomService_1 = class ZoomService {
    prisma;
    logger = new common_1.Logger(ZoomService_1.name);
    tokenCache = new Map();
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAccessToken(host) {
        if (!host.accountId || !host.clientId || !host.clientSecret) {
            throw new common_1.HttpException('Este host de Zoom no tiene credenciales S2S configuradas', common_1.HttpStatus.BAD_REQUEST);
        }
        const cached = this.tokenCache.get(host.id);
        if (cached && cached.expiresAt > Date.now()) {
            return cached.token;
        }
        const credentials = Buffer.from(`${host.clientId}:${host.clientSecret}`).toString('base64');
        try {
            const response = await fetch('https://zoom.us/oauth/token', {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${credentials}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `grant_type=account_credentials&account_id=${host.accountId}`,
            });
            if (!response.ok) {
                const error = await response.text();
                this.logger.error(`Zoom OAuth failed for host ${host.id}: ${error}`);
                throw new common_1.HttpException(`Error al obtener token de Zoom: ${error}`, common_1.HttpStatus.BAD_GATEWAY);
            }
            const data = await response.json();
            this.tokenCache.set(host.id, {
                token: data.access_token,
                expiresAt: Date.now() + (55 * 60 * 1000),
            });
            return data.access_token;
        }
        catch (error) {
            if (error instanceof common_1.HttpException)
                throw error;
            this.logger.error(`Zoom OAuth network error: ${error.message}`);
            throw new common_1.HttpException('No se pudo conectar con Zoom', common_1.HttpStatus.BAD_GATEWAY);
        }
    }
    async createMeeting(hostId, topic, startTime, durationMinutes = 60) {
        const host = await this.prisma.zoomHost.findUnique({ where: { id: hostId } });
        if (!host)
            throw new common_1.HttpException('Zoom host no encontrado', common_1.HttpStatus.NOT_FOUND);
        if (!host.isActive)
            throw new common_1.HttpException('Este host de Zoom está desactivado', common_1.HttpStatus.BAD_REQUEST);
        if (!host.accountId || !host.clientId || !host.clientSecret) {
            if (host.permanentLink) {
                return { meetingId: null, joinUrl: host.permanentLink };
            }
            throw new common_1.HttpException('Este host de Zoom no tiene link permanente ni credenciales S2S', common_1.HttpStatus.BAD_REQUEST);
        }
        const token = await this.getAccessToken(host);
        const response = await fetch(`https://api.zoom.us/v2/users/${host.email}/meetings`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                topic,
                type: 2,
                start_time: startTime.toISOString(),
                duration: durationMinutes,
                timezone: 'America/Mexico_City',
                settings: {
                    join_before_host: true,
                    waiting_room: false,
                    auto_recording: 'cloud',
                    mute_upon_entry: true,
                },
            }),
        });
        if (!response.ok) {
            const error = await response.text();
            this.logger.error(`Zoom create meeting failed: ${error}`);
            throw new common_1.HttpException(`Error al crear reunión en Zoom: ${error}`, common_1.HttpStatus.BAD_GATEWAY);
        }
        const meeting = await response.json();
        return {
            meetingId: String(meeting.id),
            joinUrl: meeting.join_url,
        };
    }
    async deleteMeeting(hostId, meetingId) {
        const host = await this.prisma.zoomHost.findUnique({ where: { id: hostId } });
        if (!host)
            return;
        try {
            const token = await this.getAccessToken(host);
            const response = await fetch(`https://api.zoom.us/v2/meetings/${meetingId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (!response.ok && response.status !== 404) {
                this.logger.warn(`Failed to delete Zoom meeting ${meetingId}: ${response.statusText}`);
            }
        }
        catch (error) {
            this.logger.warn(`Could not delete Zoom meeting ${meetingId}: ${error.message}`);
        }
    }
    async getHosts() {
        return this.prisma.zoomHost.findMany({
            orderBy: { createdAt: 'asc' },
            select: {
                id: true,
                email: true,
                displayName: true,
                permanentLink: true,
                isActive: true,
                createdAt: true,
                accountId: true,
                assignedGroups: { select: { id: true, schedule: true } },
                meetings: { select: { scheduledAt: true, durationExpected: true }, where: { scheduledAt: { gte: new Date() } } },
                _count: { select: { meetings: true, assignedGroups: true } },
            },
        });
    }
    async getHostsWithPermanentLinks() {
        return this.prisma.zoomHost.findMany({
            where: { permanentLink: { not: null }, isActive: true },
            orderBy: { displayName: 'asc' },
            select: {
                id: true,
                email: true,
                displayName: true,
                permanentLink: true,
                assignedGroups: { select: { id: true, schedule: true } },
                meetings: { select: { scheduledAt: true, durationExpected: true }, where: { scheduledAt: { gte: new Date() } } },
                _count: { select: { assignedGroups: true } },
            },
        });
    }
    async createHost(data) {
        return this.prisma.zoomHost.create({
            data: {
                email: data.email,
                displayName: data.displayName,
                permanentLink: data.permanentLink || null,
                accountId: data.accountId || null,
                clientId: data.clientId || null,
                clientSecret: data.clientSecret || null,
            },
        });
    }
    async updateHost(id, data) {
        const updateData = {};
        if (data.email !== undefined)
            updateData.email = data.email;
        if (data.displayName !== undefined)
            updateData.displayName = data.displayName;
        if (data.permanentLink !== undefined)
            updateData.permanentLink = data.permanentLink || null;
        if (data.accountId !== undefined)
            updateData.accountId = data.accountId || null;
        if (data.clientId !== undefined)
            updateData.clientId = data.clientId || null;
        if (data.clientSecret !== undefined)
            updateData.clientSecret = data.clientSecret || null;
        if (data.isActive !== undefined)
            updateData.isActive = data.isActive;
        if (data.accountId || data.clientId || data.clientSecret) {
            this.tokenCache.delete(id);
        }
        return this.prisma.zoomHost.update({ where: { id }, data: updateData });
    }
    async deleteHost(id) {
        await this.prisma.resource.updateMany({
            where: { zoomHostId: id },
            data: { zoomHostId: null },
        });
        return this.prisma.zoomHost.delete({ where: { id } });
    }
    async testHost(id) {
        const host = await this.prisma.zoomHost.findUnique({ where: { id } });
        if (!host)
            throw new common_1.HttpException('Host no encontrado', common_1.HttpStatus.NOT_FOUND);
        if (!host.accountId || !host.clientId || !host.clientSecret) {
            return {
                success: !!host.permanentLink,
                message: host.permanentLink ? 'Link permanente configurado (sin API S2S)' : 'Sin link ni credenciales S2S',
            };
        }
        try {
            await this.getAccessToken(host);
            return { success: true, message: 'Conexión exitosa con Zoom API' };
        }
        catch (error) {
            return { success: false, message: error.message || 'Error de conexión' };
        }
    }
};
exports.ZoomService = ZoomService;
exports.ZoomService = ZoomService = ZoomService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ZoomService);
//# sourceMappingURL=zoom.service.js.map