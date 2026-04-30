a# 🏷️ Panduan Pembersihan Tag

## Masalah

Website Animedia memiliki **259 tag** yang terlalu banyak dan tidak efisien untuk SEO. Banyak tag yang:
- Tidak memiliki artikel sama sekali (0 artikel)
- Hanya memiliki 1-4 artikel (thin content)
- Membuat website sulit dikelola

## Solusi

Fitur **Tag Cleanup** di Dashboard Admin membantu membersihkan tag secara otomatis dengan 1 klik!

---

## 🎯 Cara Menggunakan (MUDAH!)

### 1. Buka Dashboard Tags

1. Login ke admin dashboard: `https://animedia.web.id/dashboard`
2. Klik menu **"Tags"** di sidebar
3. Lihat statistik tag Anda

### 2. Lihat Statistik

Di bagian atas halaman, Anda akan melihat 4 kartu statistik:
- **Total Tag**: Jumlah semua tag (259)
- **Tag Terindex**: Tag dengan ≥5 artikel (bagus untuk SEO)
- **Tag Tidak Terindex**: Tag dengan 1-4 artikel
- **Tag Kosong**: Tag dengan 0 artikel (harus dihapus!)

### 3. Cleanup Tag Kosong

Klik tombol **"Hapus Tag Kosong (X)"** di kanan atas.

**Fungsi:**
- Menghapus semua tag yang tidak memiliki artikel
- Aman 100% karena tidak ada artikel yang terpengaruh
- Instant cleanup!

### 4. Cleanup Tag Tipis

Klik tombol **"Hapus Tag Tipis (X)"** di kanan atas.

**Fungsi:**
- Menghapus tag dengan < 5 artikel
- Mencegah thin content yang buruk untuk SEO
- Artikel tetap aman, hanya tag-nya yang dihapus

---

## 📊 Target Hasil

**Sebelum:**
- 259 tag total
- Banyak tag kosong dan tipis
- Sulit dikelola
- Buruk untuk SEO

**Setelah:**
- ~50-80 tag berkualitas
- Setiap tag minimal 5 artikel
- Lebih mudah dikelola
- Lebih baik untuk SEO

---

## ⚠️ Catatan Penting

1. **Artikel Tidak Akan Dihapus**
   - Fitur ini hanya menghapus tag
   - Artikel tetap aman dan tidak terpengaruh

2. **Tag dengan ≥5 Artikel Aman**
   - Tag yang sudah bagus tidak akan tersentuh
   - Hanya tag bermasalah yang dihapus

3. **Bisa Dijalankan Berkala**
   - Jalankan setiap bulan untuk maintenance
   - Jaga kualitas tag tetap bagus

4. **Konfirmasi Sebelum Hapus**
   - Sistem akan minta konfirmasi sebelum menghapus
   - Anda bisa cancel kapan saja

---

## 🔧 Troubleshooting

### Tombol Tidak Muncul?
Pastikan Anda sudah login sebagai admin.

### Error "Unauthorized"?
Session admin Anda expired. Login ulang ke dashboard.

### Ingin Undo?
Jika tidak sengaja menghapus tag penting, Anda bisa:
1. Buat tag baru di dashboard
2. Tambahkan ke artikel yang relevan

---

## 📈 Maintenance Rutin

**Disarankan:**
- Cek statistik tag setiap minggu
- Jalankan "Hapus Tag Kosong" setiap bulan
- Jalankan "Hapus Tag Tipis" setiap 3 bulan

**Best Practice:**
- Gunakan tag yang sudah ada saat membuat artikel baru
- Jangan buat tag baru untuk setiap artikel
- Minimal 5 artikel per tag sebelum tag di-publish
- Merge tag yang mirip secara manual

---

## 💡 Tips Mengelola Tag

1. **Konsisten**: Gunakan tag yang sama untuk topik serupa
2. **Spesifik**: Gunakan tag spesifik, bukan terlalu umum
3. **3-5 tag per artikel**: Tidak terlalu banyak, tidak terlalu sedikit
4. **Review berkala**: Cek tag yang jarang dipakai
5. **Merge tag serupa**: Gabungkan tag yang terlalu mirip

---

## 🚀 Alternatif: Script CLI (Opsional)

Jika Anda ingin menjalankan cleanup dari terminal lokal:

```bash
# 1. Buat file .env dengan kredensial Turso
cp .env.example .env
# Edit .env dan isi TURSO_DATABASE_URL dan TURSO_AUTH_TOKEN

# 2. Install dependencies
npm install

# 3. Lihat statistik
node scripts/cleanup-tags.js stats

# 4. Hapus tag kosong
node scripts/cleanup-tags.js clean-empty

# 5. Hapus tag tipis
node scripts/cleanup-tags.js clean-thin
```

**Catatan:** Cara dashboard lebih mudah dan direkomendasikan!

---

Selamat membersihkan tag! 🎉
