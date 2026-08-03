interface WhatsAppMessage {
    to: string;
    templateName: string;
    languageCode?: string;
    components?: any[];
}
interface WhatsAppTextMessage {
    to: string;
    body: string;
}
export declare class WhatsappService {
    private readonly logger;
    private readonly apiUrl;
    private readonly token;
    private readonly phoneNumberId;
    private readonly verifyToken;
    isConfigured(): boolean;
    sendTemplate(msg: WhatsAppMessage): Promise<any>;
    sendText(msg: WhatsAppTextMessage): Promise<any>;
    welcomeLead(name: string, phone: string): Promise<any>;
    remindClass(phone: string, studentName: string, groupName: string, dateTime: string, zoomLink: string): Promise<any>;
    confirmPayment(phone: string, studentName: string, amount: string, method: string): Promise<any>;
    inviteTrialClass(phone: string, name: string, dateTime: string, zoomLink: string): Promise<any>;
    notifyLevelCompleted(phone: string, studentName: string, levelName: string, certificateUrl: string): Promise<any>;
    verifyWebhook(mode: string, token: string, challenge: string): string | null;
    processWebhook(body: any): Promise<void>;
    private normalizePhone;
}
export {};
