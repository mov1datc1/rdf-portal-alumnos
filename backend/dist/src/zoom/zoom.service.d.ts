import { PrismaService } from '../prisma.service';
export declare class ZoomService {
    private prisma;
    private readonly logger;
    private tokenCache;
    constructor(prisma: PrismaService);
    getAccessToken(host: {
        accountId: string;
        clientId: string;
        clientSecret: string;
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
        };
        displayName: string;
    }[]>;
    createHost(data: {
        email: string;
        displayName: string;
        accountId: string;
        clientId: string;
        clientSecret: string;
    }): Promise<{
        id: string;
        email: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        displayName: string;
        accountId: string;
        clientId: string;
        clientSecret: string;
    }>;
    updateHost(id: string, data: any): Promise<{
        id: string;
        email: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        displayName: string;
        accountId: string;
        clientId: string;
        clientSecret: string;
    }>;
    deleteHost(id: string): Promise<{
        id: string;
        email: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        displayName: string;
        accountId: string;
        clientId: string;
        clientSecret: string;
    }>;
    testHost(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
