import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

interface ZoomTokenCache {
  token: string;
  expiresAt: number; // Unix timestamp
}

@Injectable()
export class ZoomService {
  private readonly logger = new Logger(ZoomService.name);
  // Cache tokens per host to avoid re-fetching every request
  private tokenCache: Map<string, ZoomTokenCache> = new Map();

  constructor(private prisma: PrismaService) {}

  /**
   * Get an access token for a specific ZoomHost using S2S OAuth.
   * Each host has its own accountId, clientId, clientSecret.
   */
  async getAccessToken(host: { accountId: string; clientId: string; clientSecret: string; id: string }): Promise<string> {
    // Check cache
    const cached = this.tokenCache.get(host.id);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.token;
    }

    const credentials = Buffer.from(`${host.clientId}:${host.clientSecret}`).toString('base64');

    try {
      const response = await fetch('https://zoom.us/oauth/token', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `grant_type=account_credentials&account_id=${host.accountId}`,
      });

      if (!response.ok) {
        const error = await response.text();
        this.logger.error(`Zoom OAuth failed for host ${host.id}: ${error}`);
        throw new HttpException(`Error al obtener token de Zoom: ${error}`, HttpStatus.BAD_GATEWAY);
      }

      const data = await response.json();

      // Cache token (expires in ~1 hour, cache for 55 min to be safe)
      this.tokenCache.set(host.id, {
        token: data.access_token,
        expiresAt: Date.now() + (55 * 60 * 1000),
      });

      return data.access_token;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      this.logger.error(`Zoom OAuth network error: ${error.message}`);
      throw new HttpException('No se pudo conectar con Zoom', HttpStatus.BAD_GATEWAY);
    }
  }

  /**
   * Create a Zoom meeting on behalf of a specific host.
   */
  async createMeeting(
    hostId: string,
    topic: string,
    startTime: Date,
    durationMinutes: number = 60,
  ): Promise<{ meetingId: string; joinUrl: string }> {
    const host = await this.prisma.zoomHost.findUnique({ where: { id: hostId } });
    if (!host) throw new HttpException('Zoom host no encontrado', HttpStatus.NOT_FOUND);
    if (!host.isActive) throw new HttpException('Este host de Zoom está desactivado', HttpStatus.BAD_REQUEST);

    const token = await this.getAccessToken(host);

    const response = await fetch(`https://api.zoom.us/v2/users/${host.email}/meetings`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic,
        type: 2, // Scheduled meeting
        start_time: startTime.toISOString(),
        duration: durationMinutes,
        timezone: 'America/Mexico_City',
        settings: {
          join_before_host: true,
          waiting_room: false,
          auto_recording: 'cloud', // Auto-record to cloud
          mute_upon_entry: true,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      this.logger.error(`Zoom create meeting failed: ${error}`);
      throw new HttpException(`Error al crear reunión en Zoom: ${error}`, HttpStatus.BAD_GATEWAY);
    }

    const meeting = await response.json();

    return {
      meetingId: String(meeting.id),
      joinUrl: meeting.join_url,
    };
  }

  /**
   * Delete/cancel a Zoom meeting.
   */
  async deleteMeeting(hostId: string, meetingId: string): Promise<void> {
    const host = await this.prisma.zoomHost.findUnique({ where: { id: hostId } });
    if (!host) return; // If host was deleted, skip

    try {
      const token = await this.getAccessToken(host);

      const response = await fetch(`https://api.zoom.us/v2/meetings/${meetingId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok && response.status !== 404) {
        this.logger.warn(`Failed to delete Zoom meeting ${meetingId}: ${response.statusText}`);
      }
    } catch (error) {
      this.logger.warn(`Could not delete Zoom meeting ${meetingId}: ${error.message}`);
    }
  }

  // ── CRUD for ZoomHosts ──

  async getHosts() {
    return this.prisma.zoomHost.findMany({
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        email: true,
        displayName: true,
        isActive: true,
        createdAt: true,
        _count: { select: { meetings: true } },
      },
    });
  }

  async createHost(data: { email: string; displayName: string; accountId: string; clientId: string; clientSecret: string }) {
    return this.prisma.zoomHost.create({ data });
  }

  async updateHost(id: string, data: any) {
    const updateData: any = {};
    if (data.email !== undefined) updateData.email = data.email;
    if (data.displayName !== undefined) updateData.displayName = data.displayName;
    if (data.accountId !== undefined) updateData.accountId = data.accountId;
    if (data.clientId !== undefined) updateData.clientId = data.clientId;
    if (data.clientSecret !== undefined) updateData.clientSecret = data.clientSecret;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    // Clear token cache if credentials changed
    if (data.accountId || data.clientId || data.clientSecret) {
      this.tokenCache.delete(id);
    }

    return this.prisma.zoomHost.update({ where: { id }, data: updateData });
  }

  async deleteHost(id: string) {
    // Unlink meetings first
    await this.prisma.resource.updateMany({
      where: { zoomHostId: id },
      data: { zoomHostId: null },
    });
    return this.prisma.zoomHost.delete({ where: { id } });
  }

  /**
   * Test connectivity to a Zoom host by attempting to get a token.
   */
  async testHost(id: string): Promise<{ success: boolean; message: string }> {
    const host = await this.prisma.zoomHost.findUnique({ where: { id } });
    if (!host) throw new HttpException('Host no encontrado', HttpStatus.NOT_FOUND);

    try {
      await this.getAccessToken(host);
      return { success: true, message: 'Conexión exitosa con Zoom' };
    } catch (error) {
      return { success: false, message: error.message || 'Error de conexión' };
    }
  }
}
