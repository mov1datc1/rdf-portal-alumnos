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
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
    max: 3,
});
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
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