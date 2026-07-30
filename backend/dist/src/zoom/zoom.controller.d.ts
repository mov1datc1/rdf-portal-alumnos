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
        };
        displayName: string;
    }[]>;
    createHost(body: {
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
    updateHost(id: string, body: any): Promise<{
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
