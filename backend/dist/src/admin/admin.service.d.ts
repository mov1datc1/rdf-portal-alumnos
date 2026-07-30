import { PrismaService } from '../prisma.service';
import { ZoomService } from '../zoom/zoom.service';
export declare class AdminService {
    private prisma;
    private zoomService?;
    private supabase;
    constructor(prisma: PrismaService, zoomService?: ZoomService | undefined);
    getUsers(): Promise<{
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        firstName: string | null;
        lastName: string | null;
        isActive: boolean;
        currentLevelId: string | null;
    }[]>;
    getDashboardMetrics(): Promise<{
        activeStudents: number;
        totalResources: number;
        newStudents: number;
    }>;
    createUser(data: any): Promise<{
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
    updateUser(id: string, data: any): Promise<{
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
    createResource(data: any): Promise<{
        url: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        type: import("@prisma/client").$Enums.ResourceType;
        description: string | null;
        zoomMeetingId: string | null;
        scheduledAt: Date | null;
        durationExpected: number;
        moduleId: string;
        zoomHostId: string | null;
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
        levelCode: string;
        schedule: string | null;
        totalScoreTarget: number;
    })[]>;
    scheduleClass(data: any): Promise<{
        url: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        type: import("@prisma/client").$Enums.ResourceType;
        description: string | null;
        zoomMeetingId: string | null;
        scheduledAt: Date | null;
        durationExpected: number;
        moduleId: string;
        zoomHostId: string | null;
    }>;
    getScheduledClasses(): Promise<({
        module: {
            level: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                levelCode: string;
                schedule: string | null;
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
        zoomHost: {
            id: string;
            email: string;
            displayName: string;
        } | null;
    } & {
        url: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        type: import("@prisma/client").$Enums.ResourceType;
        description: string | null;
        zoomMeetingId: string | null;
        scheduledAt: Date | null;
        durationExpected: number;
        moduleId: string;
        zoomHostId: string | null;
    })[]>;
    deleteScheduledClass(id: string): Promise<{
        url: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        type: import("@prisma/client").$Enums.ResourceType;
        description: string | null;
        zoomMeetingId: string | null;
        scheduledAt: Date | null;
        durationExpected: number;
        moduleId: string;
        zoomHostId: string | null;
    }>;
    updateScheduledClass(id: string, data: any): Promise<{
        url: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        type: import("@prisma/client").$Enums.ResourceType;
        description: string | null;
        zoomMeetingId: string | null;
        scheduledAt: Date | null;
        durationExpected: number;
        moduleId: string;
        zoomHostId: string | null;
    }>;
    createLevel(data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        levelCode: string;
        schedule: string | null;
        totalScoreTarget: number;
    }>;
    updateLevel(id: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        levelCode: string;
        schedule: string | null;
        totalScoreTarget: number;
    }>;
    deleteLevel(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        levelCode: string;
        schedule: string | null;
        totalScoreTarget: number;
    }>;
}
