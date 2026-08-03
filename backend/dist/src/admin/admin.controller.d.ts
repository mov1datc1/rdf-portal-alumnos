import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getDashboardMetrics(): Promise<{
        activeStudents: number;
        totalResources: number;
        newStudents: number;
        totalGroups: number;
        totalTeachers: number;
        totalLeads: number;
        convertedLeads: number;
    }>;
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
    createUser(body: any): Promise<{
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
    updateUser(id: string, body: any): Promise<{
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
    getTeachers(): Promise<{
        id: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
        _count: {
            teacherGroups: number;
        };
    }[]>;
    createResource(body: any): Promise<{
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
        _count: {
            users: number;
        };
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
        teacherId: string | null;
    })[]>;
    createLevel(body: any): Promise<{
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
        teacherId: string | null;
    }>;
    updateLevel(id: string, body: any): Promise<{
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
        teacherId: string | null;
    }>;
    scheduleClass(body: any): Promise<{
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
                modality: import("@prisma/client").$Enums.ClassModality;
                rhythm: import("@prisma/client").$Enums.StudyRhythm | null;
                schedule: string | null;
                maxStudents: number;
                zoomLink: string | null;
                totalScoreTarget: number;
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
    updateScheduledClass(id: string, body: any): Promise<{
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
        levelId: string;
        userId: string;
        oralScore: number | null;
        writtenScore: number | null;
        passed: boolean;
        evaluatedById: string | null;
        certificateUrl: string | null;
        notes: string | null;
    })[]>;
    createEvaluation(body: any): Promise<{
        id: string;
        createdAt: Date;
        levelId: string;
        userId: string;
        oralScore: number | null;
        writtenScore: number | null;
        passed: boolean;
        evaluatedById: string | null;
        certificateUrl: string | null;
        notes: string | null;
    }>;
    getSettings(): Promise<{
        id: string;
        updatedAt: Date;
        googleAdsBudget: number;
        metaAdsBudget: number;
        schoolName: string;
    }>;
    updateSettings(body: any): Promise<{
        id: string;
        updatedAt: Date;
        googleAdsBudget: number;
        metaAdsBudget: number;
        schoolName: string;
    }>;
}
