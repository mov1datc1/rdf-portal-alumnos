import { ZoomService } from './zoom.service';
export declare class ZoomController {
    private readonly zoomService;
    constructor(zoomService: ZoomService);
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
    createHost(body: {
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
    updateHost(id: string, body: any): Promise<{
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
