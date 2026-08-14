import { PrismaService } from '../prisma.service';
export declare class TeacherService {
    private prisma;
    constructor(prisma: PrismaService);
    getMyGroups(teacherId: string): Promise<({
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
    getAttendanceSchedule(teacherId: string): Promise<({
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
    getGroupAttendanceAudit(levelId: string): Promise<{
        students: {
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
        }[];
        classes: ({
            module: {
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
        })[];
        attendanceMap: any;
    }>;
    getStudentAttendanceAudit(studentId: string): Promise<{
        student: {
            currentLevel: {
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
            } | null;
        } & {
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
        };
        audit: {
            class: {
                module: {
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
            };
            attended: boolean | null | undefined;
        }[];
    }>;
    createEvaluation(evaluatorId: string, data: any): Promise<{
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
        notes: string | null;
        levelId: string;
        userId: string;
        oralScore: number | null;
        writtenScore: number | null;
        passed: boolean;
        evaluatedById: string | null;
        certificateUrl: string | null;
    })[]>;
    createClassLog(teacherId: string, data: {
        levelId: string;
        title: string;
        description: string;
        date?: string;
    }): Promise<{
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
    }>;
    getClassLogs(teacherId: string): Promise<({
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
    updateClassLog(teacherId: string, logId: string, data: {
        title: string;
        description: string;
        date?: string;
    }): Promise<{
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
    }>;
    deleteClassLog(teacherId: string, logId: string): Promise<{
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
}
