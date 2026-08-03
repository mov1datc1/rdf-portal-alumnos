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
var LeadsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const supabase_js_1 = require("@supabase/supabase-js");
let LeadsService = LeadsService_1 = class LeadsService {
    prisma;
    logger = new common_1.Logger(LeadsService_1.name);
    supabase;
    constructor(prisma) {
        this.prisma = prisma;
        this.supabase = (0, supabase_js_1.createClient)(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    }
    async getAll() {
        return this.prisma.lead.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }
    async getById(id) {
        return this.prisma.lead.findUnique({ where: { id } });
    }
    async getEnrolledLeads() {
        return this.prisma.lead.findMany({
            where: { status: 'ENROLLED' },
            select: {
                id: true,
                name: true,
                phone: true,
                email: true,
                interestedIn: true,
                convertedToUserId: true,
            },
            orderBy: { name: 'asc' },
        });
    }
    async create(data) {
        return this.prisma.lead.create({
            data: {
                name: data.name,
                phone: data.phone,
                email: data.email || null,
                source: data.source || 'WHATSAPP_ORGANIC',
                sourceDetail: data.sourceDetail || null,
                status: 'NEW',
                notes: data.notes || null,
                interestedIn: data.interestedIn || null,
                assignedTo: data.assignedTo || null,
            },
        });
    }
    async update(id, data) {
        const updateData = {};
        if (data.name !== undefined)
            updateData.name = data.name;
        if (data.phone !== undefined)
            updateData.phone = data.phone;
        if (data.email !== undefined)
            updateData.email = data.email;
        if (data.source !== undefined)
            updateData.source = data.source;
        if (data.sourceDetail !== undefined)
            updateData.sourceDetail = data.sourceDetail;
        if (data.status !== undefined)
            updateData.status = data.status;
        if (data.notes !== undefined)
            updateData.notes = data.notes;
        if (data.interestedIn !== undefined)
            updateData.interestedIn = data.interestedIn;
        if (data.assignedTo !== undefined)
            updateData.assignedTo = data.assignedTo;
        if (data.trialClassDate !== undefined)
            updateData.trialClassDate = data.trialClassDate ? new Date(data.trialClassDate) : null;
        if (data.convertedToUserId !== undefined)
            updateData.convertedToUserId = data.convertedToUserId;
        return this.prisma.lead.update({ where: { id }, data: updateData });
    }
    async updateStatus(id, status) {
        const lead = await this.prisma.lead.findUnique({ where: { id } });
        if (!lead)
            throw new Error('Lead not found');
        if (status === 'ENROLLED' && lead.status !== 'ENROLLED' && !lead.convertedToUserId) {
            try {
                const userId = await this.convertLeadToUser(lead);
                return this.prisma.lead.update({
                    where: { id },
                    data: { status: status, convertedToUserId: userId },
                });
            }
            catch (error) {
                this.logger.error(`Failed to auto-create user for lead ${lead.name}: ${error.message}`);
            }
        }
        return this.prisma.lead.update({
            where: { id },
            data: { status: status },
        });
    }
    async convertLeadToUser(lead) {
        const email = lead.email || `${lead.phone.replace(/\D/g, '')}@lesroisdufrancais.temp`;
        const nameParts = lead.name.trim().split(/\s+/);
        const firstName = nameParts[0] || lead.name;
        const lastName = nameParts.slice(1).join(' ') || '';
        const existingUser = await this.prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            this.logger.log(`User already exists for ${email}, linking lead`);
            return existingUser.id;
        }
        const tempPassword = `LesRois${new Date().getFullYear()}!`;
        const { data: authData, error: authError } = await this.supabase.auth.admin.createUser({
            email,
            password: tempPassword,
            email_confirm: true,
            user_metadata: { firstName, lastName },
        });
        if (authError) {
            this.logger.error(`Supabase auth error for ${email}: ${authError.message}`);
            throw authError;
        }
        const user = await this.prisma.user.create({
            data: {
                id: authData.user.id,
                email,
                firstName,
                lastName,
                phone: lead.phone || null,
                role: 'STUDENT',
            },
        });
        this.logger.log(`✅ Auto-created student account: ${firstName} ${lastName} (${email})`);
        return user.id;
    }
    async delete(id) {
        return this.prisma.lead.delete({ where: { id } });
    }
    async getAnalytics() {
        const [total, bySource, byStatus, thisMonth, lastMonth] = await Promise.all([
            this.prisma.lead.count(),
            this.prisma.lead.groupBy({
                by: ['source'],
                _count: true,
            }),
            this.prisma.lead.groupBy({
                by: ['status'],
                _count: true,
            }),
            this.prisma.lead.count({
                where: {
                    createdAt: {
                        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                    },
                },
            }),
            this.prisma.lead.count({
                where: {
                    createdAt: {
                        gte: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
                        lt: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                    },
                },
            }),
        ]);
        const enrolled = byStatus.find(s => s.status === 'ENROLLED')?._count || 0;
        const conversionRate = total > 0 ? ((enrolled / total) * 100).toFixed(1) : '0';
        let settings = null;
        try {
            settings = await this.prisma.appSettings.findUnique({ where: { id: 'global' } });
        }
        catch { }
        const googleLeads = bySource.find(s => s.source === 'GOOGLE_ADS')?._count || 0;
        const metaLeads = bySource.find(s => s.source === 'META_ADS')?._count || 0;
        const googleBudget = settings?.googleAdsBudget || 10000;
        const metaBudget = settings?.metaAdsBudget || 3000;
        return {
            total,
            thisMonth,
            lastMonth,
            enrolled,
            conversionRate: `${conversionRate}%`,
            bySource: bySource.map(s => ({ source: s.source, count: s._count })),
            byStatus: byStatus.map(s => ({ status: s.status, count: s._count })),
            costPerLead: {
                google: googleLeads > 0 ? Math.round(googleBudget / googleLeads) : null,
                meta: metaLeads > 0 ? Math.round(metaBudget / metaLeads) : null,
                total: total > 0 ? Math.round((googleBudget + metaBudget) / total) : null,
            },
            adBudgets: { google: googleBudget, meta: metaBudget },
        };
    }
};
exports.LeadsService = LeadsService;
exports.LeadsService = LeadsService = LeadsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LeadsService);
//# sourceMappingURL=leads.service.js.map