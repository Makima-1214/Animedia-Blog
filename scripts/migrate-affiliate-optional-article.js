/**
 * Migration: buat article_id opsional di affiliate_products
 * Jalankan sekali: node scripts/migrate-affiliate-optional-article.js
 */
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

async function migrate() {
  console.log('🔧 Migrating affiliate_products...');

  // SQLite tidak support ALTER COLUMN, jadi recreate table
  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS affiliate_products_new (
      id TEXT PRIMARY KEY,
      article_id TEXT,
      name TEXT NOT NULL,
      description TEXT,
      image TEXT,
      price TEXT,
      affiliate_url TEXT NOT NULL,
      platform TEXT,
      is_active INTEGER DEFAULT 1,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    INSERT INTO affiliate_products_new
      SELECT id, article_id, name, description, image, price, affiliate_url, platform, is_active, sort_order, created_at
      FROM affiliate_products;

    DROP TABLE affiliate_products;

    ALTER TABLE affiliate_products_new RENAME TO affiliate_products;
  `);

  console.log('✅ Migration complete! article_id sekarang opsional.');
  process.exit(0);
}

migrate().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
