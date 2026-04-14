# 🎯 START HERE - Animedia Blog

## 👋 Selamat Datang!

Ini adalah **Animedia Blog Platform** - blog modern dengan sistem email verification lengkap.

---

## ⚡ Setup Super Cepat (5 Menit)

### Step 1: Install 📦
```bash
npm install
```

### Step 2: Setup Gmail 📧
1. Buka: https://myaccount.google.com/apppasswords
2. Buat App Password
3. Copy password 16 karakter
4. Update `.env`:
   ```env
   EMAIL_USER=emailkamu@gmail.com
   EMAIL_PASSWORD=abcd efgh ijkl mnop
   ```

### Step 3: Database 💾
```bash
npm run db:seed
```

### Step 4: Run 🚀
```bash
npm run dev
```

### Step 5: Test ✅
1. Buka: http://localhost:4321/register
2. Daftar dengan email asli
3. Cek inbox → copy kode
4. Paste kode → done! 🎉

---

## 📚 Dokumentasi Lengkap

### 🆕 Baru Pertama Kali?
👉 **Baca:** [QUICK_START.md](QUICK_START.md)

### ✅ Mau Follow Checklist?
👉 **Baca:** [CHECKLIST.md](CHECKLIST.md)

### 📧 Email Tidak Berfungsi?
👉 **Baca:** [EMAIL_SETUP.md](EMAIL_SETUP.md)

### 🚀 Mau Deploy Production?
👉 **Baca:** [PRODUCTION.md](PRODUCTION.md)

### 📖 Mau Baca Semua Docs?
👉 **Baca:** [DOCS_INDEX.md](DOCS_INDEX.md)

---

## 🎯 Fitur Utama

### ✅ User Features
- 📝 Registrasi dengan email verification
- 🔐 Login & logout
- 👤 Edit profil
- 📰 Baca artikel
- 💬 Komentar artikel
- 📧 Subscribe newsletter

### ✅ Admin Features
- 📊 Dashboard real-time
- ✍️ CRUD artikel
- 🏷️ CRUD kategori
- ✅ Approve/reject komentar
- ⚙️ Pengaturan site
- 🖼️ Upload gambar

---

## 🐛 Masalah?

### ❌ Email tidak terkirim?
```bash
# Cek .env
cat .env | grep EMAIL

# Pastikan sudah diisi:
EMAIL_USER=emailkamu@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
```

📖 **Detail:** [EMAIL_SETUP.md](EMAIL_SETUP.md#troubleshooting)

### ❌ Kode expired?
Klik "Kirim Ulang Kode" di halaman verifikasi.

### ❌ Error lain?
📖 **Baca:** [CHECKLIST.md](CHECKLIST.md#troubleshooting)

---

## 🗺️ Roadmap

### ✅ Done
- Custom authentication
- Email verification
- Real-time dashboard
- Mobile responsive
- Complete documentation

### 🔜 Coming Soon
- Forgot password
- Social login
- Advanced analytics
- Email automation

---

## 📞 Butuh Bantuan?

1. **Setup pertama kali?** → [QUICK_START.md](QUICK_START.md)
2. **Email issues?** → [EMAIL_SETUP.md](EMAIL_SETUP.md)
3. **Testing?** → [CHECKLIST.md](CHECKLIST.md)
4. **Production?** → [PRODUCTION.md](PRODUCTION.md)
5. **Semua docs?** → [DOCS_INDEX.md](DOCS_INDEX.md)

---

## 🚀 Siap Mulai?

### Option 1: Quick Start (5 menit)
```bash
npm install
# Update .env dengan Gmail App Password
npm run db:seed
npm run dev
```

### Option 2: Follow Checklist (10 menit)
📖 Baca: [CHECKLIST.md](CHECKLIST.md)

### Option 3: Baca Dokumentasi Lengkap
📖 Baca: [README.md](README.md)

---

## 🎉 Selamat Mencoba!

**Animedia Blog** - Built with ❤️ using Astro

---

**Quick Links:**
- 📖 [Full Documentation](README.md)
- ⚡ [Quick Start](QUICK_START.md)
- ✅ [Setup Checklist](CHECKLIST.md)
- 📧 [Email Setup](EMAIL_SETUP.md)
- 🚀 [Production Guide](PRODUCTION.md)
- 📚 [All Docs Index](DOCS_INDEX.md)
