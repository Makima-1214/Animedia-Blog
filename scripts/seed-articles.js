import { createClient } from '@libsql/client';

const db = createClient({
  url: 'libsql://blog-animedia-animedia.aws-ap-northeast-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzYxNDcxOTQsImlkIjoiMDE5ZDhhOWUtYWEwMS03ZjlmLWFiNmItMWZmMzQ1NjQxNDhlIiwicmlkIjoiY2Y4YjQzOWMtMDA1NC00ZDExLWExMGItYmZjYTEwYTA1ZmI1In0.Ylm6-ys19JVP3tYZ213yoAtDalsenMmwtZH-u9MYy5W7CcA0cq8mdK_htjCyOh0uGh5VaZOnbxSwqAF7PZcHBA',
});

const articles = [
  {
    title: 'Review Lengkap iPhone 15 Pro Max: Kamera Terbaik di Kelasnya',
    slug: 'review-iphone-15-pro-max-kamera-terbaik',
    excerpt: 'Apple kembali menghadirkan inovasi dengan iPhone 15 Pro Max yang dilengkapi sistem kamera revolusioner dan chip A17 Pro yang powerful.',
    category_id: '5', // Gadget
    cover_image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=1200&h=600&fit=crop',
    views: 15420
  },
  {
    title: 'Bocoran Anime Spring 2024: 15 Judul yang Wajib Ditonton',
    slug: 'bocoran-anime-spring-2024-wajib-ditonton',
    excerpt: 'Musim semi 2024 akan menghadirkan lineup anime yang sangat menarik, mulai dari sequel populer hingga adaptasi manga yang ditunggu-tunggu.',
    category_id: '1', // Anime
    cover_image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&h=600&fit=crop',
    views: 12350
  },
  {
    title: 'PlayStation 5 Pro Resmi Diumumkan: Spesifikasi dan Harga',
    slug: 'playstation-5-pro-resmi-diumumkan',
    excerpt: 'Sony akhirnya mengumumkan PlayStation 5 Pro dengan peningkatan performa grafis hingga 45% dan dukungan ray tracing yang lebih baik.',
    category_id: '3', // Game
    cover_image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=1200&h=600&fit=crop',
    views: 18900
  },
  {
    title: 'Dune Part 3 Dikonfirmasi: Denis Villeneuve Kembali Sutradarai',
    slug: 'dune-part-3-dikonfirmasi-denis-villeneuve',
    excerpt: 'Setelah kesuksesan Dune Part Two, Warner Bros mengumumkan kelanjutan trilogi dengan Denis Villeneuve kembali sebagai sutradara.',
    category_id: '4', // Film
    cover_image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&h=600&fit=crop',
    views: 14200
  },
  {
    title: 'AI Generatif Mengubah Industri Kreatif: Peluang dan Tantangan',
    slug: 'ai-generatif-mengubah-industri-kreatif',
    excerpt: 'Teknologi AI generatif seperti Midjourney dan ChatGPT membawa perubahan besar dalam cara kita berkarya dan bekerja.',
    category_id: '2', // Teknologi
    cover_image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=600&fit=crop',
    views: 9800
  },
  {
    title: 'Samsung Galaxy S24 Ultra vs iPhone 15 Pro Max: Perbandingan Lengkap',
    slug: 'samsung-galaxy-s24-ultra-vs-iphone-15-pro-max',
    excerpt: 'Dua flagship terbaik tahun ini bersaing ketat. Mana yang lebih unggul untuk kebutuhan Anda?',
    category_id: '5', // Gadget
    cover_image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=1200&h=600&fit=crop',
    views: 16700
  },
  {
    title: 'Attack on Titan: The Final Chapters Tamat dengan Rating Sempurna',
    slug: 'attack-on-titan-final-chapters-tamat',
    excerpt: 'Setelah 10 tahun perjalanan epik, Attack on Titan akhirnya tamat dengan ending yang memuaskan fans di seluruh dunia.',
    category_id: '1', // Anime
    cover_image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1200&h=600&fit=crop',
    views: 22100
  },
  {
    title: 'Elden Ring DLC Shadow of the Erdtree: Review dan Tips',
    slug: 'elden-ring-dlc-shadow-erdtree-review',
    excerpt: 'DLC terbaru Elden Ring menghadirkan area baru yang luas, boss yang menantang, dan cerita yang menarik untuk dijelajahi.',
    category_id: '3', // Game
    cover_image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=1200&h=600&fit=crop',
    views: 13400
  },
  {
    title: 'Marvel Cinematic Universe Phase 6: Semua yang Perlu Diketahui',
    slug: 'mcu-phase-6-semua-yang-perlu-diketahui',
    excerpt: 'Marvel Studios mengumumkan lineup Phase 6 yang akan mengakhiri Multiverse Saga dengan dua film Avengers besar.',
    category_id: '4', // Film
    cover_image: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=1200&h=600&fit=crop',
    views: 17800
  },
  {
    title: 'Quantum Computing: Masa Depan Komputasi Sudah Tiba',
    slug: 'quantum-computing-masa-depan-komputasi',
    excerpt: 'IBM dan Google berlomba mengembangkan komputer kuantum yang bisa menyelesaikan masalah kompleks dalam hitungan detik.',
    category_id: '2', // Teknologi
    cover_image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200&h=600&fit=crop',
    views: 8900
  },
  {
    title: 'MacBook Air M3 Review: Laptop Tipis Paling Powerful 2024',
    slug: 'macbook-air-m3-review-laptop-tipis-powerful',
    excerpt: 'Apple M3 chip membawa performa luar biasa ke MacBook Air yang tetap mempertahankan desain tipis dan ringan.',
    category_id: '5', // Gadget
    cover_image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&h=600&fit=crop',
    views: 11200
  },
  {
    title: 'Jujutsu Kaisen Season 3: Tanggal Rilis dan Ekspektasi Fans',
    slug: 'jujutsu-kaisen-season-3-tanggal-rilis',
    excerpt: 'Setelah kesuksesan season 2, MAPPA mengumumkan produksi season 3 yang akan mengadaptasi arc Culling Game.',
    category_id: '1', // Anime
    cover_image: 'https://images.unsplash.com/photo-1613376023733-0a73315d9b06?w=1200&h=600&fit=crop',
    views: 19500
  },
  {
    title: 'GTA 6 Trailer Breakdown: Semua Detail yang Tersembunyi',
    slug: 'gta-6-trailer-breakdown-detail-tersembunyi',
    excerpt: 'Rockstar Games akhirnya merilis trailer pertama GTA 6. Mari kita bedah semua easter egg dan detail menarik di dalamnya.',
    category_id: '3', // Game
    cover_image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&h=600&fit=crop',
    views: 25600
  },
  {
    title: 'Oppenheimer Raih 7 Oscar: Analisis Kesuksesan Film Biografi',
    slug: 'oppenheimer-raih-7-oscar-analisis',
    excerpt: 'Christopher Nolan akhirnya meraih Oscar Best Director untuk film Oppenheimer yang memukau kritikus dan penonton.',
    category_id: '4', // Film
    cover_image: 'https://images.unsplash.com/photo-1574267432644-f610a4ab5f6c?w=1200&h=600&fit=crop',
    views: 13700
  },
  {
    title: 'Cybersecurity 2024: Ancaman Baru dan Cara Melindungi Data',
    slug: 'cybersecurity-2024-ancaman-baru',
    excerpt: 'Serangan siber semakin canggih di era AI. Pelajari cara melindungi data pribadi dan bisnis Anda dari ancaman terbaru.',
    category_id: '2', // Teknologi
    cover_image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=600&fit=crop',
    views: 7600
  },
  {
    title: 'Sony WH-1000XM5 vs Bose QuietComfort Ultra: Mana Lebih Baik?',
    slug: 'sony-wh1000xm5-vs-bose-qc-ultra',
    excerpt: 'Perbandingan mendalam dua headphone noise-cancelling terbaik di pasaran. Kualitas suara, kenyamanan, dan fitur.',
    category_id: '5', // Gadget
    cover_image: 'https://images.unsplash.com/photo-1545127398-14699f92334b?w=1200&h=600&fit=crop',
    views: 10400
  },
  {
    title: 'Demon Slayer Movie 2024: Infinity Castle Arc Dimulai',
    slug: 'demon-slayer-movie-2024-infinity-castle',
    excerpt: 'Ufotable mengumumkan Infinity Castle Arc akan diadaptasi menjadi trilogi film dengan animasi yang lebih spektakuler.',
    category_id: '1', // Anime
    cover_image: 'https://images.unsplash.com/photo-1618945524163-32451704c7e6?w=1200&h=600&fit=crop',
    views: 21300
  },
  {
    title: 'Baldurs Gate 3 Menang Game of the Year: Mengapa Layak?',
    slug: 'baldurs-gate-3-game-of-the-year',
    excerpt: 'Larian Studios menciptakan masterpiece RPG yang mengalahkan game-game AAA besar. Ini alasan kesuksesannya.',
    category_id: '3', // Game
    cover_image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&h=600&fit=crop',
    views: 14900
  },
  {
    title: 'Dune Part Two Box Office: Melampaui Ekspektasi Warner Bros',
    slug: 'dune-part-two-box-office-sukses',
    excerpt: 'Sekuel Dune meraup $700 juta di box office global, membuktikan sci-fi masih memiliki tempat di hati penonton.',
    category_id: '4', // Film
    cover_image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&h=600&fit=crop',
    views: 12800
  },
  {
    title: 'Tesla Cybertruck Akhirnya Mulai Dikirim: Review Pertama',
    slug: 'tesla-cybertruck-review-pertama',
    excerpt: 'Setelah bertahun-tahun ditunggu, Tesla Cybertruck akhirnya sampai ke tangan konsumen. Apakah sesuai hype?',
    category_id: '2', // Teknologi
    cover_image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1200&h=600&fit=crop',
    views: 16200
  }
];

