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
        phone: string | null;
        isActive: boolean;
        currentLevelId: string | null;
        currentLevel: {
            name: string;
            levelCode: string;
        } | null;
    }[]>;
    getTeachers(): Promise<{
        id: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
        _count: {
            teacherGroups: number;
        };
    }[]>;
    getDashboardMetrics(): Promise<{
        activeStudents: number;
        totalResources: number;
        newStudents: number;
        totalGroups: number;
        totalTeachers: number;
        totalLeads: number;
        convertedLeads: number;
    }>;
    createUser(data: any): Promise<{
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        firstName: string | null;
        lastName: string | null;
        phone: string | null;
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
        phone: string | null;
        isActive: boolean;
        currentLevelId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    resetPassword(userId: string, newPassword: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getResources(): Promise<({
        module: {
            level: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                levelCode: string;
                modality: import("@prisma/client").$Enums.ClassModality;
                rhythm: import("@prisma/client").$Enums.StudyRhythm | null;
                schedule: string | null;
                maxStudents: number;
                zoomLink: string | null;
                totalScoreTarget: number;
                zoomHostId: string | null;
                teacherId: string | null;
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
        zoomHostId: string | null;
        teacherId: string | null;
        title: string;
        type: import("@prisma/client").$Enums.ResourceType;
        description: string | null;
        zoomMeetingId: string | null;
        scheduledAt: Date | null;
        durationExpected: number;
        moduleId: string;
    })[]>;
    deleteResource(id: string): Promise<{
        url: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        zoomHostId: string | null;
        teacherId: string | null;
        title: string;
        type: import("@prisma/client").$Enums.ResourceType;
        description: string | null;
        zoomMeetingId: string | null;
        scheduledAt: Date | null;
        durationExpected: number;
        moduleId: string;
    }>;
    batchDeleteResources(ids: string[]): Promise<import("@prisma/client").Prisma.BatchPayload>;
    updateResource(id: string, data: any): Promise<{
        url: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        zoomHostId: string | null;
        teacherId: string | null;
        title: string;
        type: import("@prisma/client").$Enums.ResourceType;
        description: string | null;
        zoomMeetingId: string | null;
        scheduledAt: Date | null;
        durationExpected: number;
        moduleId: string;
    }>;
    createResource(data: any): Promise<{
        success: boolean;
        count: number;
    }>;
    getLevelsWithModules(): Promise<({
        _count: {
            users: number;
        };
        zoomHostGroup: {
            id: string;
            email: string;
            displayName: string;
            permanentLink: string | null;
        } | null;
        teacher: {
            id: string;
            email: string;
            firstName: string | null;
            lastName: string | null;
        } | null;
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
        modality: import("@prisma/client").$Enums.ClassModality;
        rhythm: import("@prisma/client").$Enums.StudyRhythm | null;
        schedule: string | null;
        maxStudents: number;
        zoomLink: string | null;
        totalScoreTarget: number;
        zoomHostId: string | null;
        teacherId: string | null;
    })[]>;
    createLevel(data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        levelCode: string;
        modality: import("@prisma/client").$Enums.ClassModality;
        rhythm: import("@prisma/client").$Enums.StudyRhythm | null;
        schedule: string | null;
        maxStudents: number;
        zoomLink: string | null;
        totalScoreTarget: number;
        zoomHostId: string | null;
        teacherId: string | null;
    }>;
    updateLevel(id: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        levelCode: string;
        modality: import("@prisma/client").$Enums.ClassModality;
        rhythm: import("@prisma/client").$Enums.StudyRhythm | null;
        schedule: string | null;
        maxStudents: number;
        zoomLink: string | null;
        totalScoreTarget: number;
        zoomHostId: string | null;
        teacherId: string | null;
    }>;
    deleteLevel(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        levelCode: string;
        modality: import("@prisma/client").$Enums.ClassModality;
        rhythm: import("@prisma/client").$Enums.StudyRhythm | null;
        schedule: string | null;
        maxStudents: number;
        zoomLink: string | null;
        totalScoreTarget: number;
        zoomHostId: string | null;
        teacherId: string | null;
    }>;
    private validateTeacherAvailability;
    scheduleClass(data: any): Promise<{
        url: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        zoomHostId: string | null;
        teacherId: string | null;
        title: string;
        type: import("@prisma/client").$Enums.ResourceType;
        description: string | null;
        zoomMeetingId: string | null;
        scheduledAt: Date | null;
        durationExpected: number;
        moduleId: string;
    }>;
    getScheduledClasses(): Promise<({
        zoomHost: {
            id: string;
            email: string;
            displayName: string;
        } | null;
        teacher: {
            id: string;
            firstName: string | null;
            lastName: string | null;
        } | null;
        module: {
            level: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                levelCode: string;
                modality: import("@prisma/client").$Enums.ClassModality;
                rhythm: import("@prisma/client").$Enums.StudyRhythm | null;
                schedule: string | null;
                maxStudents: number;
                zoomLink: string | null;
                totalScoreTarget: number;
                zoomHostId: string | null;
                teacherId: string | null;
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
        zoomHostId: string | null;
        teacherId: string | null;
        title: string;
        type: import("@prisma/client").$Enums.ResourceType;
        description: string | null;
        zoomMeetingId: string | null;
        scheduledAt: Date | null;
        durationExpected: number;
        moduleId: string;
    })[]>;
    deleteScheduledClass(id: string): Promise<{
        url: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        zoomHostId: string | null;
        teacherId: string | null;
        title: string;
        type: import("@prisma/client").$Enums.ResourceType;
        description: string | null;
        zoomMeetingId: string | null;
        scheduledAt: Date | null;
        durationExpected: number;
        moduleId: string;
    }>;
    updateScheduledClass(id: string, data: any): Promise<{
        url: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        zoomHostId: string | null;
        teacherId: string | null;
        title: string;
        type: import("@prisma/client").$Enums.ResourceType;
        description: string | null;
        zoomMeetingId: string | null;
        scheduledAt: Date | null;
        durationExpected: number;
        moduleId: string;
    }>;
    getEvaluations(): Promise<({
        user: {
            id: string;
            email: string;
            firstName: string | null;
            lastName: string | null;
        };
        level: {
            id: string;
            name: string;
            levelCode: string;
        };
        evaluatedBy: {
            id: string;
            firstName: string | null;
            lastName: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        notes: string | null;
        levelId: string;
        userId: string;
        oralScore: number | null;
        writtenScore: number | null;
        passed: boolean;
        evaluatedById: string | null;
        certificateUrl: string | null;
    })[]>;
    createEvaluation(data: any): Promise<{
        id: string;
        createdAt: Date;
        notes: string | null;
        levelId: string;
        userId: string;
        oralScore: number | null;
        writtenScore: number | null;
        passed: boolean;
        evaluatedById: string | null;
        certificateUrl: string | null;
    }>;
    getSettings(): Promise<{
        id: string;
        updatedAt: Date;
        googleAdsBudget: number;
        metaAdsBudget: number;
        schoolName: string;
    }>;
    updateSettings(data: any): Promise<{
        id: string;
        updatedAt: Date;
        googleAdsBudget: number;
        metaAdsBudget: number;
        schoolName: string;
    }>;
}
