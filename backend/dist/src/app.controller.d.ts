import { AppService } from './app.service';
import { AdminService } from './admin/admin.service';
export declare class AppController {
    private readonly appService;
    private readonly adminService;
    constructor(appService: AppService, adminService: AdminService);
    getHello(): string;
    getLandingConfig(): Promise<{
        id: string;
        updatedAt: Date;
        googleAdsBudget: number;
        metaAdsBudget: number;
        schoolName: string;
        heroSlides: import("@prisma/client/runtime/client").JsonValue | null;
        teachers: import("@prisma/client/runtime/client").JsonValue | null;
        levelsData: import("@prisma/client/runtime/client").JsonValue | null;
    }>;
}
