import { WhatsappService } from './whatsapp.service';
export declare class WhatsappController {
    private readonly whatsappService;
    constructor(whatsappService: WhatsappService);
    verifyWebhook(mode: string, token: string, challenge: string): string;
    handleWebhook(body: any): Promise<string>;
    getStatus(): {
        configured: boolean;
        phoneId: string | null;
    };
    sendMessage(body: {
        to: string;
        message: string;
    }): Promise<any>;
    welcomeLead(body: {
        name: string;
        phone: string;
    }): Promise<any>;
    remindClass(body: {
        phone: string;
        studentName: string;
        groupName: string;
        dateTime: string;
        zoomLink: string;
    }): Promise<any>;
    confirmPayment(body: {
        phone: string;
        studentName: string;
        amount: string;
        method: string;
    }): Promise<any>;
}
