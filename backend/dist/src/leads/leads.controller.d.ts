import { LeadsService } from './leads.service';
export declare class LeadsController {
    private readonly leadsService;
    constructor(leadsService: LeadsService);
    getAll(): Promise<{
        id: string;
        email: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        phone: string;
        status: import("@prisma/client").$Enums.LeadStatus;
        notes: string | null;
        source: import("@prisma/client").$Enums.LeadSource;
        sourceDetail: string | null;
        interestedIn: string | null;
        assignedTo: string | null;
        convertedToUserId: string | null;
        trialClassDate: Date | null;
    }[]>;
    getEnrolledLeads(): Promise<{
        id: string;
        email: string | null;
        name: string;
        phone: string;
        interestedIn: string | null;
        convertedToUserId: string | null;
    }[]>;
    getAnalytics(): Promise<{
        total: number;
        thisMonth: number;
        lastMonth: number;
        enrolled: number;
        conversionRate: string;
        bySource: {
            source: import("@prisma/client").$Enums.LeadSource;
            count: number;
        }[];
        byStatus: {
            status: import("@prisma/client").$Enums.LeadStatus;
            count: number;
        }[];
        costPerLead: {
            google: number | null;
            meta: number | null;
            total: number | null;
        };
        adBudgets: {
            google: any;
            meta: any;
        };
    }>;
    getById(id: string): Promise<{
        id: string;
        email: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        phone: string;
        status: import("@prisma/client").$Enums.LeadStatus;
        notes: string | null;
        source: import("@prisma/client").$Enums.LeadSource;
        sourceDetail: string | null;
        interestedIn: string | null;
        assignedTo: string | null;
        convertedToUserId: string | null;
        trialClassDate: Date | null;
    } | null>;
    create(body: any): Promise<{
        id: string;
        email: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        phone: string;
        status: import("@prisma/client").$Enums.LeadStatus;
        notes: string | null;
        source: import("@prisma/client").$Enums.LeadSource;
        sourceDetail: string | null;
        interestedIn: string | null;
        assignedTo: string | null;
        convertedToUserId: string | null;
        trialClassDate: Date | null;
    }>;
    update(id: string, body: any): Promise<{
        id: string;
        email: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        phone: string;
        status: import("@prisma/client").$Enums.LeadStatus;
        notes: string | null;
        source: import("@prisma/client").$Enums.LeadSource;
        sourceDetail: string | null;
        interestedIn: string | null;
        assignedTo: string | null;
        convertedToUserId: string | null;
        trialClassDate: Date | null;
    }>;
    updateStatus(id: string, body: {
        status: string;
    }): Promise<{
        id: string;
        email: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        phone: string;
        status: import("@prisma/client").$Enums.LeadStatus;
        notes: string | null;
        source: import("@prisma/client").$Enums.LeadSource;
        sourceDetail: string | null;
        interestedIn: string | null;
        assignedTo: string | null;
        convertedToUserId: string | null;
        trialClassDate: Date | null;
    }>;
    delete(id: string): Promise<{
        id: string;
        email: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        phone: string;
        status: import("@prisma/client").$Enums.LeadStatus;
        notes: string | null;
        source: import("@prisma/client").$Enums.LeadSource;
        sourceDetail: string | null;
        interestedIn: string | null;
        assignedTo: string | null;
        convertedToUserId: string | null;
        trialClassDate: Date | null;
    }>;
}
