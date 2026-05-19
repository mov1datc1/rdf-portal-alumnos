import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getUsers() {
    return this.prisma.user.findMany({
      select: { id: true, email: true, firstName: true, lastName: true, role: true, isActive: true },
    });
  }

  async createUser(data: any) {
    return this.prisma.user.create({
      data: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role || 'STUDENT',
      },
    });
  }

  async updateUser(id: string, data: any) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async createResource(data: any) {
    return this.prisma.resource.create({
      data: {
        title: data.title,
        url: data.url,
        type: data.type || 'RECORDED_VIDEO',
        moduleId: data.moduleId,
        durationExpected: data.durationExpected || 0,
      },
    });
  }
}
