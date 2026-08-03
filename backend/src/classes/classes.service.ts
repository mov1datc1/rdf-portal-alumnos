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

    // Return upcoming classes + recent past classes (last 30 days) for calendar display
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return this.prisma.resource.findMany({
      where: {
        type: 'LIVE_CLASS',
        module: {
          levelId: user.currentLevelId
        },
        scheduledAt: {
          gte: thirtyDaysAgo
        }
      },
      orderBy: {
        scheduledAt: 'asc'
      },
      take: 50
    });
  }
}
