import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ResourcesService {
  constructor(private prisma: PrismaService) {}

  async getMyResources(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { currentLevelId: true }
    });

    if (!user || !user.currentLevelId) {
      return [];
    }

    return this.prisma.resource.findMany({
      where: {
        module: {
          levelId: user.currentLevelId
        },
        type: {
          in: ['RECORDED_VIDEO', 'PDF', 'HOMEWORK', 'TEST']
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }
}