async function seedArticles() {
  try {
    console.log('🌱 Mulai menambahkan 20 artikel...\n');

    for (let i = 0; i < articles.length; i++) {
      const article = articles[i];
      const id = `article-${Date.now()}-${i}`;
      const publishedAt = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString();
      
      const content = `
        <div class="prose prose-lg max-w-none">
          <p class="lead">${article.excerpt}</p>
          
          <h2>Pendahuluan</h2>
          <p>Dalam dunia yang terus berkembang pesat, ${article.title.toLowerCase()} menjadi topik yang sangat menarik untuk dibahas. Artikel ini akan mengulas secara mendalam berbagai aspek penting yang perlu Anda ketahui.</p>
          
          <h2>Poin-Poin Penting</h2>
          <ul>
            <li>Analisis mendalam tentang fitur dan spesifikasi utama</li>
            <li>Perbandingan dengan kompetitor di kelasnya</li>
            <li>Kelebihan dan kekurangan yang perlu dipertimbangkan</li>
            <li>Rekomendasi untuk berbagai kebutuhan pengguna</li>
          </ul>
          
          <h2>Analisis Detail</h2>
          <p>Setelah melakukan riset dan pengujian menyeluruh, kami menemukan bahwa topik ini memiliki banyak aspek menarik yang layak untuk dibahas lebih lanjut. Dari segi performa, kualitas, hingga value for money, semuanya akan kami ulas secara objektif.</p>
          
          <blockquote>
            <p>"Ini adalah salah satu topik paling menarik yang kami bahas tahun ini. Dampaknya terhadap industri sangat signifikan."</p>
          </blockquote>
          
          <h2>Kesimpulan</h2>
          <p>Secara keseluruhan, ${article.title.toLowerCase()} memberikan pengalaman yang sangat positif. Meskipun ada beberapa area yang bisa ditingkatkan, namun secara umum ini adalah pilihan yang sangat direkomendasikan untuk Anda yang mencari kualitas terbaik.</p>
          
          <p>Apakah Anda tertarik untuk mencoba? Bagikan pendapat Anda di kolom komentar!</p>
        </div>
      `;

      await db.execute({
        sql: `INSERT INTO articles (id, title, slug, excerpt, content, cover_image, category_id, status, views, read_time, published_at, created_at) 
              VALUES (?, ?, ?, ?, ?, ?, ?, 'published', ?, ?, ?, CURRENT_TIMESTAMP)`,
        args: [
          id,
          article.title,
          article.slug,
          article.excerpt,
          content,
          article.cover_image,
          article.category_id,
          article.views,
          Math.floor(Math.random() * 5) + 5, // 5-10 menit
          publishedAt
        ]
      });

      console.log(`✅ ${i + 1}. ${article.title}`);
    }

    console.log('\n🎉 Berhasil menambahkan 20 artikel!');
    console.log('📊 Total views: ' + articles.reduce((sum, a) => sum + a.views, 0).toLocaleString());
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

seedArticles();
