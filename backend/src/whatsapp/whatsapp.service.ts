import { Injectable, Logger } from '@nestjs/common';

/**
 * WhatsApp Cloud API Integration via Meta Business Platform.
 *
 * SETUP REQUIRED:
 * 1. Create a Meta Business App at https://developers.facebook.com
 * 2. Add WhatsApp product to the app
 * 3. Get a permanent access token (System User > Permissions > whatsapp_business_messaging)
 * 4. Register your WhatsApp Business phone number
 * 5. Create message templates in Meta Business Suite
 * 6. Set environment variables: WHATSAPP_TOKEN, WHATSAPP_PHONE_ID, WHATSAPP_VERIFY_TOKEN
 *
 * TEMPLATES TO CREATE IN META:
 * - "bienvenida_lead": Welcome message for new leads
 * - "clase_recordatorio": Class reminder (24h before)
 * - "pago_confirmado": Payment confirmation
 * - "clase_prueba": Trial class invitation
 * - "nivel_completado": Level completion + certificate
 */

interface WhatsAppMessage {
  to: string;           // Phone number with country code, e.g., "+5233XXXXXXXX"
  templateName: string; // Pre-approved template name
  languageCode?: string;
  components?: any[];   // Template variable components
}

interface WhatsAppTextMessage {
  to: string;
  body: string;
}

