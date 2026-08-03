import { PrismaService } from '../prisma.service';
export declare class TeacherService {
    private prisma;
    constructor(prisma: PrismaService);
    getMyGroups(teacherId: string): Promise<({
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
    getMyStudents(teacherId: string): Promise<{
        id: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
        phone: string | null;
        currentLevel: {
            id: string;
            name: string;
            levelCode: string;
        } | null;
        _count: {
            progress: number;
        };
    }[]>;
    getMySchedule(teacherId: string): Promise<({
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
    getDashboard(teacherId: string): Promise<{
        totalGroups: number;
        totalStudents: number;
        upcomingClasses: number;
        nextClass: ({
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
        }) | null;
    }>;
    recordAttendance(data: {
        resourceId: string;
        levelId: string;
        attendees: {
            userId: string;
            attended: boolean;
        }[];
    }): Promise<any[]>;
    getAttendance(resourceId: string): Promise<({
        user: {
            id: string;
            firstName: string | null;
            lastName: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        levelId: string;
        userId: string;
        resourceId: string;
        attended: boolean;
    })[]>;
    createEvaluation(evaluatorId: string, data: any): Promise<{
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
    getMyEvaluations(teacherId: string): Promise<({
        user: {
            id: string;
            firstName: string | null;
            lastName: string | null;
        };
        level: {
            id: string;
            name: string;
            levelCode: string;
        };
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
}
