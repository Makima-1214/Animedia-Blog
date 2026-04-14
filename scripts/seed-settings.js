import { createClient } from '@libsql/client';
import { readFileSync } from 'fs';

const env = readFileSync('.env', 'utf-8');
env.split('\n').forEach(line => {
  const [key, ...val] = line.split('=');
  if (key && val.length) process.env[key.trim()] = val.join('=').trim();
});

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const defaults = [
  ['site_title', 'Animedia'],
  ['site_tagline', 'Portal Berita Teknologi & Pop Culture'],
  ['posts_per_page', '10'],
  ['pagination_style', 'numbers'],
  ['homepage_display', 'latest'],
  ['allow_comments', 'true'],
  ['nested_comments', 'false'],
  ['manual_approval', 'true'],
  ['maintenance_mode', 'false'],
  ['breaking_news', 'Sony mengonfirmasi pengembangan konsol genggam generasi terbaru • Apple Vision Pro resmi masuk Indonesia • Tesla luncurkan Model 2 dengan harga terjangkau']
];

for (const [key, value] of defaults) {
  await db.execute({ sql: `INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)`, args: [key, value] });
}

console.log('✅ Settings seeded');
process.exit(0);
