"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const pg_1 = require("pg");
const adapter_pg_1 = require("@prisma/adapter-pg");
const supabase_js_1 = require("@supabase/supabase-js");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
    max: 3,
});
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
async function main() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    let authUserId = null;
    if (supabaseUrl && supabaseServiceKey) {
        const supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseServiceKey);
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
            }
            else {
                console.log('✅ Supabase Auth: Contraseña sincronizada para andrea@example.com (LesRoisStudent2026!)');
            }
        }
        else {
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
            }
            else if (createdAuth?.user) {
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
            scheduledAt: new Date(Date.now() + 86400000),
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
//# sourceMappingURL=seed.js.map