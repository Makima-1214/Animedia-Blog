# ⚡ Quick Start - Animedia Blog

## 🚀 Setup dalam 5 Menit

### 1️⃣ Install Dependencies
```bash
npm install
```

### 2️⃣ Setup Gmail untuk Email Verification

**Kenapa perlu Gmail?**
Sistem registrasi mengirim kode verifikasi 6 digit via email.

**Langkah cepat:**

1. **Aktifkan 2FA** → https://myaccount.google.com/security
2. **Buat App Password** → https://myaccount.google.com/apppasswords
   - Pilih: Mail → Other → "Animedia Blog"
   - Copy password 16 karakter
3. **Update .env:**
   ```env
   EMAIL_USER=emailkamu@gmail.com
   EMAIL_PASSWORD=abcd efgh ijkl mnop
   ```

📖 Detail lengkap: Baca `EMAIL_SETUP.md`

### 3️⃣ Initialize Database
```bash
npm run db:seed
```

### 4️⃣ Run Server
```bash
npm run dev
```

Buka: http://localhost:4321

---

## ✅ Test Fitur Utama

### Test 1: Registrasi dengan Email Verification
1. Buka: http://localhost:4321/register
2. Daftar dengan email asli
3. Cek inbox → copy kode 6 digit
4. Paste kode → auto-login
5. Cek email lagi → dapat welcome email ✉️

### Test 2: Login & Comment
1. Login dengan akun yang sudah verified
2. Buka artikel
3. Tulis komentar
4. Komentar muncul dengan nama user

### Test 3: Dashboard Admin
1. Buka: http://localhost:4321/admin/login
2. Login: `admin` / `admin123`
3. Lihat statistik real-time
4. Buat artikel baru
5. Approve/reject komentar

### Test 4: Subscribe Newsletter
1. Buka: http://localhost:4321/berlangganan
2. Masukkan email
3. Cek database: `node scripts/check-all-data.js`

---

## 📁 File Penting

| File | Fungsi |
|------|--------|
| `.env` | Konfigurasi email & API keys |
| `EMAIL_SETUP.md` | Panduan setup Gmail lengkap |
| `README.md` | Dokumentasi lengkap |
| `data/blog.db` | Database SQLite |
| `scripts/check-all-data.js` | Cek isi database |

---

## 🔧 Perintah Berguna

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build production
npm run preview          # Preview production

# Database
npm run db:seed          # Seed database
node scripts/check-all-data.js  # Cek data

# Reset data
node scripts/reset-views.js     # Reset views
node scripts/set-subscribers.js reset  # Reset subscribers
```

---

## 🐛 Masalah Umum

### ❌ Email tidak terkirim
**Solusi:** Cek `.env` → pastikan `EMAIL_USER` dan `EMAIL_PASSWORD` sudah diisi.

### ❌ "Invalid login" error
**Solusi:** App Password salah. Buat ulang di https://myaccount.google.com/apppasswords

### ❌ Kode verifikasi expired
**Solusi:** Klik "Kirim Ulang Kode" di halaman verifikasi.

### ❌ Email masuk Spam
**Solusi:** Normal untuk email pertama. Cek folder Spam.

---

## 🎯 Fitur Lengkap

### User Features
- ✅ Registrasi dengan email verification
- ✅ Login & logout
- ✅ Edit profil
- ✅ Baca artikel
- ✅ Komentar artikel
- ✅ Subscribe newsletter

### Admin Features
- ✅ Dashboard dengan statistik real-time
- ✅ CRUD artikel (create, read, update, delete)
- ✅ CRUD kategori
- ✅ Approve/reject komentar
- ✅ Pengaturan site
- ✅ Upload gambar (Cloudinary)

### Technical Features
- ✅ SQLite database
- ✅ Email verification (Gmail)
- ✅ Session management
- ✅ Password hashing
- ✅ Responsive design
- ✅ View transitions
- ✅ Real-time statistics

---

## 📞 Butuh Bantuan?

1. **Email tidak terkirim?** → Baca `EMAIL_SETUP.md`
2. **Error lain?** → Lihat `README.md` bagian Troubleshooting
3. **Masih bingung?** → Tanya aja! 😊

---

**Selamat mencoba! 🚀**
