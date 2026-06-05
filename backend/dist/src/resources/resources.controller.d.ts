import { ResourcesService } from './resources.service';
export declare class ResourcesController {
    private readonly resourcesService;
    constructor(resourcesService: ResourcesService);
    getMyResources(req: any): Promise<{
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
