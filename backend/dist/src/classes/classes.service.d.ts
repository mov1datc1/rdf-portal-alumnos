import { PrismaService } from '../prisma.service';
export declare class ClassesService {
    private prisma;
    constructor(prisma: PrismaService);
    getUpcomingClasses(userId: string): Promise<{
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
    }[]>;
}
