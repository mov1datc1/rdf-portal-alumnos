const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres.fhbjfyivpkwlpefzmfit:2TIhX0drIFamqoh7@aws-1-us-east-2.pooler.supabase.com:5432/postgres' });
async function run() {
  await client.connect();
  const res = await client.query('SELECT r.title, r."scheduledAt", u."firstName" as r_fn, u."lastName" as r_ln, l.name as level_name, lu."firstName" as l_fn, lu."lastName" as l_ln FROM "Resource" r LEFT JOIN "User" u ON r."teacherId" = u.id LEFT JOIN "Module" m ON r."moduleId" = m.id LEFT JOIN "Level" l ON m."levelId" = l.id LEFT JOIN "User" lu ON l."teacherId" = lu.id WHERE r.type = \'LIVE_CLASS\'');
  console.log('CLASSES:', res.rows);
  const levels = await client.query('SELECT l.name, u."firstName", u."lastName" FROM "Level" l LEFT JOIN "User" u ON l."teacherId" = u.id');
  console.log('LEVELS:', levels.rows);
  await client.end();
}
run();