@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name);
  private readonly apiUrl = 'https://graph.facebook.com/v21.0';
  private readonly token = process.env.WHATSAPP_TOKEN || '';
  private readonly phoneNumberId = process.env.WHATSAPP_PHONE_ID || '';
  private readonly verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || 'lesrois_verify_2026';

  /**
   * Check if WhatsApp integration is configured.
   */
  isConfigured(): boolean {
    return !!(this.token && this.phoneNumberId);
  }

  /**
   * Send a pre-approved template message.
   * Templates must be created and approved in Meta Business Suite first.
   */
  async sendTemplate(msg: WhatsAppMessage): Promise<any> {
    if (!this.isConfigured()) {
      this.logger.warn('WhatsApp not configured. Skipping template message.');
      return { success: false, reason: 'NOT_CONFIGURED' };
    }

    const phone = this.normalizePhone(msg.to);

    try {
      const response = await fetch(`${this.apiUrl}/${this.phoneNumberId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: phone,
          type: 'template',
          template: {
            name: msg.templateName,
            language: { code: msg.languageCode || 'es_MX' },
            components: msg.components || [],
          },
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        this.logger.error(`WhatsApp API error: ${JSON.stringify(result)}`);
        return { success: false, error: result };
      }

      this.logger.log(`✅ WhatsApp template "${msg.templateName}" sent to ${phone}`);
      return { success: true, messageId: result.messages?.[0]?.id };

    } catch (error) {
      this.logger.error(`WhatsApp send failed: ${error}`);
      return { success: false, error: String(error) };
    }
  }

  /**
   * Send a free-text message (only within 24h conversation window).
   */
  async sendText(msg: WhatsAppTextMessage): Promise<any> {
    if (!this.isConfigured()) {
      this.logger.warn('WhatsApp not configured. Skipping text message.');
      return { success: false, reason: 'NOT_CONFIGURED' };
    }

    const phone = this.normalizePhone(msg.to);

    try {
      const response = await fetch(`${this.apiUrl}/${this.phoneNumberId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: phone,
          type: 'text',
          text: { preview_url: false, body: msg.body },
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        this.logger.error(`WhatsApp text error: ${JSON.stringify(result)}`);
        return { success: false, error: result };
      }

      this.logger.log(`✅ WhatsApp text sent to ${phone}`);
      return { success: true, messageId: result.messages?.[0]?.id };

    } catch (error) {
      this.logger.error(`WhatsApp text failed: ${error}`);
      return { success: false, error: String(error) };
    }
  }

  // ── High-Level Business Methods ──

  /**
   * Welcome a new lead that came from ads.
   * Uses template: "bienvenida_lead"
   */
  async welcomeLead(name: string, phone: string) {
    return this.sendTemplate({
      to: phone,
      templateName: 'bienvenida_lead',
      components: [{
        type: 'body',
        parameters: [{ type: 'text', text: name }],
      }],
    });
  }

  /**
   * Send class reminder 24h before.
   * Uses template: "clase_recordatorio"
   */
  async remindClass(phone: string, studentName: string, groupName: string, dateTime: string, zoomLink: string) {
    return this.sendTemplate({
      to: phone,
      templateName: 'clase_recordatorio',
      components: [{
        type: 'body',
        parameters: [
          { type: 'text', text: studentName },
          { type: 'text', text: groupName },
          { type: 'text', text: dateTime },
          { type: 'text', text: zoomLink },
        ],
      }],
    });
  }

  /**
   * Confirm payment received.
   * Uses template: "pago_confirmado"
   */
  async confirmPayment(phone: string, studentName: string, amount: string, method: string) {
    return this.sendTemplate({
      to: phone,
      templateName: 'pago_confirmado',
      components: [{
        type: 'body',
        parameters: [
          { type: 'text', text: studentName },
          { type: 'text', text: amount },
          { type: 'text', text: method },
        ],
      }],
    });
  }

  /**
   * Invite lead to a trial class.
   * Uses template: "clase_prueba"
   */
  async inviteTrialClass(phone: string, name: string, dateTime: string, zoomLink: string) {
    return this.sendTemplate({
      to: phone,
      templateName: 'clase_prueba',
      components: [{
        type: 'body',
        parameters: [
          { type: 'text', text: name },
          { type: 'text', text: dateTime },
          { type: 'text', text: zoomLink },
        ],
      }],
    });
  }

  /**
   * Notify student they completed a level.
   * Uses template: "nivel_completado"
   */
  async notifyLevelCompleted(phone: string, studentName: string, levelName: string, certificateUrl: string) {
    return this.sendTemplate({
      to: phone,
      templateName: 'nivel_completado',
      components: [{
        type: 'body',
        parameters: [
          { type: 'text', text: studentName },
          { type: 'text', text: levelName },
          { type: 'text', text: certificateUrl },
        ],
      }],
    });
  }

  // ── Webhook verification (Meta verification challenge) ──

  /**
   * Verify webhook callback from Meta.
   * GET /whatsapp/webhook?hub.mode=subscribe&hub.verify_token=XXX&hub.challenge=YYY
   */
  verifyWebhook(mode: string, token: string, challenge: string): string | null {
    if (mode === 'subscribe' && token === this.verifyToken) {
      this.logger.log('✅ WhatsApp webhook verified');
      return challenge;
    }
    this.logger.warn('❌ WhatsApp webhook verification failed');
    return null;
  }

  /**
   * Process incoming webhook event from WhatsApp.
   * Logs incoming messages for future CRM integration.
   */
  async processWebhook(body: any): Promise<void> {
    const entries = body?.entry || [];
    for (const entry of entries) {
      const changes = entry?.changes || [];
      for (const change of changes) {
        if (change.field === 'messages') {
          const messages = change.value?.messages || [];
          for (const message of messages) {
            this.logger.log(`📩 Incoming WhatsApp from ${message.from}: ${message.text?.body || '[media]'}`);
            // TODO: Auto-create Lead if phone not found in DB
            // TODO: Store message in conversation log
          }
        }
      }
    }
  }

  // ── Utilities ──

  /**
   * Normalize phone number to international format.
   * Handles Mexican numbers: 33XXXXXXXX → 5233XXXXXXXX
   */
  private normalizePhone(phone: string): string {
    let clean = phone.replace(/[\s\-\(\)\+]/g, '');
    // If starts with 0, remove it
    if (clean.startsWith('0')) clean = clean.substring(1);
    // If 10 digits (Mexican local), prepend 52
    if (clean.length === 10 && !clean.startsWith('52')) {
      clean = '52' + clean;
    }
    return clean;
  }
}
