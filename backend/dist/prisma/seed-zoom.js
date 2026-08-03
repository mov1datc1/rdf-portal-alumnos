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
const pg_1 = require("pg");
const adapter_pg_1 = require("@prisma/adapter-pg");
const client_1 = require("@prisma/client");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
    max: 3,
});
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
const ZOOM_HOSTS = [
    {
        email: 'lesroisdufrancais1@gmail.com',
        displayName: 'Zoom 1',
        permanentLink: 'https://us06web.zoom.us/j/82504767144?pwd=jqSoMXiAR1bT9uyrmpoQXa8yUPK0Ve.1',
    },
    {
        email: 'lesroisdufrancais2@gmail.com',
        displayName: 'Zoom 2',
        permanentLink: 'https://us06web.zoom.us/j/82215134270?pwd=b990FIIUT7GfjOiiwJzIVQsEnmYILi.1',
    },
    {
        email: 'lesroisdufrancais3@gmail.com',
        displayName: 'Zoom 3',
        permanentLink: 'https://us05web.zoom.us/j/84233465057?pwd=2OCWiPfJyykCZuqff3O7gWAKApMm1s.1',
    },
    {
        email: 'lesroisdufrancais4@gmail.com',
        displayName: 'Zoom 4',
        permanentLink: 'https://us05web.zoom.us/j/84889995683?pwd=dBfyg9FyUTT8OxaAjEwcQjJP2smNRS.1',
    },
    {
        email: 'lesroisdufrancais5@gmail.com',
        displayName: 'Zoom 5',
        permanentLink: 'https://us05web.zoom.us/j/89065924679?pwd=sZKtat0c0jxMz3B6foluqu91ipfwt2.1',
    },
    {
        email: 'lesroisdufrancais6@gmail.com',
        displayName: 'Zoom 6',
        permanentLink: 'https://us06web.zoom.us/j/82022556077?pwd=KTmOm0BjJNBNdEQD06taK2dYbtHMmX.1',
    },
];
async function main() {
    console.log('🔄 Seeding 6 Zoom permanent links...');
    for (const host of ZOOM_HOSTS) {
        const existing = await prisma.zoomHost.findUnique({ where: { email: host.email } });
        if (existing) {
            if (!existing.permanentLink) {
                await prisma.zoomHost.update({
                    where: { id: existing.id },
                    data: { permanentLink: host.permanentLink },
                });
                console.log(`  ✅ Updated ${host.displayName} (${host.email}) with permanent link`);
            }
            else {
                console.log(`  ⏭️  ${host.displayName} (${host.email}) already exists`);
            }
        }
        else {
            await prisma.zoomHost.create({ data: host });
            console.log(`  ✅ Created ${host.displayName} (${host.email})`);
        }
    }
    console.log('✅ Zoom seed complete!');
}
main()
    .catch(console.error)
    .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
});
//# sourceMappingURL=seed-zoom.js.map