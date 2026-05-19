import { ProgressService } from './progress.service';
export declare class ProgressController {
    private readonly progressService;
    constructor(progressService: ProgressService);
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
