import { PrismaService } from '../prisma.service';
export declare class ProfileController {
    private readonly prisma;
    private supabase;
    constructor(prisma: PrismaService);
    getDashboardData(req: any): Promise<{
        groupName: string;
        levelCode: string;
        teacherName: string;
    }>;
    changePassword(req: any, body: {
        currentPassword: string;
        newPassword: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
}
