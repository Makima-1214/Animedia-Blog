# ✅ Setup Checklist - Animedia Blog

Ikuti checklist ini untuk setup blog dengan email verification.

---

## 📋 Pre-Setup (5 menit)

### ☐ 1. Install Dependencies
```bash
npm install
```
**Expected:** Semua package terinstall tanpa error.

---

### ☐ 2. Setup Gmail App Password

#### Step 2.1: Aktifkan 2-Factor Authentication
- [ ] Buka: https://myaccount.google.com/security
- [ ] Cari "2-Step Verification"
- [ ] Klik "Get Started"
- [ ] Verifikasi dengan nomor HP
- [ ] Pastikan status: **ON** ✅

#### Step 2.2: Buat App Password
- [ ] Buka: https://myaccount.google.com/apppasswords
- [ ] Login jika diminta
- [ ] Di "Select app" → pilih **Mail**
- [ ] Di "Select device" → pilih **Other (Custom name)**
- [ ] Ketik: **Animedia Blog**
- [ ] Klik **Generate**
- [ ] **COPY** password 16 karakter (contoh: `abcd efgh ijkl mnop`)
- [ ] Simpan di notepad (tidak bisa dilihat lagi!)

#### Step 2.3: Update .env
- [ ] Buka file `.env` di root project
- [ ] Cari baris:
  ```env
  EMAIL_USER=your-email@gmail.com
  EMAIL_PASSWORD=your-app-password
  ```
- [ ] Ganti dengan:
  ```env
  EMAIL_USER=emailkamu@gmail.com
  EMAIL_PASSWORD=abcd efgh ijkl mnop
  ```
- [ ] **Save file**

**✅ Checklist:**
- [ ] 2FA aktif
- [ ] App Password sudah dibuat
- [ ] .env sudah diupdate
- [ ] File .env sudah disave

---

### ☐ 3. Initialize Database
```bash
npm run db:seed
```
**Expected:** 
```
✓ Database seeded successfully
✓ Created 10 articles
✓ Created 5 categories
```

---

### ☐ 4. Start Development Server
```bash
npm run dev
```
**Expected:**
```
🚀 astro v5.x.x started in Xms
┃ Local    http://localhost:4321/
```

- [ ] Server running tanpa error
- [ ] Buka browser: http://localhost:4321
- [ ] Homepage muncul dengan artikel

---

## 🧪 Testing (10 menit)

### ☐ Test 1: Email Verification Flow

#### 1.1 Register User Baru
- [ ] Buka: http://localhost:4321/register
- [ ] Isi form:
  - **Nama:** Test User
  - **Email:** emailtestmu@gmail.com (gunakan email asli!)
  - **Password:** test123
- [ ] Klik **Daftar**
- [ ] Muncul alert: "Registrasi berhasil! Silakan cek email..."
- [ ] Redirect ke `/verify-email?email=...`

#### 1.2 Cek Email
- [ ] Buka inbox email yang didaftarkan
- [ ] Cari email dari "Animedia"
- [ ] Subject: "Verifikasi Email Anda - Animedia"
- [ ] Email berisi kode 6 digit (contoh: **123456**)
- [ ] **COPY kode tersebut**

