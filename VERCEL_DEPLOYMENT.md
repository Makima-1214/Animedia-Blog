# 🚀 Panduan Deploy ke Vercel

## ⚠️ PENTING: Migrasi Database

Aplikasi ini menggunakan **SQLite** yang **TIDAK BISA** digunakan di Vercel (serverless environment). Anda perlu migrasi ke database cloud terlebih dahulu.

### Pilihan Database Cloud (Gratis):

1. **Turso** (SQLite di cloud) - Paling mudah migrasi
   - Website: https://turso.tech
   - Free tier: 500 databases, 9GB storage
   - Compatible dengan SQLite syntax

2. **Neon** (PostgreSQL)
   - Website: https://neon.tech
   - Free tier: 10GB storage
   - Perlu ubah query SQL

3. **PlanetScale** (MySQL)
   - Website: https://planetscale.com
   - Free tier: 5GB storage
   - Perlu ubah query SQL

## 📋 Langkah Deploy

### 1. Install Vercel Adapter

```bash
npm install @astrojs/vercel
```

### 2. Update package.json

Tambahkan adapter Vercel ke dependencies (sudah dilakukan di astro.config.mjs).

### 3. Setup Environment Variables di Vercel

Setelah connect repository ke Vercel, tambahkan environment variables:

**Settings → Environment Variables**

```
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

GOOGLE_SITE_VERIFICATION=your-verification-code

# Tambahkan database URL sesuai provider yang dipilih
DATABASE_URL=your-database-url
```

### 4. Deploy ke Vercel

#### Opsi A: Via Vercel Dashboard (Paling Mudah)

1. Login ke https://vercel.com
2. Klik "Add New Project"
3. Import repository GitHub/GitLab/Bitbucket
4. Vercel akan auto-detect Astro
5. Tambahkan environment variables
6. Klik "Deploy"

#### Opsi B: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy production
vercel --prod
```

### 5. Update Site URL

Setelah deploy, update `site` di `astro.config.mjs`:

```javascript
export default defineConfig({
  site: 'https://your-project.vercel.app', // atau custom domain
  // ...
});
```

## 🔧 Troubleshooting

### Build Error: "Cannot find module 'better-sqlite3'"

Ini normal karena SQLite tidak bisa digunakan di Vercel. Solusi:

1. Migrasi ke database cloud (Turso/Neon/PlanetScale)
2. Update semua file di `src/lib/` yang menggunakan SQLite
3. Update semua API endpoints yang query database

### Error: "Module not found"

Pastikan semua dependencies ada di `package.json`, bukan di `devDependencies`.

### Cold Start Lambat

Vercel serverless functions memiliki cold start. Untuk mengurangi:

1. Gunakan Edge Functions jika memungkinkan
2. Optimalkan bundle size
3. Gunakan ISR (Incremental Static Regeneration) untuk halaman statis

## 📊 Monitoring

Setelah deploy, monitor aplikasi di:

- **Vercel Dashboard**: Analytics, Logs, Performance
- **Vercel Speed Insights**: https://vercel.com/docs/speed-insights
- **Vercel Web Analytics**: https://vercel.com/docs/analytics

## 🌐 Custom Domain

1. Buka project di Vercel Dashboard
2. Settings → Domains
3. Tambahkan domain custom
4. Update DNS records sesuai instruksi Vercel
5. Update `site` di `astro.config.mjs`

## 💡 Tips Optimasi

1. **Gunakan Edge Functions** untuk API yang sering diakses
2. **Enable Caching** untuk static assets
3. **Compress Images** dengan Cloudinary transformations
4. **Lazy Load** components yang berat
5. **Prerender** halaman statis jika memungkinkan

## 📚 Resources

- [Astro Vercel Adapter Docs](https://docs.astro.build/en/guides/deploy/vercel/)
- [Vercel Documentation](https://vercel.com/docs)
- [Turso Migration Guide](https://docs.turso.tech/tutorials/migrate-from-sqlite)
