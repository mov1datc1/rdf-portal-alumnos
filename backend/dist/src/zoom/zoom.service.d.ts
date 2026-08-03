import { PrismaService } from '../prisma.service';
export declare class ZoomService {
    private prisma;
    private readonly logger;
    private tokenCache;
    constructor(prisma: PrismaService);
    getAccessToken(host: {
        accountId: string | null;
        clientId: string | null;
        clientSecret: string | null;
        id: string;
    }): Promise<string>;
    createMeeting(hostId: string, topic: string, startTime: Date, durationMinutes?: number): Promise<{
        meetingId: string;
        joinUrl: string;
    }>;
    deleteMeeting(hostId: string, meetingId: string): Promise<void>;
    getHosts(): Promise<{
        id: string;
        email: string;
        isActive: boolean;
        createdAt: Date;
        _count: {
            meetings: number;
            assignedGroups: number;
        };
        displayName: string;
        permanentLink: string | null;
        accountId: string | null;
    }[]>;
    getHostsWithPermanentLinks(): Promise<{
        id: string;
        email: string;
        _count: {
            assignedGroups: number;
        };
        displayName: string;
        permanentLink: string | null;
    }[]>;
    createHost(data: {
        email: string;
        displayName: string;
        permanentLink?: string;
        accountId?: string;
        clientId?: string;
        clientSecret?: string;
    }): Promise<{
        id: string;
        email: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        displayName: string;
        permanentLink: string | null;
        accountId: string | null;
        clientId: string | null;
        clientSecret: string | null;
    }>;
    updateHost(id: string, data: any): Promise<{
        id: string;
        email: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        displayName: string;
        permanentLink: string | null;
        accountId: string | null;
        clientId: string | null;
        clientSecret: string | null;
    }>;
    deleteHost(id: string): Promise<{
        id: string;
        email: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        displayName: string;
        permanentLink: string | null;
        accountId: string | null;
        clientId: string | null;
        clientSecret: string | null;
    }>;
    testHost(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
