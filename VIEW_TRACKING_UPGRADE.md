# 📊 View Tracking System - Upgrade ke Akurat

## ✅ Yang Sudah Diperbaiki

Sistem view counter sekarang **jauh lebih akurat** dengan fitur:

### 1. **24 Hour Cooldown** ⏰
- 1 user hanya dihitung 1x per 24 jam
- Refresh berkali-kali = tetap 1 view
- Menggunakan cookie + localStorage

### 2. **Bot Detection** 🤖
- Filter Google Bot, Bing Bot, crawler
- Filter headless browser, selenium
- Filter social media bot (Facebook, Twitter, dll)

### 3. **Client-Side Tracking** 💻
- View dihitung saat halaman fully loaded
- Lebih akurat dari server-side
- Tidak count preview/dev mode

### 4. **Dual Protection** 🛡️
- Cookie (server-side, 24 jam)
- LocalStorage (client-side, backup)
- Double check untuk akurasi maksimal

---

## 📈 Perbandingan

### ❌ Sistem Lama (Tidak Akurat):
```
User buka artikel     → +1 view
User refresh          → +1 view (lagi!)
User refresh 10x      → +10 views (ngawur!)
Google Bot crawl      → +1 view (bot dihitung!)
Preview di dev mode   → +1 view (salah!)
```

### ✅ Sistem Baru (Akurat):
```
User buka artikel     → +1 view ✓
User refresh          → 0 view (sudah dihitung)
User refresh 10x      → 0 view (cooldown 24 jam)
Google Bot crawl      → 0 view (bot difilter!)
Preview di dev mode   → 0 view (client-side)
```

---

## 🔧 Cara Kerja

### 1. User Buka Artikel
```
Browser → Load halaman → Script jalan
         ↓
Check localStorage: Sudah view dalam 24 jam?
         ↓
    Belum? → Kirim ke API
         ↓
API Check: Bot? Cookie ada?
         ↓
    Bukan bot & belum ada cookie? → +1 view
         ↓
Set cookie (24 jam) + localStorage
```

### 2. User Refresh (dalam 24 jam)
```
Browser → Load halaman → Script jalan
         ↓
Check localStorage: Sudah view dalam 24 jam?
         ↓
    Sudah! → STOP (tidak kirim ke API)
```

### 3. Bot/Crawler Akses
```
Bot → Load halaman → Script jalan
     ↓
Kirim ke API
     ↓
API Check User-Agent: Bot detected!
     ↓
REJECT (tidak +1 view)
```

---

## 📁 File yang Diubah

1. **API Endpoint Baru**: `src/pages/api/articles/view.ts`
   - Handle view tracking
   - Bot detection
   - Cookie management

2. **Artikel Detail**: `src/pages/artikel/[slug].astro`
   - Hapus server-side increment
   - Tambah client-side tracking script

3. **Helper (tidak dipakai lagi)**: `src/lib/turso-helpers.js`
   - `incrementArticleViews()` masih ada tapi tidak dipakai
   - Bisa dihapus nanti kalau mau

---

## 🎯 Hasil

### Sebelum:
- View count **tidak akurat**
- Refresh = +1 view
- Bot dihitung
- Bisa di-spam

### Setelah:
- View count **akurat**
- 1 user = 1 view per 24 jam
- Bot difilter
- Anti-spam

---

## 🚀 Deploy

Setelah commit & push, view tracking baru akan aktif otomatis.

**View count lama tetap ada**, hanya cara hitung ke depannya yang lebih akurat.

---

## 💡 Tips

1. **View count lama tidak direset** - Angka yang sudah ada tetap
2. **Mulai akurat dari sekarang** - View baru dihitung dengan sistem baru
3. **24 jam cooldown** - User yang sama baru dihitung lagi setelah 24 jam
4. **Bot tidak dihitung** - Crawler Google, Bing, dll difilter

---

## 🔍 Monitoring

Untuk cek apakah view tracking jalan:
1. Buka artikel di browser
2. Buka DevTools (F12) → Console
3. Lihat request ke `/api/articles/view`
4. Refresh halaman → tidak ada request lagi (sudah di-cooldown)

---

**View tracking sekarang jauh lebih akurat!** 🎉
