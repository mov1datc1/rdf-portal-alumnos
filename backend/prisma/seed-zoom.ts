import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 3,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);

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
      } else {
        console.log(`  ⏭️  ${host.displayName} (${host.email}) already exists`);
      }
    } else {
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
