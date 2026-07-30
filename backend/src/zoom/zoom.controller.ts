import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ZoomService } from './zoom.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('admin/zoom')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class ZoomController {
  constructor(private readonly zoomService: ZoomService) {}

  @Get('hosts')
  getHosts() {
    return this.zoomService.getHosts();
  }

  @Post('hosts')
  createHost(@Body() body: { email: string; displayName: string; accountId: string; clientId: string; clientSecret: string }) {
    return this.zoomService.createHost(body);
  }

  @Patch('hosts/:id')
  updateHost(@Param('id') id: string, @Body() body: any) {
    return this.zoomService.updateHost(id, body);
  }

  @Delete('hosts/:id')
  deleteHost(@Param('id') id: string) {
    return this.zoomService.deleteHost(id);
  }

  @Post('hosts/:id/test')
  testHost(@Param('id') id: string) {
    return this.zoomService.testHost(id);
  }
}
