import bcrypt from 'bcryptjs';
import { createClient } from '@libsql/client';
import { readFileSync } from 'fs';

// Load .env
const env = readFileSync('.env', 'utf-8');
env.split('\n').forEach(line => {
  const [key, ...val] = line.split('=');
  if (key && val.length) process.env[key.trim()] = val.join('=').trim();
});

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// Ganti nilai ini sebelum menjalankan script
const currentUsername = 'admin';
const newUsername = process.env.NEW_ADMIN_USERNAME || 'admin';
const newPassword = process.env.NEW_ADMIN_PASSWORD;

if (!newPassword) {
  console.error('❌ Set NEW_ADMIN_PASSWORD di .env sebelum menjalankan script ini');
  process.exit(1);
}

async function updateAdmin() {
  try {
    const hash = await bcrypt.hash(newPassword, 10);
    await db.execute({
      sql: 'UPDATE admins SET username = ?, password = ? WHERE username = ?',
      args: [newUsername, hash, currentUsername]
    });
    console.log('✅ Admin credentials berhasil diupdate!');
    console.log('   Username: ' + newUsername);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

updateAdmin();
