import { createClient } from '@libsql/client';
import { readFileSync } from 'fs';

// Load .env manually
const env = readFileSync('.env', 'utf-8');
env.split('\n').forEach(line => {
  const [key, ...val] = line.split('=');
  if (key && val.length) process.env[key.trim()] = val.join('=').trim();
});

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function init() {
  console.log('🔧 Creating tables...');

  const tables = [
    `CREATE TABLE IF NOT EXISTS admins (
      id TEXT PRIMARY KEY, username TEXT UNIQUE NOT NULL, password TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL, name TEXT NOT NULL, avatar TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY, name TEXT UNIQUE NOT NULL, slug TEXT UNIQUE NOT NULL,
      description TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS articles (
      id TEXT PRIMARY KEY, title TEXT NOT NULL, slug TEXT UNIQUE NOT NULL,
      excerpt TEXT NOT NULL, content TEXT NOT NULL, cover_image TEXT,
      category_id TEXT NOT NULL, status TEXT DEFAULT 'draft', views INTEGER DEFAULT 0,
      read_time INTEGER DEFAULT 5, published_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id)
    )`,
    `CREATE TABLE IF NOT EXISTS comments (
      id TEXT PRIMARY KEY, content TEXT NOT NULL, article_id TEXT NOT NULL,
      author_name TEXT NOT NULL, author_email TEXT NOT NULL, status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (article_id) REFERENCES articles(id)
    )`,
    `CREATE TABLE IF NOT EXISTS subscribers (
      id TEXT PRIMARY KEY, email TEXT UNIQUE NOT NULL, name TEXT,
      status TEXT DEFAULT 'active', created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY, username TEXT UNIQUE NOT NULL, email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL, name TEXT NOT NULL, email_verified INTEGER DEFAULT 0,
      verification_code TEXT, verification_expires DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP, last_login DATETIME
    )`,
    `CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY, user_id TEXT NOT NULL, expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`,
    `CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY, value TEXT NOT NULL, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS tags (
      id TEXT PRIMARY KEY, name TEXT UNIQUE NOT NULL, slug TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS article_tags (
      article_id TEXT NOT NULL, tag_id TEXT NOT NULL,
      PRIMARY KEY (article_id, tag_id),
      FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
      FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS affiliate_products (
      id TEXT PRIMARY KEY, article_id TEXT NOT NULL, name TEXT NOT NULL,
      description TEXT, image TEXT, price TEXT, affiliate_url TEXT NOT NULL,
      platform TEXT, is_active INTEGER DEFAULT 1, sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE
    )`
  ];

  for (const sql of tables) {
    await db.execute(sql);
  }
  console.log('✅ Tables created');

  // Settings
  const defaultSettings = [
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
  for (const [key, value] of defaultSettings) {
    await db.execute({ sql: `INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)`, args: [key, value] });
  }

  console.log('🌱 Seeding data...');

  // Admin - password akan di-hash saat login pertama kali
  await db.execute({
    sql: `INSERT INTO admins (id, username, password, email, name) VALUES (?, ?, ?, ?, ?)`,
    args: ['admin-1', 'admin', 'admin123', 'admin@animedia.com', 'Editor Utama']
  });
  console.log('⚠️  Admin password masih plaintext. Jalankan: node scripts/update-admin-turso.js setelah set NEW_ADMIN_PASSWORD di .env');

  // Categories
  const categories = [
    ['1', 'Anime', 'anime', 'Berita dan review anime terbaru'],
    ['2', 'Teknologi', 'teknologi', 'Update teknologi dan gadget'],
    ['3', 'Game', 'game', 'Berita gaming dan esports'],
    ['4', 'Film', 'film', 'Review dan berita film'],
    ['5', 'Gadget', 'gadget', 'Review gadget terbaru']
  ];
  for (const [id, name, slug, description] of categories) {
    await db.execute({ sql: `INSERT INTO categories (id, name, slug, description) VALUES (?, ?, ?, ?)`, args: [id, name, slug, description] });
  }

  // Articles
  await db.execute({
    sql: `INSERT INTO articles (id, title, slug, excerpt, content, cover_image, category_id, status, views, read_time, published_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: ['1', 'Revolusi Konsol Game di Era Cloud Computing 2024', 'revolusi-konsol-game-cloud-computing-2024',
      'Sony mengonfirmasi pengembangan konsol genggam generasi terbaru yang terintegrasi penuh dengan cloud gaming',
      '<p>Industri gaming mengalami transformasi besar dengan hadirnya teknologi cloud computing.</p>',
      'https://images.unsplash.com/photo-1486401899868-0e435ed85128?w=1200&h=600&fit=crop',
      '2', 'published', 12402, 8, '2024-10-24']
  });
  await db.execute({
    sql: `INSERT INTO articles (id, title, slug, excerpt, content, cover_image, category_id, status, views, read_time, published_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: ['2', 'Review Smartphone Gaming Mid-Range Terbaik Tahun Ini', 'review-smartphone-gaming-mid-range-2024',
      'Kami menguji 5 smartphone terbaru dengan performa maksimal namun dengan harga yang tetap terjangkau',
      '<p>Pasar smartphone gaming mid-range semakin kompetitif.</p>',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&h=600&fit=crop',
      '5', 'published', 9120, 5, '2024-10-18']
  });
  await db.execute({
    sql: `INSERT INTO articles (id, title, slug, excerpt, content, cover_image, category_id, status, views, read_time, published_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: ['3', 'Daftar Anime Musim Gugur 2024 yang Wajib Masuk Watchlist', 'anime-musim-gugur-2024-watchlist',
      'Dari kembalinya seri favorit hingga adaptasi manga populer yang sudah lama dinantikan penggemar',
      '<p>Musim gugur 2024 membawa banyak anime baru yang menarik.</p>',
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&h=600&fit=crop',
      '1', 'published', 7840, 8, '2024-10-15']
  });

  // Subscribers
  for (let i = 1; i <= 10; i++) {
    await db.execute({
      sql: `INSERT INTO subscribers (id, email, name, status) VALUES (?, ?, ?, ?)`,
      args: [`sub-${i}`, `subscriber${i}@example.com`, `User ${i}`, 'active']
    });
  }

  console.log('✅ Seed complete!');
  console.log('📝 Admin: username=admin, password=admin123');
  process.exit(0);
}

init().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
