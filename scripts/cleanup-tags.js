/**
 * Script untuk membersihkan tag yang tidak terpakai atau jarang digunakan
 * 
 * Fungsi:
 * 1. Menampilkan statistik tag
 * 2. Menghapus tag dengan 0 artikel
 * 3. Menghapus tag dengan < 3 artikel (thin content)
 * 
 * Cara pakai:
 * node scripts/cleanup-tags.js [mode]
 * 
 * Mode:
 * - stats: Hanya tampilkan statistik (default)
 * - clean-empty: Hapus tag dengan 0 artikel
 * - clean-thin: Hapus tag dengan < 3 artikel
 * - clean-all: Hapus semua tag yang tidak memenuhi syarat
 */

import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createClient } from '@libsql/client';

// Load .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '..', '.env') });

// Create database client directly
const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const MIN_ARTICLES_FOR_INDEX = 3;

async function getTagStats() {
  // Get all tags with article count
  const result = await db.execute(`
    SELECT 
      t.id,
      t.name,
      t.slug,
      COUNT(at.article_id) as article_count
    FROM tags t
    LEFT JOIN article_tags at ON t.id = at.tag_id
    GROUP BY t.id, t.name, t.slug
    ORDER BY article_count DESC, t.name ASC
  `);

  return result.rows;
}

