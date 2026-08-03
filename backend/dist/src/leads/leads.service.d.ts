import { PrismaService } from '../prisma.service';
export declare class LeadsService {
    private prisma;
    private readonly logger;
    private supabase;
    constructor(prisma: PrismaService);
    getAll(): Promise<{
        id: string;
        email: string | null;
        phone: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        source: import("@prisma/client").$Enums.LeadSource;
        sourceDetail: string | null;
        status: import("@prisma/client").$Enums.LeadStatus;
        notes: string | null;
        interestedIn: string | null;
        assignedTo: string | null;
        convertedToUserId: string | null;
        trialClassDate: Date | null;
    }[]>;
    getById(id: string): Promise<{
        id: string;
        email: string | null;
        phone: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        source: import("@prisma/client").$Enums.LeadSource;
        sourceDetail: string | null;
        status: import("@prisma/client").$Enums.LeadStatus;
        notes: string | null;
        interestedIn: string | null;
        assignedTo: string | null;
        convertedToUserId: string | null;
        trialClassDate: Date | null;
    } | null>;
    getEnrolledLeads(): Promise<{
        id: string;
        email: string | null;
        phone: string;
        name: string;
        interestedIn: string | null;
        convertedToUserId: string | null;
    }[]>;
    create(data: any): Promise<{
        id: string;
        email: string | null;
        phone: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        source: import("@prisma/client").$Enums.LeadSource;
        sourceDetail: string | null;
        status: import("@prisma/client").$Enums.LeadStatus;
        notes: string | null;
        interestedIn: string | null;
        assignedTo: string | null;
        convertedToUserId: string | null;
        trialClassDate: Date | null;
    }>;
    update(id: string, data: any): Promise<{
        id: string;
        email: string | null;
        phone: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        source: import("@prisma/client").$Enums.LeadSource;
        sourceDetail: string | null;
        status: import("@prisma/client").$Enums.LeadStatus;
        notes: string | null;
        interestedIn: string | null;
        assignedTo: string | null;
        convertedToUserId: string | null;
        trialClassDate: Date | null;
    }>;
    updateStatus(id: string, status: string): Promise<{
        id: string;
        email: string | null;
        phone: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        source: import("@prisma/client").$Enums.LeadSource;
        sourceDetail: string | null;
        status: import("@prisma/client").$Enums.LeadStatus;
        notes: string | null;
        interestedIn: string | null;
        assignedTo: string | null;
        convertedToUserId: string | null;
        trialClassDate: Date | null;
    }>;
    private convertLeadToUser;
    delete(id: string): Promise<{
        id: string;
        email: string | null;
        phone: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        source: import("@prisma/client").$Enums.LeadSource;
        sourceDetail: string | null;
        status: import("@prisma/client").$Enums.LeadStatus;
        notes: string | null;
        interestedIn: string | null;
        assignedTo: string | null;
        convertedToUserId: string | null;
        trialClassDate: Date | null;
    }>;
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
}
