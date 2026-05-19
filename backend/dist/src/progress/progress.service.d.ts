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
