# 📸 Visual Guide - Animedia Blog

Panduan visual untuk setup dan menggunakan Animedia Blog.

---

## 🎯 Setup Gmail App Password

### Step 1: Buka Google Account Security
```
URL: https://myaccount.google.com/security
```

**Yang harus Anda lihat:**
- ✅ "2-Step Verification" dengan status **ON**
- Jika OFF, klik dan aktifkan dulu

---

### Step 2: Buka App Passwords
```
URL: https://myaccount.google.com/apppasswords
```

**Tampilan yang benar:**
```
┌─────────────────────────────────────────┐
│  App passwords                          │
├─────────────────────────────────────────┤
│  Select app:  [Mail ▼]                  │
│  Select device: [Other (Custom name) ▼] │
│                                          │
│  Name: [Animedia Blog          ]        │
│                                          │
│  [Generate]                              │
└─────────────────────────────────────────┘
```

---

### Step 3: Copy App Password
```
┌─────────────────────────────────────────┐
│  Your app password for Animedia Blog    │
├─────────────────────────────────────────┤
│                                          │
│     abcd efgh ijkl mnop                  │
│                                          │
│  [Copy]                                  │
└─────────────────────────────────────────┘
```

**PENTING:** Copy password ini! Tidak bisa dilihat lagi.

---

### Step 4: Update .env File

**Lokasi file:** Root project → `.env`

**Sebelum:**
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

**Sesudah:**
```env
EMAIL_USER=emailkamu@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
```

**Save file!** (Ctrl+S / Cmd+S)

---

## 📧 Email Verification Flow

### 1. Register Page
```
┌─────────────────────────────────────────────┐
│              Animedia                       │
│         Daftar Akun Baru                    │
├─────────────────────────────────────────────┤
│                                             │
│  Nama Lengkap                               │
│  [John Doe                    ]             │
│                                             │
│  Email                                      │
│  [john@example.com            ]             │
│                                             │
│  Password                                   │
│  [••••••••                    ]             │
│                                             │
│  [        Daftar        ]                   │
│                                             │
│  Sudah punya akun? Masuk                    │
└─────────────────────────────────────────────┘
```

**URL:** http://localhost:4321/register

---

### 2. Email Inbox
```
┌─────────────────────────────────────────────┐
│  Gmail Inbox                                │
├─────────────────────────────────────────────┤
│                                             │
│  📧 Animedia                                │
│     Verifikasi Email Anda - Animedia        │
│     Halo, John Doe! Kode verifikasi...      │
│     2 minutes ago                           │
│                                             │
└─────────────────────────────────────────────┘
```

**Isi email:**
```
┌─────────────────────────────────────────────┐
│  Animedia                                   │
│  Portal Berita Teknologi & Pop Culture      │
├─────────────────────────────────────────────┤
│                                             │
│  Halo, John Doe! 👋                         │
│                                             │
│  Terima kasih telah mendaftar di Animedia.  │
│  Untuk menyelesaikan pendaftaran, silakan   │
│  verifikasi email Anda dengan memasukkan    │
│  kode berikut:                              │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │                                       │ │
│  │          1 2 3 4 5 6                  │ │
│  │                                       │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  Kode verifikasi ini berlaku selama         │
│  15 menit.                                  │
│                                             │
└─────────────────────────────────────────────┘
```

---

### 3. Verify Email Page
```
┌─────────────────────────────────────────────┐
│              Animedia                       │
│         Verifikasi Email                    │
├─────────────────────────────────────────────┤
│                                             │
│  📧                                         │
│                                             │
│  Kami telah mengirim kode verifikasi        │
│  ke email Anda                              │
│                                             │
│  Email: john@example.com                    │
│                                             │
│  Kode Verifikasi (6 digit)                  │
│  [  1  2  3  4  5  6  ]                     │
│                                             │
│  [    Verifikasi Email    ]                 │
│                                             │
│  Tidak menerima kode?                       │
│  Kirim Ulang Kode                           │
│                                             │
└─────────────────────────────────────────────┘
```

**URL:** http://localhost:4321/verify-email?email=john@example.com

---

### 4. Success & Welcome Email
```
┌─────────────────────────────────────────────┐
│  ✅ Email berhasil diverifikasi!            │
│     Selamat datang di Animedia.             │
└─────────────────────────────────────────────┘
```

**Auto-redirect ke:** http://localhost:4321/

