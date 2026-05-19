import { ClassesService } from './classes.service';
export declare class ClassesController {
    private readonly classesService;
    constructor(classesService: ClassesService);
    getUpcomingClasses(): Promise<{
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
