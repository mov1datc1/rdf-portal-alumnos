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
        displayName: string;
        permanentLink: string | null;
        accountId: string | null;
        isActive: boolean;
        createdAt: Date;
        _count: {
            meetings: number;
            assignedGroups: number;
        };
    }[]>;
    getHostsWithPermanentLinks(): Promise<{
        id: string;
        email: string;
        displayName: string;
        permanentLink: string | null;
        _count: {
            assignedGroups: number;
        };
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
        displayName: string;
        permanentLink: string | null;
        accountId: string | null;
        clientId: string | null;
        clientSecret: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateHost(id: string, data: any): Promise<{
        id: string;
        email: string;
        displayName: string;
        permanentLink: string | null;
        accountId: string | null;
        clientId: string | null;
        clientSecret: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteHost(id: string): Promise<{
        id: string;
        email: string;
        displayName: string;
        permanentLink: string | null;
        accountId: string | null;
        clientId: string | null;
        clientSecret: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    testHost(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
