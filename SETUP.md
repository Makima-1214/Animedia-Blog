# Setup Guide - Animedia

Panduan lengkap untuk setup project Animedia dari awal.

## Prerequisites

- Node.js 18+ 
- npm atau yarn
- Git

## Step-by-Step Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd blogWebsite
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Buat file `.env` di root folder:
```env
DATABASE_URL=./data/blog.db
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

### 4. Initialize Database
```bash
# Seed database dengan data awal (3 artikel, 5 kategori, 3 komentar)
npm run db:seed
```

Database akan dibuat di `data/blog.db` dengan:
- 1 admin user (username: admin, password: admin123)
- 5 kategori (Anime, Teknologi, Game, Film, Gadget)
- 3 artikel demo
- 3 komentar demo
- 0 subscribers
- 0 users

### 5. Run Development Server
```bash
npm run dev
```

Website akan berjalan di: `http://localhost:4321`

### 6. Login ke Dashboard
1. Buka `http://localhost:4321/admin/login`
2. Login dengan:
   - Username: `admin`
   - Password: `admin123`

## Database Management

### Reset Database
Jika ingin reset database ke kondisi awal:
```bash
# Hapus database lama
rm data/blog.db

# Seed ulang
npm run db:seed
```

### Check Database Data
```bash
node scripts/check-all-data.js
```

Output akan menampilkan:
- Total articles
- Total views
- Total users
- Total comments
- Total subscribers

### Manage Data

**Set Views:**
```bash
# Reset views ke angka realistis (20-150 per artikel)
node scripts/reset-views.js

# Set custom views
node scripts/set-views.js
```

**Set Subscribers:**
```bash
# Reset ke 0
node scripts/set-subscribers.js reset

# Tambah 10 subscribers
node scripts/set-subscribers.js add 10
```

**Update Article Dates:**
```bash
# Update tanggal artikel ke tanggal recent (relatif ke hari ini)
node scripts/update-article-dates.js
```

## Development Workflow

### 1. Create New Article
- Login ke dashboard
- Klik "Buat Artikel Baru"
- Isi form dan publish

### 2. Manage Categories
- Dashboard → Kategori
- Tambah/edit/hapus kategori

### 3. Manage Comments
- Dashboard → Komentar
- Approve/reject/delete comments

### 4. View Statistics
- Dashboard → Ringkasan
- Lihat statistik real-time

## Build for Production

```bash
# Build
npm run build

# Preview build
npm run preview
```

## Deployment

### Vercel
1. Push ke GitHub
2. Import project di Vercel
3. Set environment variables
4. Deploy

### Netlify
1. Push ke GitHub
2. Import project di Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Set environment variables
6. Deploy

## Troubleshooting

### Port Already in Use
```bash
npm run dev -- --port 3000
```

### Database Locked
```bash
# Tutup semua koneksi database
# Restart development server
npm run dev
```

### Build Errors
```bash
# Clear cache
rm -rf .astro node_modules
npm install
npm run build
```

### Module Not Found
```bash
npm install
```

## Next Steps

1. ✅ Setup selesai
2. ✅ Login ke dashboard
3. ✅ Buat artikel pertama
4. ✅ Customize design (colors, fonts)
5. ✅ Deploy ke production

---

Selamat! Animedia sudah siap digunakan 🎉
