# Animedia - Blog Platform

Platform blog modern yang dibangun dengan Astro, SQLite, dan Tailwind CSS. Fokus pada performa, kesederhanaan, dan pengalaman pengguna yang baik.

---

## 🎯 Baru Pertama Kali? Mulai Di Sini!

👉 **[START_HERE.md](START_HERE.md)** - Setup dalam 5 menit!

📚 **[DOCS_INDEX.md](DOCS_INDEX.md)** - Index semua dokumentasi

---

## 🚀 Fitur Utama

### Frontend
- ✅ Halaman Home dengan featured articles
- ✅ Halaman Artikel (list & detail)
- ✅ Halaman Kategori
- ✅ Halaman Login & Register dengan Email Verification
- ✅ Halaman Profil
- ✅ Halaman Berlangganan
- ✅ Responsive design (mobile-first)
- ✅ View Transitions API untuk navigasi smooth

### Authentication & Security
- ✅ Custom authentication system (no third-party)
- ✅ Email verification dengan kode 6 digit
- ✅ Password hashing (SHA-256)
- ✅ Session management dengan cookies
- ✅ Email templates (verification & welcome)
- ✅ Resend verification code
- ✅ 15-minute code expiration

### Dashboard Admin
- ✅ Dashboard dengan statistik real-time
- ✅ Manajemen Artikel (CRUD)
- ✅ Manajemen Kategori (CRUD)
- ✅ Manajemen Komentar (approve/reject)
- ✅ Halaman Pengaturan
- ✅ Sidebar persistent (no glitch)

### Database & Data
- ✅ SQLite database
- ✅ Real-time statistics (views, subscribers, users, comments)
- ✅ Growth calculation (7 days vs previous 7 days)
- ✅ Daily views chart
- ✅ Activity feed
- ✅ Real-time article dates

## 📦 Tech Stack

- **Framework**: Astro 5.x
- **Database**: SQLite (better-sqlite3)
- **Styling**: Tailwind CSS + Material Symbols
- **Language**: TypeScript
- **Runtime**: Node.js

## 🛠️ Setup & Installation

### 1. Clone & Install
```bash
git clone <repository-url>
cd blogWebsite
npm install
```

### 2. Setup Email (WAJIB untuk Registrasi)

**Sistem email verification membutuhkan Gmail App Password:**

1. **Aktifkan 2-Factor Authentication**
   - Buka: https://myaccount.google.com/security
   - Aktifkan "2-Step Verification"

2. **Buat App Password**
   - Buka: https://myaccount.google.com/apppasswords
   - Pilih "Mail" → "Other (Custom name)"
   - Ketik: "Animedia Blog"
   - Copy password 16 karakter (contoh: `abcd efgh ijkl mnop`)

3. **Update .env**
   ```env
   EMAIL_USER=emailkamu@gmail.com
   EMAIL_PASSWORD=abcd efgh ijkl mnop
   ```

📖 **Panduan lengkap:** Baca file `EMAIL_SETUP.md`

### 3. Initialize Database
```bash
# Seed database dengan data awal
npm run db:seed

# Atau reset database
npm run db:reset
```

### 4. Run Development Server
```bash
npm run dev
```

Website akan berjalan di `http://localhost:4321`

### 5. Test Email Verification
1. Buka: http://localhost:4321/register
2. Daftar dengan email asli
3. Cek inbox → copy kode 6 digit
4. Paste kode di halaman verifikasi
5. Selesai! Auto-login & dapat welcome email

## 📁 Struktur Project

```
blogWebsite/
├── src/
│   ├── components/          # Komponen reusable
│   │   ├── Header.astro
│   │   └── DashboardSidebar.astro
│   ├── layouts/             # Layout templates
│   │   ├── BaseLayout.astro
│   │   └── DashboardLayout.astro
│   ├── pages/               # Halaman & routing
│   │   ├── index.astro      # Home
│   │   ├── artikel/         # Artikel pages
│   │   ├── kategori/        # Kategori pages
│   │   ├── dashboard/       # Admin dashboard
│   │   └── api/             # API endpoints
│   └── lib/                 # Utilities & helpers
│       ├── database.js      # Database connection
│       ├── db-helpers.js    # Database queries
│       └── auth.ts          # Authentication
├── db/
│   ├── config.ts            # Database schema
│   └── seed.ts              # Seed data
├── scripts/                 # Utility scripts
│   ├── check-all-data.js    # Check database data
│   ├── set-views.js         # Set article views
│   ├── set-subscribers.js   # Set subscribers
│   └── update-article-dates.js  # Update dates
├── data/
│   └── blog.db              # SQLite database
└── public/                  # Static assets
```

