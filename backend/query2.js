const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres.fhbjfyivpkwlpefzmfit:2TIhX0drIFamqoh7@aws-1-us-east-2.pooler.supabase.com:5432/postgres' });
async function run() {
  await client.connect();
  const res = await client.query('SELECT r.title, r."teacherId" as r_t, u."firstName" as r_fn, u."lastName" as r_ln FROM "Resource" r LEFT JOIN "User" u ON r."teacherId" = u.id WHERE r.type = \'LIVE_CLASS\'');
  console.log('CLASSES:', res.rows);
  const levels = await client.query('SELECT l.name, l."teacherId" as l_t, u."firstName" as l_fn, u."lastName" as l_ln FROM "Level" l LEFT JOIN "User" u ON l."teacherId" = u.id');
  console.log('LEVELS:', levels.rows);
  await client.end();
}
run();
