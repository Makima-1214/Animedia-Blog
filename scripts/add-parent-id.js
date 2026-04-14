import { createClient } from '@libsql/client';

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

try {
  await db.execute(`ALTER TABLE comments ADD COLUMN parent_id TEXT REFERENCES comments(id)`);
  console.log('✅ Kolom parent_id berhasil ditambahkan');
} catch (e) {
  if (e.message?.includes('duplicate column')) {
    console.log('ℹ️  Kolom parent_id sudah ada, skip');
  } else {
    console.error('❌ Error:', e.message);
  }
}