## 🗄️ Database Schema

### Tables
- **articles** - Artikel blog
- **categories** - Kategori artikel
- **comments** - Komentar artikel (linked to users)
- **subscribers** - Email subscribers
- **users** - Registered users (with email verification)
- **sessions** - User sessions
- **settings** - Site settings
- **admins** - Admin users (deprecated, use users table)

## 🔧 Utility Scripts

### Check Data
```bash
node scripts/check-all-data.js
```

### Manage Views
```bash
# Reset views to realistic numbers
node scripts/reset-views.js

# Set custom views
node scripts/set-views.js
```

### Manage Subscribers
```bash
# Reset subscribers to 0
node scripts/set-subscribers.js reset

# Add subscribers
node scripts/set-subscribers.js add 10
```

### Update Article Dates
```bash
node scripts/update-article-dates.js
```

## 🎨 Design System

### Colors (Material Design 3)
- **Primary**: Blue (#2563eb)
- **Secondary**: Purple
- **Tertiary**: Orange
- **Error**: Red
- **Surface**: White/Gray variants

### Typography
- **Headline**: Inter (bold, extrabold)
- **Body**: Inter (regular, medium)
- **Label**: Inter (uppercase, tracking-wide)

### Components
- Cards dengan shadow & rounded corners
- Buttons dengan hover states
- Forms dengan focus states
- Tables dengan hover rows
- Badges untuk status

## 🔐 Authentication

### User Registration & Login
- **Register**: `/register`
  - Email verification dengan kode 6 digit
  - Kode dikirim via email (Gmail)
  - Kode berlaku 15 menit
  - Auto-login setelah verifikasi
  
- **Login**: `/login`
  - Email + password
  - Hanya email verified yang bisa login
  - Session cookie (30 hari)

- **Profile**: `/profil`
  - Edit nama & email
  - Logout

### Admin Login
- URL: `/admin/login`
- Default credentials:
  - Username: `admin`
  - Password: `admin123`

### Session Management
- Cookie-based sessions
- User sessions: 30 days
- Admin sessions: expires on browser close
- Logout: `/api/auth/logout` (user) atau `/api/admin/logout` (admin)

## 📊 Dashboard Features

### Statistics
- Total Postingan
- Total Pembaca (views)
- Total Pengguna (registered users)
- Total Komentar
- Total Subscribers
- Growth percentage (7 days comparison)

### Charts
- Daily views (last 7 days)
- Category distribution

### Activity Feed
- Recent articles published
- Recent comments
- New subscribers

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deploy to Vercel/Netlify
1. Connect repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variables

## 📝 Content Management

### Create Article
1. Login ke dashboard
2. Klik "Buat Artikel Baru"
3. Isi form (title, slug, excerpt, content, category)
4. Pilih status (draft/published)
5. Klik "Simpan Artikel"

### Manage Categories
1. Dashboard → Kategori
2. Tambah kategori baru
3. Edit/hapus kategori existing

### Manage Comments
1. Dashboard → Komentar
2. Approve/reject comments
3. Delete spam comments

## 🐛 Troubleshooting

### Email Tidak Terkirim?

**1. Cek App Password**
```bash
cat .env | grep EMAIL
```
Pastikan `EMAIL_USER` dan `EMAIL_PASSWORD` sudah diisi dengan benar.

**2. Cek 2FA Gmail**
- Buka: https://myaccount.google.com/security
- Pastikan "2-Step Verification" aktif

**3. Lihat Error di Console**
```bash
npm run dev
# Lihat error saat register
```

**4. Cek Gmail Notifications**
- Buka: https://myaccount.google.com/notifications
- Jika ada "Blocked sign-in attempt", klik "Yes, it was me"

📖 **Panduan lengkap:** Baca file `EMAIL_SETUP.md`

### Database Issues
```bash
# Reset database
rm data/blog.db
npm run db:seed
```

### Port Already in Use
```bash
# Change port in package.json or use:
npm run dev -- --port 3000
```

### Build Errors
```bash
# Clear cache
rm -rf .astro node_modules
npm install
npm run build
```

## 📄 License

MIT License - feel free to use for personal or commercial projects.

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.

---

**Animedia** - Modern Blog Platform
Built with ❤️ using Astro
