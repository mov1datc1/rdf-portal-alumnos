"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const openai_1 = __importDefault(require("openai"));
const prisma_service_1 = require("../prisma.service");
let AiService = class AiService {
    prisma;
    openai;
    constructor(prisma) {
        this.prisma = prisma;
        this.openai = new openai_1.default({
            apiKey: process.env.OPENAI_API_KEY || 'placeholder',
        });
    }
    async processChat(email, message) {
        const user = await this.prisma.user.findUnique({
            where: { email: email },
            include: {
                currentLevel: true,
            }
        });
        const upcomingClasses = user?.currentLevelId ? await this.prisma.resource.findMany({
            where: {
                type: 'LIVE_CLASS',
                module: { levelId: user.currentLevelId },
                scheduledAt: { gte: new Date() }
            },
            orderBy: { scheduledAt: 'asc' },
            take: 5,
        }) : [];
        const classesList = upcomingClasses.length > 0
            ? upcomingClasses.map(c => `- ${c.title} (Fecha: ${c.scheduledAt?.toLocaleString()})`).join('\n      ')
            : 'No hay clases programadas actualmente.';
        const progress = user ? await this.prisma.userProgress.findFirst({
            where: { userId: user.id },
            orderBy: { lastAccessedAt: 'desc' }
        }) : null;
        const systemPrompt = `
      Eres 'Assistant Les Rois', el asistente virtual exclusivo de la academia de francés Les Rois Du Français.
      Tu tono es profesional, premium, amigable y siempre inicias saludando brevemente en francés (ej. Bonjour, Salut).
      
      CONTEXTO REAL DEL ALUMNO:
      - Nombre: ${user?.firstName || 'Alumno'}
      - Nivel actual: ${user?.currentLevel?.name || 'Por definir'}
      - Próximas clases programadas:
      ${classesList}
      - Último progreso registrado: ${progress?.score || 0}%
      
      REGLAS:
      - Responde a las preguntas del alumno basándote ESTRICTAMENTE en su contexto.
      - Si preguntan por sus próximas clases, dales los datos exactos que tienes arriba.
      - Si preguntan cuál sigue después de una clase, lee cuidadosamente la lista de "Próximas clases programadas" en orden cronológico para responder.
      - No inventes clases ni horarios que no estén en el contexto.
      - Sé muy conciso y directo (máximo 2-3 oraciones).
    `;
        try {
            const response = await this.openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: message }
                ],
                temperature: 0.7,
                max_tokens: 150,
            });
            return {
                reply: response.choices[0].message.content,
            };
        }
        catch (error) {
            console.error('Error con OpenAI:', error);
            return { reply: 'Désolé, estoy teniendo problemas técnicos en este momento. Intenta de nuevo.' };
        }
    }
};
exports.AiService = AiService;
exports.AiService = AiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AiService);
//# sourceMappingURL=ai.service.js.map