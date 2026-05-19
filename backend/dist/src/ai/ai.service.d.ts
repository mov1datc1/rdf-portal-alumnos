import { PrismaService } from '../prisma.service';
export declare class AiService {
    private prisma;
    private openai;
    constructor(prisma: PrismaService);
    processChat(email: string, message: string): Promise<{
        reply: string | null;
    }>;
}
