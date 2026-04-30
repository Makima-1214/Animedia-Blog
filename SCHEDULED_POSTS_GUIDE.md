# 📅 Scheduled Posts (Upload Terjadwal) - Panduan Lengkap

## 🎯 Fitur Baru: Scheduled Posts

Sekarang Anda bisa membuat artikel yang akan otomatis dipublish pada waktu yang ditentukan!

---

## ✨ Cara Menggunakan

### 1. **Buat Artikel Terjadwal**

1. Buka Dashboard → **Artikel** → **Buat Artikel Baru**
2. Isi semua field artikel (judul, konten, dll)
3. Pada field **Status**, pilih: **"Scheduled (Terjadwal)"**
4. Field **Tanggal & Waktu Publish** akan muncul
5. Pilih tanggal dan waktu kapan artikel akan dipublish
6. Klik **Simpan Artikel**

### 2. **Artikel Akan Otomatis Publish**

- Artikel dengan status "scheduled" tidak akan muncul di homepage
- Saat waktu yang ditentukan tiba, artikel otomatis berubah status jadi "published"
- Artikel langsung muncul di homepage dan bisa diakses pengunjung

---

## 🔧 Setup Database (Wajib Dilakukan Sekali)

Jalankan script ini untuk menambahkan field `scheduled_at` ke database:

```bash
cd Animedia-Blog
node scripts/add-scheduled-posts.js
```

**Output yang diharapkan:**
```
🚀 Adding scheduled posts feature...

1️⃣ Adding scheduled_at column...
✅ scheduled_at column added

2️⃣ Updating existing articles...
✅ Existing articles updated

3️⃣ Current articles status:
┌─────────┬───────┬─────────────────┐
│ status  │ count │ scheduled_count │
├─────────┼───────┼─────────────────┤
│ draft   │ 5     │ 0               │
│ published│ 20    │ 0               │
└─────────┴───────┴─────────────────┘

✅ Scheduled posts feature added successfully!
```

---

## 📊 Status Artikel

### 1. **Draft**
- Artikel belum dipublish
- Hanya bisa dilihat di dashboard
- Tidak muncul di homepage

### 2. **Published**
- Artikel sudah dipublish
- Langsung muncul di homepage
- Bisa diakses pengunjung

### 3. **Scheduled** (Baru!)
- Artikel terjadwal
- Akan otomatis publish pada waktu yang ditentukan
- Tidak muncul di homepage sampai waktu tiba

---

## 🎨 Indicator di Dashboard

Artikel terjadwal akan ditampilkan dengan badge khusus:

```
📅 Scheduled
Akan publish: 30 Apr 2026, 20:00
```

---

## ⚙️ Cara Kerja Auto-Publish

### Mekanisme:
1. Setiap kali homepage dimuat, sistem cek artikel scheduled
2. Jika `scheduled_at <= waktu sekarang`, artikel otomatis dipublish
3. Status berubah dari "scheduled" → "published"
4. `published_at` diset ke nilai `scheduled_at`

### Kode (di `turso-helpers.js`):
```javascript
export async function getAllArticles() {
  // Get published + scheduled yang sudah waktunya
  const result = await db.execute(`
    SELECT * FROM articles 
    WHERE (status = 'published' OR (status = 'scheduled' AND scheduled_at <= datetime('now')))
    ORDER BY COALESCE(published_at, scheduled_at) DESC
  `);
  
  // Auto-publish scheduled articles
  for (const article of result.rows) {
    if (article.status === 'scheduled' && article.scheduled_at <= new Date().toISOString()) {
      await db.execute({
        sql: `UPDATE articles SET status = 'published', published_at = scheduled_at WHERE id = ?`,
        args: [article.id]
      });
    }
  }
  
  return result.rows.filter(a => a.status === 'published');
}
```

---

## 📝 Contoh Use Case

### Scenario 1: Publish Artikel Besok Pagi
```
Hari ini: 30 Apr 2026, 20:00
Scheduled: 1 Mei 2026, 08:00

Artikel akan otomatis publish besok pagi jam 8.
```

### Scenario 2: Publish Artikel Minggu Depan
```
Hari ini: 30 Apr 2026
Scheduled: 7 Mei 2026, 10:00

Artikel akan otomatis publish seminggu lagi.
```

