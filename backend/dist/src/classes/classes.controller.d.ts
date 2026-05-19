import { ClassesService } from './classes.service';
export declare class ClassesController {
    private readonly classesService;
    constructor(classesService: ClassesService);
    getUpcomingClasses(): Promise<{
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
    }[]>;
}
