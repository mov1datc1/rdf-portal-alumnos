import { ProgressService } from './progress.service';
export declare class ProgressController {
    private readonly progressService;
    constructor(progressService: ProgressService);
    getUserProgress(userId: string): Promise<({
        resource: {
            module: {
                level: {
                    id: string;
                    name: string;
                    createdAt: Date;
                    updatedAt: Date;
                    totalScoreTarget: number;
                };
            } & {
                id: string;
                title: string;
                createdAt: Date;
                updatedAt: Date;
                levelId: string;
                orderIndex: number;
            };
        } & {
            id: string;
            moduleId: string;
            type: import("@prisma/client").$Enums.ResourceType;
            title: string;
            description: string | null;
            url: string | null;
            scheduledAt: Date | null;
            durationExpected: number;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        userId: string;
        resourceId: string;
        status: import("@prisma/client").$Enums.ProgressStatus;
        timeSpentSeconds: number;
        score: number | null;
        lastAccessedAt: Date;
    })[]>;
}