**Welcome email:**
```
┌─────────────────────────────────────────────┐
│  🎉 Selamat Datang!                         │
├─────────────────────────────────────────────┤
│                                             │
│  Halo, John Doe!                            │
│                                             │
│  Akun Anda telah berhasil diverifikasi.     │
│  Selamat datang di komunitas Animedia!      │
│                                             │
│  Sekarang Anda dapat:                       │
│  ✅ Membaca artikel tanpa batas             │
│  ✅ Berkomentar di artikel                  │
│  ✅ Berlangganan newsletter                 │
│  ✅ Menyimpan artikel favorit               │
│                                             │
│  [    Mulai Membaca    ]                    │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 🏠 Homepage (Logged In)

```
┌─────────────────────────────────────────────────────────────┐
│  Animedia          Artikel  Kategori  Berlangganan          │
│                                                              │
│                                    John Doe ▼               │
│                                    • Profil                 │
│                                    • Logout                 │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  🔥 ARTIKEL TERBARU                                         │
│                                                              │
│  ┌──────────────────┐  ┌──────────────────┐               │
│  │ [Image]          │  │ [Image]          │               │
│  │                  │  │                  │               │
│  │ Masa Depan AI    │  │ Review Smartphone│               │
│  │ di 2024          │  │ Gaming Terbaik   │               │
│  │                  │  │                  │               │
│  │ Teknologi        │  │ Gadget           │               │
│  │ 7 Apr 2026       │  │ 7 Apr 2026       │               │
│  └──────────────────┘  └──────────────────┘               │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**URL:** http://localhost:4321/

---

## 📝 Article Detail (with Comments)

```
┌─────────────────────────────────────────────────────────────┐
│  Animedia          Artikel  Kategori  Berlangganan          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Teknologi                                                   │
│                                                              │
│  Masa Depan AI di 2024                                      │
│  7 Apr 2026 • 5 min read • 156 views                        │
│                                                              │
│  [Featured Image]                                            │
│                                                              │
│  Artificial Intelligence terus berkembang...                 │
│                                                              │
│  ─────────────────────────────────────────                  │
│                                                              │
│  💬 KOMENTAR (3)                                            │
│                                                              │
│  ┌────────────────────────────────────────┐                │
│  │ John Doe • 2 jam lalu                  │                │
│  │ Artikel yang sangat menarik!           │                │
│  └────────────────────────────────────────┘                │
│                                                              │
│  Tulis Komentar                                             │
│  ┌────────────────────────────────────────┐                │
│  │ Tulis komentar Anda...                 │                │
│  │                                        │                │
│  └────────────────────────────────────────┘                │
│  [Kirim Komentar]                                           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**URL:** http://localhost:4321/artikel/masa-depan-ai-2024

---

## 🎛️ Admin Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│  ☰  Animedia Dashboard                      Admin ▼         │
├──────────┬──────────────────────────────────────────────────┤
│          │                                                   │
│  📊 Dashboard                                                │
│  ✍️ Artikel  │  STATISTIK                                   │
│  🏷️ Kategori │                                               │
│  💬 Komentar │  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  ⚙️ Pengaturan│  │ 10       │  │ 311      │  │ 5        │  │
│          │  │ Postingan│  │ Pembaca  │  │ Pengguna │  │
│          │  └──────────┘  └──────────┘  └──────────┘  │
│          │                                                   │
│          │  CHART: Views (7 hari terakhir)                  │
│          │  ┌────────────────────────────────────┐          │
│          │  │     ▁▃▅▇█▇▅                        │          │
│          │  └────────────────────────────────────┘          │
│          │                                                   │
│          │  AKTIVITAS TERBARU                               │
│          │  • Artikel "Masa Depan AI" dipublikasi           │
│          │  • Komentar baru dari John Doe                   │
│          │                                                   │
└──────────┴──────────────────────────────────────────────────┘
```

**URL:** http://localhost:4321/dashboard

**Login:** http://localhost:4321/admin/login
- Username: `admin`
- Password: `admin123`

---

## 📱 Mobile View

### Homepage Mobile
```
┌─────────────────────┐
│  ☰  Animedia    👤  │
├─────────────────────┤
│                     │
│  🔥 ARTIKEL TERBARU │
│                     │
│  ┌─────────────────┐│
│  │ [Image]         ││
│  │                 ││
│  │ Masa Depan AI   ││
│  │ di 2024         ││
│  │                 ││
│  │ Teknologi       ││
│  │ 7 Apr 2026      ││
│  └─────────────────┘│
│                     │
│  ┌─────────────────┐│
│  │ [Image]         ││
│  │                 ││
│  │ Review Smartphone││
│  │ Gaming Terbaik  ││
│  │                 ││
│  │ Gadget          ││
│  │ 7 Apr 2026      ││
│  └─────────────────┘│
│                     │
└─────────────────────┘
```