**❌ Email tidak masuk?**
- Cek folder **Spam/Junk**
- Tunggu 1-2 menit
- Jika masih tidak ada, lihat [Troubleshooting](#troubleshooting)

#### 1.3 Verifikasi Email
- [ ] Kembali ke browser (halaman `/verify-email`)
- [ ] Paste kode 6 digit
- [ ] Klik **Verifikasi Email**
- [ ] Muncul alert: "Email berhasil diverifikasi!"
- [ ] Auto-login & redirect ke home
- [ ] Header menampilkan nama user & dropdown

#### 1.4 Cek Welcome Email
- [ ] Cek inbox lagi
- [ ] Ada email baru: "Selamat Datang di Animedia! 🎉"
- [ ] Email berisi welcome message & button "Mulai Membaca"

**✅ Test 1 Passed!**

---

### ☐ Test 2: Resend Verification Code

#### 2.1 Register User Baru (Email Berbeda)
- [ ] Logout dulu (klik dropdown → Logout)
- [ ] Register dengan email berbeda
- [ ] Redirect ke `/verify-email`

#### 2.2 Resend Code
- [ ] **JANGAN** paste kode dari email
- [ ] Klik **Kirim Ulang Kode**
- [ ] Muncul alert: "Kode verifikasi baru telah dikirim..."
- [ ] Cek inbox → ada email baru dengan kode baru
- [ ] Paste kode baru → berhasil verify

**✅ Test 2 Passed!**

---

### ☐ Test 3: Login dengan Email Verified

#### 3.1 Logout & Login
- [ ] Logout dari akun
- [ ] Buka: http://localhost:4321/login
- [ ] Login dengan email yang sudah verified
- [ ] Password: test123
- [ ] Klik **Masuk**
- [ ] Berhasil login & redirect ke home

**✅ Test 3 Passed!**

---

### ☐ Test 4: Login dengan Email Belum Verified (Should Fail)

#### 4.1 Register Tanpa Verify
- [ ] Register user baru
- [ ] **JANGAN** verify email (close tab)

#### 4.2 Coba Login
- [ ] Buka: http://localhost:4321/login
- [ ] Login dengan email yang belum verified
- [ ] Muncul alert: "Email belum diverifikasi"
- [ ] Login **ditolak** ❌

**✅ Test 4 Passed!**

---

### ☐ Test 5: Comment Artikel (Logged In User)

#### 5.1 Login & Comment
- [ ] Login dengan akun verified
- [ ] Buka artikel: http://localhost:4321/artikel/masa-depan-ai-2024
- [ ] Scroll ke bawah → form komentar
- [ ] Tulis komentar: "Test comment dari user"
- [ ] Klik **Kirim Komentar**
- [ ] Komentar muncul dengan nama user

**✅ Test 5 Passed!**

---

### ☐ Test 6: Dashboard Admin

#### 6.1 Admin Login
- [ ] Buka: http://localhost:4321/admin/login
- [ ] Username: **admin**
- [ ] Password: **admin123**
- [ ] Klik **Masuk**
- [ ] Redirect ke dashboard

#### 6.2 Cek Statistik
- [ ] Dashboard menampilkan:
  - Total Postingan
  - Total Pembaca (views)
  - Total Pengguna (jumlah user registered)
  - Total Komentar
  - Chart 7 hari terakhir
- [ ] Semua data **real-time** dari database

#### 6.3 Approve Komentar
- [ ] Klik menu **Komentar**
- [ ] Lihat komentar dari Test 5
- [ ] Status: **Pending**
- [ ] Klik **Approve**
- [ ] Status berubah: **Approved**

**✅ Test 6 Passed!**

---

### ☐ Test 7: Subscribe Newsletter

#### 7.1 Subscribe
- [ ] Buka: http://localhost:4321/berlangganan
- [ ] Masukkan email: newsletter@test.com
- [ ] Klik **Berlangganan**
- [ ] Muncul alert: "Terima kasih telah berlangganan!"

#### 7.2 Cek Database
```bash
node scripts/check-all-data.js
```
- [ ] Lihat section **Subscribers**
- [ ] Email `newsletter@test.com` ada di list

**✅ Test 7 Passed!**

---

## 🎉 All Tests Passed!

Jika semua test di atas berhasil, berarti setup sudah **100% lengkap**!

---

## 🐛 Troubleshooting

### ❌ Email tidak terkirim

**Cek 1: .env sudah benar?**
```bash
cat .env | grep EMAIL
```
Output harus:
```
EMAIL_USER=emailkamu@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
```

**Cek 2: 2FA aktif?**
- Buka: https://myaccount.google.com/security
- Pastikan "2-Step Verification" **ON**

**Cek 3: App Password benar?**
- Buka: https://myaccount.google.com/apppasswords
- Buat ulang App Password
- Update .env dengan password baru
- Restart server: `npm run dev`

**Cek 4: Lihat error di console**
```bash
npm run dev
# Register user baru
# Lihat error di terminal
```
Jika ada error "Invalid login", berarti App Password salah.

---

### ❌ Kode verifikasi expired

**Solusi:**
- Klik "Kirim Ulang Kode" di halaman verify-email
- Gunakan kode baru (kode lama tidak berlaku)

---

### ❌ Email masuk Spam

**Solusi:**
- Cek folder Spam/Junk
- Mark email as "Not Spam"
- Email berikutnya akan masuk Inbox

---

### ❌ Server error saat register

**Cek database:**
```bash
# Cek apakah users table ada
node scripts/check-all-data.js
```

**Reset database:**
```bash
rm data/blog.db
npm run db:seed
```

---

## 📚 Dokumentasi Lengkap

- **Quick Start:** `QUICK_START.md`
- **Email Setup:** `EMAIL_SETUP.md`
- **Email Flow:** `EMAIL_FLOW.md`
- **Full Docs:** `README.md`

---

## ✅ Final Checklist

- [ ] Dependencies installed
- [ ] Gmail App Password configured
- [ ] .env updated
- [ ] Database seeded
- [ ] Server running
- [ ] Test 1: Email verification ✅
- [ ] Test 2: Resend code ✅
- [ ] Test 3: Login verified ✅
- [ ] Test 4: Login unverified (fail) ✅
- [ ] Test 5: Comment artikel ✅
- [ ] Test 6: Dashboard admin ✅
- [ ] Test 7: Subscribe newsletter ✅

**🎊 Selamat! Blog Animedia siap digunakan!**
