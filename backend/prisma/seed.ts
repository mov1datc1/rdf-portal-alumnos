import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 3,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  let authUserId: string | null = null;

  if (supabaseUrl && supabaseServiceKey) {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const { data: usersData, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) {
    console.error('Error al listar usuarios de Supabase auth:', listError);
  }

  const existingAuthUser = usersData?.users?.find((u) => u.email === 'andrea@example.com');

  if (existingAuthUser) {
    authUserId = existingAuthUser.id;
    const { error: updateError } = await supabase.auth.admin.updateUserById(authUserId, {
      password: 'LesRoisStudent2026!',
      email_confirm: true,
      user_metadata: {
        firstName: 'Andrea',
        lastName: 'García',
        role: 'STUDENT',
      },
    });
    if (updateError) {
      console.error('Error actualizando contraseña de Andrea en Supabase Auth:', updateError);
    } else {
      console.log('✅ Supabase Auth: Contraseña sincronizada para andrea@example.com (LesRoisStudent2026!)');
    }
  } else {
    const { data: createdAuth, error: createError } = await supabase.auth.admin.createUser({
      email: 'andrea@example.com',
      password: 'LesRoisStudent2026!',
      email_confirm: true,
      user_metadata: {
        firstName: 'Andrea',
        lastName: 'García',
        role: 'STUDENT',
      },
    });
    if (createError) {
      console.error('Error creando a Andrea en Supabase Auth:', createError);
    } else if (createdAuth?.user) {
      authUserId = createdAuth.user.id;
      console.log('✅ Supabase Auth: Usuario creado para andrea@example.com (LesRoisStudent2026!)');
    }
  }
}

  const user = await prisma.user.upsert({
    where: { email: 'andrea@example.com' },
    update: {
      firstName: 'Andrea',
      lastName: 'García',
      role: 'STUDENT',
      isActive: true,
    },
    create: {
      ...(authUserId ? { id: authUserId } : {}),
      email: 'andrea@example.com',
      firstName: 'Andrea',
      lastName: 'García',
      role: 'STUDENT',
      isActive: true,
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
