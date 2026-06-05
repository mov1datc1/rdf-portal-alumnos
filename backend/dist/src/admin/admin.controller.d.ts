import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getDashboardMetrics(): Promise<{
        activeStudents: number;
        totalResources: number;
        newStudents: number;
    }>;
    getUsers(): Promise<{
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        firstName: string | null;
        lastName: string | null;
        isActive: boolean;
        currentLevelId: string | null;
    }[]>;
    createUser(body: any): Promise<{
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        firstName: string | null;
        lastName: string | null;
        isActive: boolean;
        currentLevelId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateUser(id: string, body: any): Promise<{
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        firstName: string | null;
        lastName: string | null;
        isActive: boolean;
        currentLevelId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    createResource(body: any): Promise<{
        url: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        type: import("@prisma/client").$Enums.ResourceType;
        description: string | null;
        scheduledAt: Date | null;
        durationExpected: number;
        moduleId: string;
    }>;
    getLevelsWithModules(): Promise<({
        modules: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            orderIndex: number;
            title: string;
            levelId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        totalScoreTarget: number;
    })[]>;
    scheduleClass(body: any): Promise<{
        url: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        type: import("@prisma/client").$Enums.ResourceType;
        description: string | null;
        scheduledAt: Date | null;
        durationExpected: number;
        moduleId: string;
    }>;
    getScheduledClasses(): Promise<({
        module: {
            level: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                totalScoreTarget: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            orderIndex: number;
            title: string;
            levelId: string;
        };
    } & {
        url: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        type: import("@prisma/client").$Enums.ResourceType;
        description: string | null;
        scheduledAt: Date | null;
        durationExpected: number;
        moduleId: string;
    })[]>;
    deleteScheduledClass(id: string): Promise<{
        url: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        type: import("@prisma/client").$Enums.ResourceType;
        description: string | null;
        scheduledAt: Date | null;
        durationExpected: number;
        moduleId: string;
    }>;
    updateScheduledClass(id: string, body: any): Promise<{
        url: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        type: import("@prisma/client").$Enums.ResourceType;
        description: string | null;
        scheduledAt: Date | null;
        durationExpected: number;
        moduleId: string;
    }>;
    createLevel(body: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        totalScoreTarget: number;
    }>;
    updateLevel(id: string, body: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        totalScoreTarget: number;
    }>;
    deleteLevel(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        totalScoreTarget: number;
    }>;
}
