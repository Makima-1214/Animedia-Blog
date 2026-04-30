import db from '../src/lib/turso.js';

async function addScheduledPostsFeature() {
  try {
    console.log('🚀 Adding scheduled posts feature...\n');

    // 1. Add scheduled_at column if not exists
    console.log('1️⃣ Adding scheduled_at column...');
    try {
      await db.execute(`
        ALTER TABLE articles 
        ADD COLUMN scheduled_at TEXT
      `);
      console.log('✅ scheduled_at column added\n');
    } catch (error) {
      if (error.message.includes('duplicate column name')) {
        console.log('ℹ️  scheduled_at column already exists\n');
      } else {
        throw error;
      }
    }

    // 2. Update existing published articles to have published_at if null
    console.log('2️⃣ Updating existing articles...');
    await db.execute(`
      UPDATE articles 
      SET published_at = created_at 
      WHERE status = 'published' AND published_at IS NULL
    `);
    console.log('✅ Existing articles updated\n');

    // 3. Show current articles status
    console.log('3️⃣ Current articles status:');
    const result = await db.execute(`
      SELECT 
        status,
        COUNT(*) as count,
        COUNT(CASE WHEN scheduled_at IS NOT NULL THEN 1 END) as scheduled_count
      FROM articles 
      GROUP BY status
    `);
    
    console.table(result.rows);

    console.log('\n✅ Scheduled posts feature added successfully!');
    console.log('\n📝 New features:');
    console.log('   - Articles can now have "scheduled" status');
    console.log('   - scheduled_at field stores future publish date');
    console.log('   - Auto-publish when scheduled_at time arrives');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addScheduledPostsFeature();