### Dashboard Mobile
```
┌─────────────────────┐
│  ☰  Dashboard   👤  │
├─────────────────────┤
│                     │
│  STATISTIK          │
│                     │
│  ┌─────────────────┐│
│  │ 10              ││
│  │ Postingan       ││
│  └─────────────────┘│
│                     │
│  ┌─────────────────┐│
│  │ 311             ││
│  │ Pembaca         ││
│  └─────────────────┘│
│                     │
│  ┌─────────────────┐│
│  │ 5               ││
│  │ Pengguna        ││
│  └─────────────────┘│
│                     │
└─────────────────────┘
```

---

## 🎨 Color Scheme

### Primary Colors
```
Primary:   #2563eb (Blue)
Secondary: #7c3aed (Purple)
Tertiary:  #f59e0b (Orange)
Error:     #ef4444 (Red)
Success:   #10b981 (Green)
```

### Surface Colors
```
Background:        #ffffff (White)
Surface:           #f9fafb (Light Gray)
Surface Container: #f3f4f6 (Gray)
```

### Text Colors
```
On Surface:         #1f2937 (Dark Gray)
On Surface Variant: #6b7280 (Medium Gray)
On Primary:         #ffffff (White)
```

---

## 🔔 Notifications & Alerts

### Success
```
┌─────────────────────────────────────────┐
│  ✅ Email berhasil diverifikasi!        │
│     Selamat datang di Animedia.         │
└─────────────────────────────────────────┘
```

### Error
```
┌─────────────────────────────────────────┐
│  ❌ Kode verifikasi salah               │
│     Silakan coba lagi.                  │
└─────────────────────────────────────────┘
```

### Info
```
┌─────────────────────────────────────────┐
│  ℹ️ Kode verifikasi baru telah dikirim  │
│     ke email Anda.                      │
└─────────────────────────────────────────┘
```

---

## 📊 Database Visualization

### users table
```
┌────┬──────────────────┬──────────────┬────────────────┬──────────────┐
│ id │ email            │ name         │ email_verified │ created_at   │
├────┼──────────────────┼──────────────┼────────────────┼──────────────┤
│ 1  │ john@example.com │ John Doe     │ 1              │ 2026-04-13   │
│ 2  │ jane@example.com │ Jane Smith   │ 0              │ 2026-04-13   │
└────┴──────────────────┴──────────────┴────────────────┴──────────────┘
```

### sessions table
```
┌────┬─────────┬──────────────────────┬────────────────────┐
│ id │ user_id │ token                │ expires_at         │
├────┼─────────┼──────────────────────┼────────────────────┤
│ 1  │ 1       │ abc123...            │ 2026-05-13         │
└────┴─────────┴──────────────────────┴────────────────────┘
```

---

## 🧪 Testing Scenarios

### ✅ Happy Path
```
1. Register → ✅ Success
2. Check email → ✅ Code received
3. Verify → ✅ Verified
4. Login → ✅ Logged in
5. Comment → ✅ Comment posted
```

### ❌ Error Cases
```
1. Register duplicate email → ❌ Error
2. Wrong verification code → ❌ Error
3. Expired code → ❌ Error
4. Login unverified → ❌ Error
```

---

## 🎯 Key Features Visualization

### Email Verification Flow
```
Register → Email Sent → Verify Code → Welcome Email → Login
   ↓          ↓             ↓              ↓            ↓
  User     Inbox        Paste Code     Inbox        Home
```

### Comment Flow
```
Login → Read Article → Write Comment → Submit → Approve (Admin) → Published
  ↓         ↓              ↓            ↓           ↓               ↓
 User    Article       Form         Database    Dashboard       Article
```

### Dashboard Stats Flow
```
User Actions → Database → Calculate Stats → Display Dashboard
     ↓            ↓             ↓                    ↓
  Register    Insert        Query              Real-time
  Comment     Update        Aggregate          Numbers
  View        Count         Growth %           Charts
```

---

## 📱 Responsive Breakpoints

```
Mobile:    < 768px   (Stack vertically)
Tablet:    768-1024px (2 columns)
Desktop:   > 1024px   (3 columns, sidebar)
```

---

**Panduan visual ini membantu Anda memahami tampilan dan flow aplikasi! 🎨**