async function displayStats(tags) {
  console.log('\n📊 STATISTIK TAG\n');
  console.log('='.repeat(60));
  
  const totalTags = tags.length;
  const emptyTags = tags.filter(t => t.article_count === 0);
  const thinTags = tags.filter(t => t.article_count > 0 && t.article_count < MIN_ARTICLES_FOR_INDEX);
  const goodTags = tags.filter(t => t.article_count >= MIN_ARTICLES_FOR_INDEX);
  
  console.log(`Total Tag: ${totalTags}`);
  console.log(`✅ Tag Bagus (≥${MIN_ARTICLES_FOR_INDEX} artikel): ${goodTags.length}`);
  console.log(`⚠️  Tag Tipis (1-${MIN_ARTICLES_FOR_INDEX-1} artikel): ${thinTags.length}`);
  console.log(`❌ Tag Kosong (0 artikel): ${emptyTags.length}`);
  console.log('='.repeat(60));
  
  // Distribution
  console.log('\n📈 DISTRIBUSI TAG:\n');
  const distribution = {
    '0 artikel': emptyTags.length,
    '1 artikel': tags.filter(t => t.article_count === 1).length,
    '2 artikel': tags.filter(t => t.article_count === 2).length,
    '3-5 artikel': tags.filter(t => t.article_count >= 3 && t.article_count <= 5).length,
    '6-10 artikel': tags.filter(t => t.article_count >= 6 && t.article_count <= 10).length,
    '11-20 artikel': tags.filter(t => t.article_count >= 11 && t.article_count <= 20).length,
    '20+ artikel': tags.filter(t => t.article_count > 20).length,
  };
  
  Object.entries(distribution).forEach(([range, count]) => {
    const bar = '█'.repeat(Math.ceil(count / 5));
    console.log(`${range.padEnd(15)} ${count.toString().padStart(3)} ${bar}`);
  });
  
  // Top tags
  console.log('\n🏆 TOP 10 TAG TERPOPULER:\n');
  const topTags = tags.filter(t => t.article_count > 0).slice(0, 10);
  topTags.forEach((tag, i) => {
    console.log(`${(i+1).toString().padStart(2)}. ${tag.name.padEnd(30)} (${tag.article_count} artikel)`);
  });
  
  // Tags to clean
  if (emptyTags.length > 0) {
    console.log('\n❌ TAG KOSONG (akan dihapus dengan mode clean-empty):\n');
    emptyTags.slice(0, 20).forEach(tag => {
      console.log(`   - ${tag.name} (${tag.slug})`);
    });
    if (emptyTags.length > 20) {
      console.log(`   ... dan ${emptyTags.length - 20} tag lainnya`);
    }
  }
  
  if (thinTags.length > 0) {
    console.log('\n⚠️  TAG TIPIS (akan dihapus dengan mode clean-thin):\n');
    thinTags.slice(0, 20).forEach(tag => {
      console.log(`   - ${tag.name.padEnd(30)} (${tag.article_count} artikel)`);
    });
    if (thinTags.length > 20) {
      console.log(`   ... dan ${thinTags.length - 20} tag lainnya`);
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log(`\n💡 Rekomendasi: Hapus ${emptyTags.length + thinTags.length} tag untuk mencapai ${goodTags.length} tag berkualitas\n`);
}

async function cleanEmptyTags(tags) {
  const emptyTags = tags.filter(t => t.article_count === 0);
  
  if (emptyTags.length === 0) {
    console.log('\n✅ Tidak ada tag kosong yang perlu dihapus!\n');
    return 0;
  }
  
  console.log(`\n🗑️  Menghapus ${emptyTags.length} tag kosong...\n`);
  
  let deleted = 0;
  for (const tag of emptyTags) {
    try {
      await db.execute({
        sql: 'DELETE FROM tags WHERE id = ?',
        args: [tag.id]
      });
      console.log(`   ✓ Dihapus: ${tag.name}`);
      deleted++;
    } catch (error) {
      console.error(`   ✗ Gagal hapus ${tag.name}:`, error.message);
    }
  }
  
  console.log(`\n✅ Berhasil menghapus ${deleted} tag kosong!\n`);
  return deleted;
}

async function cleanThinTags(tags) {
  const thinTags = tags.filter(t => t.article_count > 0 && t.article_count < MIN_ARTICLES_FOR_INDEX);
  
  if (thinTags.length === 0) {
    console.log('\n✅ Tidak ada tag tipis yang perlu dihapus!\n');
    return 0;
  }
  
  console.log(`\n🗑️  Menghapus ${thinTags.length} tag tipis (< ${MIN_ARTICLES_FOR_INDEX} artikel)...\n`);
  
  let deleted = 0;
  for (const tag of thinTags) {
    try {
      // Delete from article_tags first (foreign key)
      await db.execute({
        sql: 'DELETE FROM article_tags WHERE tag_id = ?',
        args: [tag.id]
      });
      
      // Then delete the tag
      await db.execute({
        sql: 'DELETE FROM tags WHERE id = ?',
        args: [tag.id]
      });
      
      console.log(`   ✓ Dihapus: ${tag.name} (${tag.article_count} artikel)`);
      deleted++;
    } catch (error) {
      console.error(`   ✗ Gagal hapus ${tag.name}:`, error.message);
    }
  }
  
  console.log(`\n✅ Berhasil menghapus ${deleted} tag tipis!\n`);
  return deleted;
}

async function main() {
  const mode = process.argv[2] || 'stats';
  
  console.log('\n🏷️  TAG CLEANUP TOOL\n');
  
  try {
    const tags = await getTagStats();
    
    switch (mode) {
      case 'stats':
        await displayStats(tags);
        console.log('💡 Gunakan mode berikut untuk membersihkan:');
        console.log('   node scripts/cleanup-tags.js clean-empty   (hapus tag kosong)');
        console.log('   node scripts/cleanup-tags.js clean-thin    (hapus tag < 3 artikel)');
        console.log('   node scripts/cleanup-tags.js clean-all     (hapus semua)\n');
        break;
        
      case 'clean-empty':
        await displayStats(tags);
        const deletedEmpty = await cleanEmptyTags(tags);
        if (deletedEmpty > 0) {
          const newTags = await getTagStats();
          console.log('📊 STATISTIK SETELAH PEMBERSIHAN:\n');
          await displayStats(newTags);
        }
        break;
        
      case 'clean-thin':
        await displayStats(tags);
        const deletedThin = await cleanThinTags(tags);
        if (deletedThin > 0) {
          const newTags = await getTagStats();
          console.log('📊 STATISTIK SETELAH PEMBERSIHAN:\n');
          await displayStats(newTags);
        }
        break;
        
      case 'clean-all':
        await displayStats(tags);
        console.log('\n⚠️  MODE CLEAN-ALL: Akan menghapus tag kosong DAN tipis!\n');
        const deletedEmpty2 = await cleanEmptyTags(tags);
        const tagsAfterEmpty = await getTagStats();
        const deletedThin2 = await cleanThinTags(tagsAfterEmpty);
        
        if (deletedEmpty2 > 0 || deletedThin2 > 0) {
          const finalTags = await getTagStats();
          console.log('📊 STATISTIK AKHIR:\n');
          await displayStats(finalTags);
        }
        break;
        
      default:
        console.error(`❌ Mode tidak dikenal: ${mode}`);
        console.log('Mode yang tersedia: stats, clean-empty, clean-thin, clean-all\n');
        process.exit(1);
    }
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

main();
