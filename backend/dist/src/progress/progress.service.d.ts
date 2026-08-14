import { PrismaService } from '../prisma.service';
export declare class ProgressService {
    private prisma;
    constructor(prisma: PrismaService);
    getUserProgress(userId: string): Promise<({
        resource: {
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
        };
    } & {
        id: string;
        status: import("@prisma/client").$Enums.ProgressStatus;
        timeSpentSeconds: number;
        score: number | null;
        lastAccessedAt: Date;
        userId: string;
        resourceId: string;
    })[]>;
}
