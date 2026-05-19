import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ClassesService {
  constructor(private prisma: PrismaService) {}

  async getUpcomingClasses() {
    return this.prisma.resource.findMany({
      where: {
        type: 'LIVE_CLASS'
      },
      orderBy: {
        createdAt: 'asc'
      },
      take: 5
    });
  }
}
