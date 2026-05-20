import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ClassesService {
  constructor(private prisma: PrismaService) {}

  async getUpcomingClasses(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.currentLevelId) {
      return [];
    }

    return this.prisma.resource.findMany({
      where: {
        type: 'LIVE_CLASS',
        module: {
          levelId: user.currentLevelId
        },
        scheduledAt: {
          gte: new Date()
        }
      },
      orderBy: {
        scheduledAt: 'asc'
      },
      take: 5
    });
  }
}
