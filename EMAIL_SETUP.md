# 📧 Setup Email Verification dengan Gmail

Sistem email verification sudah siap! Anda hanya perlu konfigurasi Gmail untuk mengirim email asli.

## ✅ Fitur yang Sudah Ada

1. **Registrasi dengan Email Verification**
   - User register → dapat kode 6 digit via email
   - Kode berlaku 15 menit
   - Email belum verified tidak bisa login

2. **Halaman Verifikasi**
   - Input kode 6 digit
   - Tombol kirim ulang kode
   - Auto-login setelah verifikasi

3. **Email Templates**
   - Email verifikasi dengan kode
   - Email welcome setelah verifikasi
   - Design modern & responsive

## 🔧 Cara Setup Gmail (5 Menit)

### Step 1: Aktifkan 2-Factor Authentication

1. Buka: https://myaccount.google.com/security
2. Cari "2-Step Verification"
3. Klik "Get Started" dan ikuti instruksi
4. Verifikasi dengan nomor HP Anda

### Step 2: Buat App Password

1. Buka: https://myaccount.google.com/apppasswords
2. Login jika diminta
3. Di "Select app" → pilih "Mail"
4. Di "Select device" → pilih "Other (Custom name)"
5. Ketik: "Animedia Blog"
6. Klik "Generate"
7. **COPY password 16 karakter** (contoh: `abcd efgh ijkl mnop`)
8. Simpan password ini (tidak bisa dilihat lagi)

### Step 3: Update File .env

Buka file `.env` di root project, update baris ini:

```env
# Email Configuration (Gmail)
EMAIL_USER=emailkamu@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
```

**Ganti:**
- `emailkamu@gmail.com` → email Gmail Anda
- `abcd efgh ijkl mnop` → App Password dari Step 2

**PENTING:** 
- Gunakan App Password, BUKAN password Gmail biasa
- Jangan hapus spasi di App Password (biarkan seperti `abcd efgh ijkl mnop`)

### Step 4: Restart Server

```bash
# Stop server (Ctrl+C)
# Start lagi
npm run dev
```

## 🧪 Cara Test

### 1. Test Registrasi

1. Buka: http://localhost:4321/register
2. Isi form:
   - Nama: Test User
   - Email: emailtestmu@gmail.com (gunakan email asli)
   - Password: test123
3. Klik "Daftar"
4. Cek inbox email Anda
5. Copy kode 6 digit

### 2. Test Verifikasi

1. Setelah register, otomatis redirect ke `/verify-email`
2. Paste kode 6 digit dari email
3. Klik "Verifikasi Email"
4. Jika berhasil → auto-login & redirect ke home
5. Cek email lagi → dapat welcome email

### 3. Test Kirim Ulang Kode

1. Di halaman verify-email
2. Klik "Kirim Ulang Kode"
3. Cek email → dapat kode baru
4. Kode lama tidak berlaku lagi

### 4. Test Login

1. Logout dulu
2. Coba login dengan email yang belum verified → ditolak
3. Login dengan email yang sudah verified → berhasil

## 🐛 Troubleshooting

### Email tidak terkirim?

**Cek 1: App Password benar?**
```bash
# Lihat .env
cat .env | grep EMAIL
```
Pastikan EMAIL_USER dan EMAIL_PASSWORD sudah diisi.

**Cek 2: 2FA sudah aktif?**
- Buka: https://myaccount.google.com/security
- Pastikan "2-Step Verification" ON

**Cek 3: Lihat error di console**
```bash
# Jalankan server, lihat error
npm run dev
```
Jika ada error "Invalid login", berarti App Password salah.

**Cek 4: Gmail memblokir?**
- Buka: https://myaccount.google.com/notifications
- Lihat apakah ada notifikasi "Blocked sign-in attempt"
- Jika ada, klik "Yes, it was me"

### Kode verifikasi expired?

Kode berlaku 15 menit. Jika expired:
1. Klik "Kirim Ulang Kode"
2. Gunakan kode baru

### Email masuk ke Spam?

Normal untuk email pertama kali. Cek folder Spam/Junk.

## 📝 Catatan Penting

1. **App Password vs Password Biasa**
   - ❌ JANGAN gunakan password Gmail biasa
   - ✅ HARUS gunakan App Password (16 karakter)

2. **Keamanan**
   - Jangan share App Password
   - Jangan commit .env ke Git (sudah ada di .gitignore)

3. **Production**
   - Untuk production, gunakan email service profesional:
     - SendGrid (free 100 email/hari)
     - Mailgun (free 5000 email/bulan)
     - AWS SES (murah, $0.10 per 1000 email)

4. **Limit Gmail**
   - Gmail free: max 500 email/hari
   - Cukup untuk blog kecil-menengah

## 🎯 Flow Lengkap

```
1. User Register
   ↓
2. Sistem generate kode 6 digit
   ↓
3. Sistem kirim email dengan kode
   ↓
4. User buka email, copy kode
   ↓
5. User paste kode di halaman verify
   ↓
6. Sistem cek kode & expired time
   ↓
7. Jika valid → email_verified = true
   ↓
8. Auto-login & kirim welcome email
   ↓
9. User bisa login & comment
```

## 🚀 Siap Digunakan!

Setelah setup Gmail, sistem email verification langsung berfungsi:
- ✅ Registrasi kirim kode via email
- ✅ Verifikasi dengan kode 6 digit
- ✅ Kirim ulang kode jika expired
- ✅ Welcome email setelah verifikasi
- ✅ Login hanya untuk email verified

**Butuh bantuan?** Tanya aja! 😊
