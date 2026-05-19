import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ProgressService {
  constructor(private prisma: PrismaService) {}

  async getUserProgress(userId: string) {
    return this.prisma.userProgress.findMany({
      where: {
        userId: userId
      },
      include: {
        resource: {
          include: {
            module: {
              include: {
                level: true
              }
            }
          }
        }
      }
    });
  }
}
