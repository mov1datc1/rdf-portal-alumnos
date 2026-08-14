const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres.fhbjfyivpkwlpefzmfit:2TIhX0drIFamqoh7@aws-1-us-east-2.pooler.supabase.com:5432/postgres' });
async function run() {
  await client.connect();
  const hosts = await client.query('SELECT * FROM "ZoomHost"');
  console.log('ZOOM HOSTS:', JSON.stringify(hosts.rows, null, 2));
  const levels = await client.query('SELECT id, name, "zoomHostId", "zoomLink" FROM "Level"');
  console.log('LEVELS ZOOM:', JSON.stringify(levels.rows, null, 2));
  await client.end();
}
run();
