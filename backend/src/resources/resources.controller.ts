import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('resources')
@UseGuards(JwtAuthGuard)
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Get('my-resources')
  async getMyResources(@Req() req: any) {
    // req.user is set by JwtAuthGuard (usually contains userId)
    return this.resourcesService.getMyResources(req.user.userId || req.user.id);
  }
}
