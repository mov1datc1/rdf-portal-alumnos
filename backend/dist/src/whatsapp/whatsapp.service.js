"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var WhatsappService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsappService = void 0;
const common_1 = require("@nestjs/common");
let WhatsappService = WhatsappService_1 = class WhatsappService {
    logger = new common_1.Logger(WhatsappService_1.name);
    apiUrl = 'https://graph.facebook.com/v21.0';
    token = process.env.WHATSAPP_TOKEN || '';
    phoneNumberId = process.env.WHATSAPP_PHONE_ID || '';
    verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || 'lesrois_verify_2026';
    isConfigured() {
        return !!(this.token && this.phoneNumberId);
    }
    async sendTemplate(msg) {
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
        }
        catch (error) {
            this.logger.error(`WhatsApp send failed: ${error}`);
            return { success: false, error: String(error) };
        }
    }
    async sendText(msg) {
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
        }
        catch (error) {
            this.logger.error(`WhatsApp text failed: ${error}`);
            return { success: false, error: String(error) };
        }
    }
    async welcomeLead(name, phone) {
        return this.sendTemplate({
            to: phone,
            templateName: 'bienvenida_lead',
            components: [{
                    type: 'body',
                    parameters: [{ type: 'text', text: name }],
                }],
        });
    }
    async remindClass(phone, studentName, groupName, dateTime, zoomLink) {
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
    async confirmPayment(phone, studentName, amount, method) {
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
    async inviteTrialClass(phone, name, dateTime, zoomLink) {
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
    async notifyLevelCompleted(phone, studentName, levelName, certificateUrl) {
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
    verifyWebhook(mode, token, challenge) {
        if (mode === 'subscribe' && token === this.verifyToken) {
            this.logger.log('✅ WhatsApp webhook verified');
            return challenge;
        }
        this.logger.warn('❌ WhatsApp webhook verification failed');
        return null;
    }
    async processWebhook(body) {
        const entries = body?.entry || [];
        for (const entry of entries) {
            const changes = entry?.changes || [];
            for (const change of changes) {
                if (change.field === 'messages') {
                    const messages = change.value?.messages || [];
                    for (const message of messages) {
                        this.logger.log(`📩 Incoming WhatsApp from ${message.from}: ${message.text?.body || '[media]'}`);
                    }
                }
            }
        }
    }
    normalizePhone(phone) {
        let clean = phone.replace(/[\s\-\(\)\+]/g, '');
        if (clean.startsWith('0'))
            clean = clean.substring(1);
        if (clean.length === 10 && !clean.startsWith('52')) {
            clean = '52' + clean;
        }
        return clean;
    }
};
exports.WhatsappService = WhatsappService;
exports.WhatsappService = WhatsappService = WhatsappService_1 = __decorate([
    (0, common_1.Injectable)()
], WhatsappService);
//# sourceMappingURL=whatsapp.service.js.map