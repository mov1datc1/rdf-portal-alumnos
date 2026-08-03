import { TeacherService } from './teacher.service';
export declare class TeacherController {
    private readonly teacherService;
    constructor(teacherService: TeacherService);
    getDashboard(req: any): Promise<{
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
            title: string;
            type: import("@prisma/client").$Enums.ResourceType;
            description: string | null;
            zoomMeetingId: string | null;
            scheduledAt: Date | null;
            durationExpected: number;
            moduleId: string;
        }) | null;
    }>;
    getMyGroups(req: any): Promise<({
        _count: {
            users: number;
        };
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
    getMyStudents(req: any): Promise<{
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
    getMySchedule(req: any): Promise<({
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
        title: string;
        type: import("@prisma/client").$Enums.ResourceType;
        description: string | null;
        zoomMeetingId: string | null;
        scheduledAt: Date | null;
        durationExpected: number;
        moduleId: string;
    })[]>;
    recordAttendance(body: {
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
    getMyEvaluations(req: any): Promise<({
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
        notes: string | null;
        levelId: string;
        userId: string;
        oralScore: number | null;
        writtenScore: number | null;
        passed: boolean;
        evaluatedById: string | null;
        certificateUrl: string | null;
    })[]>;
    createEvaluation(req: any, body: any): Promise<{
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
}
