# 📧 Email Verification Flow

## 🔄 Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER REGISTRATION FLOW                        │
└─────────────────────────────────────────────────────────────────┘

1. USER REGISTER
   ┌──────────────────┐
   │  /register       │
   │  - Nama          │
   │  - Email         │
   │  - Password      │
   └────────┬─────────┘
            │
            ▼
   ┌──────────────────────────────────────┐
   │  POST /api/auth/register             │
   │  ✓ Validate email format             │
   │  ✓ Check duplicate email             │
   │  ✓ Hash password (SHA-256)           │
   │  ✓ Create user (email_verified=0)    │
   └────────┬─────────────────────────────┘
            │
            ▼
   ┌──────────────────────────────────────┐
   │  Generate Verification Code          │
   │  - Random 6 digit (100000-999999)    │
   │  - Expires in 15 minutes             │
   │  - Save to database                  │
   └────────┬─────────────────────────────┘
            │
            ▼
   ┌──────────────────────────────────────┐
   │  Send Email via Gmail                │
   │  📧 Subject: Verifikasi Email Anda   │
   │  📧 Body: Kode 6 digit               │
   │  📧 From: noreply@animedia.com       │
   └────────┬─────────────────────────────┘
            │
            ▼
   ┌──────────────────────────────────────┐
   │  Redirect to /verify-email?email=... │
   └──────────────────────────────────────┘


2. USER VERIFY EMAIL
   ┌──────────────────┐
   │  User cek inbox  │
   │  Copy kode       │
   └────────┬─────────┘
            │
            ▼
   ┌──────────────────────────────────────┐
   │  /verify-email                       │
   │  - Input kode 6 digit                │
   │  - Button: Verifikasi Email          │
   │  - Button: Kirim Ulang Kode          │
   └────────┬─────────────────────────────┘
            │
            ▼
   ┌──────────────────────────────────────┐
   │  POST /api/auth/verify-email         │
   │  ✓ Check kode match                  │
   │  ✓ Check kode not expired            │
   │  ✓ Update email_verified = 1         │
   │  ✓ Clear verification_code           │
   └────────┬─────────────────────────────┘
            │
            ▼
   ┌──────────────────────────────────────┐
   │  Create Session                      │
   │  - Generate session token            │
   │  - Set cookie (30 days)              │
   │  - Auto-login user                   │
   └────────┬─────────────────────────────┘
            │
            ▼
   ┌──────────────────────────────────────┐
   │  Send Welcome Email                  │
   │  📧 Subject: Selamat Datang!         │
   │  📧 Body: Welcome message            │
   └────────┬─────────────────────────────┘
            │
            ▼
   ┌──────────────────────────────────────┐
   │  Redirect to Home (/)                │
   │  ✅ User logged in                   │
   │  ✅ Can comment on articles          │
   └──────────────────────────────────────┘


3. RESEND CODE (Optional)
   ┌──────────────────────────────────────┐
   │  User click "Kirim Ulang Kode"       │
   └────────┬─────────────────────────────┘
            │
            ▼
   ┌──────────────────────────────────────┐
   │  POST /api/auth/resend-code          │
   │  ✓ Generate new code                 │
   │  ✓ Update database                   │
   │  ✓ Send new email                    │
   └────────┬─────────────────────────────┘
            │
            ▼
   ┌──────────────────────────────────────┐
   │  User receives new code              │
   │  Old code invalid                    │
   └──────────────────────────────────────┘


4. LOGIN (After Verification)
   ┌──────────────────┐
   │  /login          │
   │  - Email         │
   │  - Password      │
   └────────┬─────────┘
            │
            ▼
   ┌──────────────────────────────────────┐
   │  POST /api/auth/login                │
   │  ✓ Check email exists                │
   │  ✓ Check password match              │
   │  ✓ Check email_verified = 1          │
   └────────┬─────────────────────────────┘
            │
            ├─── email_verified = 0 ───────┐
            │                               │
            │                               ▼
            │                    ❌ Login ditolak
            │                    "Email belum diverifikasi"
            │
            └─── email_verified = 1 ───────┐
                                            │
                                            ▼
                                 ✅ Login berhasil
                                 Create session
                                 Redirect to home
