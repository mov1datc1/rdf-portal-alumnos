import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AiService {
  private openai: OpenAI;

  constructor(private prisma: PrismaService) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || 'placeholder',
    });
  }

  async processChat(email: string, message: string) {
    // 1. Recuperar contexto del alumno desde la base de datos
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

    // 2. Construir el Prompt del Sistema con Inyección de Contexto
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
      // 3. Llamada a OpenAI
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
    } catch (error) {
      console.error('Error con OpenAI:', error);
      return { reply: 'Désolé, estoy teniendo problemas técnicos en este momento. Intenta de nuevo.' };
    }
  }
}
