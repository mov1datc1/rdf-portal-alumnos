import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class LeadsService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    return this.prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getById(id: string) {
    return this.prisma.lead.findUnique({ where: { id } });
  }

  async create(data: any) {
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

  async update(id: string, data: any) {
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.source !== undefined) updateData.source = data.source;
    if (data.sourceDetail !== undefined) updateData.sourceDetail = data.sourceDetail;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.notes !== undefined) updateData.notes = data.notes;
    if (data.interestedIn !== undefined) updateData.interestedIn = data.interestedIn;
    if (data.assignedTo !== undefined) updateData.assignedTo = data.assignedTo;
    if (data.trialClassDate !== undefined) updateData.trialClassDate = data.trialClassDate ? new Date(data.trialClassDate) : null;
    if (data.convertedToUserId !== undefined) updateData.convertedToUserId = data.convertedToUserId;

    return this.prisma.lead.update({ where: { id }, data: updateData });
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.lead.update({
      where: { id },
      data: { status: status as any },
    });
  }

  async delete(id: string) {
    return this.prisma.lead.delete({ where: { id } });
  }

  /**
   * Analytics: leads grouped by source with counts and conversion rates.
   */
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

    // Get ad budgets from settings
    let settings: any = null;
    try {
      settings = await this.prisma.appSettings.findUnique({ where: { id: 'global' } });
    } catch { /* no settings yet */ }

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
}