```

---

## 📊 Database Schema

### users table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  email_verified INTEGER DEFAULT 0,        -- 0 = not verified, 1 = verified
  verification_code TEXT,                  -- 6 digit code
  verification_expires TEXT,               -- ISO datetime
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

### sessions table
```sql
CREATE TABLE sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## 🔐 Security Features

### Password Security
- ✅ SHA-256 hashing
- ✅ Minimum 6 characters
- ✅ Never stored in plain text

### Email Verification
- ✅ 6-digit random code
- ✅ 15-minute expiration
- ✅ One-time use (cleared after verification)
- ✅ Can resend new code

### Session Security
- ✅ Secure random token
- ✅ HttpOnly cookie (prevent XSS)
- ✅ SameSite=Lax (prevent CSRF)
- ✅ 30-day expiration
- ✅ Secure flag in production

---

## 📧 Email Templates

### 1. Verification Email
**Subject:** Verifikasi Email Anda - Animedia

**Content:**
- Header dengan logo Animedia
- Greeting: "Halo, {name}!"
- Kode verifikasi (besar, bold, center)
- Expiration notice (15 menit)
- Footer dengan copyright

### 2. Welcome Email
**Subject:** Selamat Datang di Animedia! 🎉

**Content:**
- Header dengan gradient
- Welcome message
- List fitur yang bisa digunakan
- Button "Mulai Membaca"
- Footer dengan copyright

---

## ⚙️ Configuration

### Gmail Setup
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password  # 16 characters from Google
```

### Nodemailer Config
```typescript
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});
```

---

## 🧪 Testing Checklist

### ✅ Happy Path
- [ ] Register dengan email valid
- [ ] Terima email dengan kode
- [ ] Paste kode → berhasil verify
- [ ] Auto-login setelah verify
- [ ] Terima welcome email
- [ ] Bisa login lagi
- [ ] Bisa comment artikel

### ✅ Error Cases
- [ ] Register dengan email duplicate → error
- [ ] Register dengan email invalid → error
- [ ] Verify dengan kode salah → error
- [ ] Verify dengan kode expired → error
- [ ] Login sebelum verify → error
- [ ] Resend code → dapat kode baru

### ✅ Edge Cases
- [ ] Kode expired → resend → verify dengan kode baru
- [ ] Register 2x dengan email sama → error
- [ ] Verify 2x dengan kode sama → error (sudah verified)
- [ ] Email tidak terkirim → retry register

---

## 🚨 Common Issues & Solutions

### Issue 1: Email tidak terkirim
**Cause:** App Password salah atau 2FA tidak aktif
**Solution:** 
1. Cek `.env` → pastikan EMAIL_USER dan EMAIL_PASSWORD benar
2. Cek 2FA aktif: https://myaccount.google.com/security
3. Buat ulang App Password: https://myaccount.google.com/apppasswords

### Issue 2: Kode expired
**Cause:** User terlalu lama (>15 menit)
**Solution:** Klik "Kirim Ulang Kode"

### Issue 3: Email masuk Spam
**Cause:** Gmail filter untuk email baru
**Solution:** Cek folder Spam, mark as "Not Spam"

### Issue 4: "Invalid login" error
**Cause:** App Password salah
**Solution:** Copy-paste App Password dengan benar (termasuk spasi)

---

## 📈 Production Recommendations

### Email Service
Untuk production, gunakan email service profesional:

1. **SendGrid** (Recommended)
   - Free: 100 email/hari
   - Paid: $19.95/bulan (50k email)
   - Deliverability tinggi

2. **Mailgun**
   - Free: 5000 email/bulan
   - Paid: $35/bulan (50k email)
   - API simple

3. **AWS SES**
   - $0.10 per 1000 email
   - Unlimited scale
   - Butuh AWS account

### Monitoring
- Track email delivery rate
- Monitor bounce rate
- Log failed verifications
- Alert on high failure rate

---

**Flow ini sudah production-ready! 🚀**
