import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 3,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'andrea@example.com' },
    update: {},
    create: {
      email: 'andrea@example.com',
      firstName: 'Andrea',
      lastName: 'García',
      role: 'STUDENT',
    },
  });

  const level = await prisma.level.create({
    data: {
      name: 'B1 · Intermedio',
      totalScoreTarget: 100,
    },
  });

  const module = await prisma.module.create({
    data: {
      levelId: level.id,
      title: 'Módulo 1: Presentaciones complejas',
      orderIndex: 1,
    },
  });

  const resource = await prisma.resource.create({
    data: {
      moduleId: module.id,
      title: 'Taller de Conversación B1',
      type: 'LIVE_CLASS',
      url: 'https://zoom.us/j/123456789',
      durationExpected: 3600,
      scheduledAt: new Date(Date.now() + 86400000), // Tomorrow
    },
  });

  await prisma.userProgress.create({
    data: {
      userId: user.id,
      resourceId: resource.id,
      status: 'IN_PROGRESS',
      score: 85,
    },
  });

  console.log('✅ Base de datos poblada con datos de prueba');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
