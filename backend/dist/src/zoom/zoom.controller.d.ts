import { ZoomService } from './zoom.service';
export declare class ZoomController {
    private readonly zoomService;
    constructor(zoomService: ZoomService);
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
        displayName: string;
        permanentLink: string | null;
        accountId: string | null;
        clientId: string | null;
        clientSecret: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateHost(id: string, body: any): Promise<{
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