### Scenario 3: Batch Publishing
```
Buat 5 artikel sekaligus:
- Artikel 1: Scheduled 1 Mei, 08:00
- Artikel 2: Scheduled 2 Mei, 08:00
- Artikel 3: Scheduled 3 Mei, 08:00
- Artikel 4: Scheduled 4 Mei, 08:00
- Artikel 5: Scheduled 5 Mei, 08:00

Semua akan publish otomatis sesuai jadwal!
```

---

## 🔍 Troubleshooting

### Issue 1: Artikel Tidak Auto-Publish
**Penyebab:** Homepage belum dimuat sejak waktu scheduled
**Solusi:** 
- Buka homepage untuk trigger auto-publish
- Atau tunggu pengunjung membuka homepage

### Issue 2: Field scheduled_at Tidak Ada
**Penyebab:** Database belum di-update
**Solusi:**
```bash
node scripts/add-scheduled-posts.js
```

### Issue 3: Error "scheduled_at column already exists"
**Status:** Ini normal! Artinya database sudah di-update sebelumnya
**Action:** Tidak perlu action, fitur sudah aktif

---

## 🚀 Deployment ke Vercel

### 1. **Update Database di Production**

Setelah deploy, jalankan script di production:

**Option A: Via Vercel CLI**
```bash
vercel env pull .env.production
node scripts/add-scheduled-posts.js
```

**Option B: Via Turso CLI**
```bash
turso db shell your-database-name
ALTER TABLE articles ADD COLUMN scheduled_at TEXT;
```

### 2. **Commit & Push**
```bash
git add .
git commit -m "feat: add scheduled posts feature"
git push origin main
```

### 3. **Vercel Auto-Deploy**
Vercel akan otomatis deploy perubahan.

---

## 📈 Benefits

### 1. **Content Planning**
- Buat artikel kapan saja
- Schedule publish untuk waktu optimal
- Maintain consistent posting schedule

### 2. **Time Management**
- Batch create articles
- Set & forget
- No need to manually publish

### 3. **SEO Optimization**
- Publish at peak traffic times
- Consistent content schedule
- Better search engine indexing

### 4. **Team Collaboration**
- Writers create content anytime
- Editors schedule publish times
- Automated workflow

---

## 🎯 Best Practices

### 1. **Optimal Publish Times**
```
Weekdays: 08:00 - 10:00 (morning commute)
Weekdays: 12:00 - 13:00 (lunch break)
Weekdays: 19:00 - 21:00 (evening)
Weekends: 10:00 - 12:00 (late morning)
```

### 2. **Content Calendar**
```
Monday: Tech News
Tuesday: Game Reviews
Wednesday: Anime Updates
Thursday: Gadget Reviews
Friday: Weekend Recommendations
```

### 3. **Batch Creation**
- Create 5-10 articles at once
- Schedule throughout the week
- Maintain consistent output

---

## 📊 Database Schema

### Before:
```sql
CREATE TABLE articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image TEXT,
  category_id INTEGER,
  status TEXT DEFAULT 'draft',
  read_time INTEGER DEFAULT 5,
  views INTEGER DEFAULT 0,
  published_at TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

### After:
```sql
CREATE TABLE articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image TEXT,
  category_id INTEGER,
  status TEXT DEFAULT 'draft',
  read_time INTEGER DEFAULT 5,
  views INTEGER DEFAULT 0,
  published_at TEXT,
  scheduled_at TEXT,  -- ✨ NEW FIELD
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🎉 Summary

### Files Modified:
```
✏️ src/lib/turso-helpers.js           - Auto-publish logic
✏️ src/pages/dashboard/artikel/buat.astro - UI for scheduling
✏️ src/pages/api/articles/create.ts   - API support
📄 scripts/add-scheduled-posts.js     - Database migration
📄 SCHEDULED_POSTS_GUIDE.md           - This guide
```

### Features Added:
- ✅ Schedule articles for future publish
- ✅ Auto-publish when time arrives
- ✅ Datetime picker UI
- ✅ Status indicator in dashboard
- ✅ Validation for scheduled date

---

## 📞 Support

Jika ada pertanyaan atau issue:
1. Check troubleshooting section
2. Verify database migration ran successfully
3. Check browser console for errors
4. Test with a scheduled article 5 minutes in the future

---

**Happy Scheduling! 📅✨**
