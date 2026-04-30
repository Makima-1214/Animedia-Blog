import db from './turso.js';

export function calculateReadTime(content) {
  const text = content.replace(/<[^>]*>/g, '');
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

// Articles
export async function getAllArticles() {
  try {
    // Try new query with scheduled_at (for databases that have been migrated)
    const result = await db.execute(`
      SELECT * FROM articles 
      WHERE (status = 'published' OR (status = 'scheduled' AND scheduled_at <= datetime('now')))
      ORDER BY COALESCE(published_at, scheduled_at, created_at) DESC
    `);
    
    // Auto-publish scheduled articles that have reached their time
    for (const article of result.rows) {
      if (article.status === 'scheduled' && article.scheduled_at && article.scheduled_at <= new Date().toISOString()) {
        await db.execute({
          sql: `UPDATE articles SET status = 'published', published_at = scheduled_at WHERE id = ?`,
          args: [article.id]
        });
      }
    }
    
    return result.rows.filter(a => a.status === 'published');
  } catch (error) {
    // Fallback to old query if scheduled_at column doesn't exist yet
    console.warn('Falling back to old query (scheduled_at column may not exist):', error);
    const result = await db.execute(`
      SELECT * FROM articles 
      WHERE status = 'published' 
      ORDER BY published_at DESC
    `);
    return result.rows;
  }
}

export async function getArticleBySlug(slug) {
  const result = await db.execute({ sql: `SELECT * FROM articles WHERE slug = ?`, args: [slug] });
  return result.rows[0] || null;
}

export async function getArticlesByCategory(categoryId) {
  const result = await db.execute({
    sql: `SELECT * FROM articles WHERE category_id = ? AND status = 'published' ORDER BY published_at DESC`,
    args: [categoryId]
  });
  return result.rows;
}

export async function incrementArticleViews(articleId) {
  await db.execute({ sql: `UPDATE articles SET views = views + 1 WHERE id = ?`, args: [articleId] });
}

export async function getAllArticlesAdmin() {
  const result = await db.execute(`SELECT * FROM articles ORDER BY created_at DESC`);
  return result.rows;
}

export async function getArticleById(id) {
  const result = await db.execute({ sql: `SELECT * FROM articles WHERE id = ?`, args: [id] });
  return result.rows[0] || null;
}

export async function getRelatedArticles(categoryId, excludeId, limit = 3) {
  // Smart algorithm: Priority based on tags, category, and popularity
  
  // 1. Get current article's tags
  const currentTags = await db.execute({
    sql: `SELECT tag_id FROM article_tags WHERE article_id = ?`,
    args: [excludeId]
  });
  const tagIds = currentTags.rows.map(t => t.tag_id);
  
  if (tagIds.length > 0) {
    // 2. Find articles with matching tags (highest priority)
    const tagMatches = await db.execute({
      sql: `
        SELECT a.*, COUNT(at.tag_id) as tag_matches, COALESCE(a.views, 0) as view_count
        FROM articles a
        JOIN article_tags at ON a.id = at.article_id
        WHERE at.tag_id IN (${tagIds.map(() => '?').join(',')})
          AND a.id != ?
          AND a.status = 'published'
        GROUP BY a.id
        ORDER BY tag_matches DESC, view_count DESC, a.published_at DESC
        LIMIT ?
      `,
      args: [...tagIds, excludeId, limit]
    });
    
    if (tagMatches.rows.length >= limit) {
      return tagMatches.rows;
    }
    
    // 3. If not enough, add popular articles from same category
    const remaining = limit - tagMatches.rows.length;
    const excludeIds = [excludeId, ...tagMatches.rows.map(a => a.id)];
    
    const categoryMatches = await db.execute({
      sql: `
        SELECT *, COALESCE(views, 0) as view_count
        FROM articles 
        WHERE category_id = ? 
          AND id NOT IN (${excludeIds.map(() => '?').join(',')})
          AND status = 'published' 
        ORDER BY view_count DESC, published_at DESC 
        LIMIT ?
      `,
      args: [categoryId, ...excludeIds, remaining]
    });
    
    return [...tagMatches.rows, ...categoryMatches.rows];
  }
  
  // 4. Fallback: Popular articles from same category
  const result = await db.execute({
    sql: `
      SELECT *, COALESCE(views, 0) as view_count
      FROM articles 
      WHERE category_id = ? 
        AND id != ? 
        AND status = 'published' 
      ORDER BY view_count DESC, published_at DESC 
      LIMIT ?
    `,
    args: [categoryId, excludeId, limit]
  });
  
  return result.rows;
}

// Categories
export async function getAllCategories() {
  const result = await db.execute(`SELECT * FROM categories`);
  return result.rows;
}

export async function getCategoryBySlug(slug) {
  const result = await db.execute({ sql: `SELECT * FROM categories WHERE slug = ?`, args: [slug] });
  return result.rows[0] || null;
}

// Tags
export async function getAllTags() {
  const result = await db.execute(`SELECT * FROM tags ORDER BY name ASC`);
  return result.rows;
}

export async function getTagsByArticle(articleId) {
  const result = await db.execute({
    sql: `SELECT t.* FROM tags t JOIN article_tags at ON t.id = at.tag_id WHERE at.article_id = ?`,
    args: [articleId]
  });
  return result.rows;
}

export async function getArticlesByTag(tagSlug) {
  const result = await db.execute({
    sql: `SELECT a.* FROM articles a JOIN article_tags at ON a.id = at.article_id JOIN tags t ON t.id = at.tag_id WHERE t.slug = ? AND a.status = 'published' ORDER BY a.published_at DESC`,
    args: [tagSlug]
  });
  return result.rows;
}

export async function getTagBySlug(slug) {
  const result = await db.execute({ sql: `SELECT * FROM tags WHERE slug = ?`, args: [slug] });
  return result.rows[0] || null;
}

export async function syncArticleTags(articleId, tagNames) {
  await db.execute({ sql: `DELETE FROM article_tags WHERE article_id = ?`, args: [articleId] });
  for (const name of tagNames) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    const id = Date.now().toString() + Math.random().toString(36).slice(2);
    await db.execute({ sql: `INSERT OR IGNORE INTO tags (id, name, slug) VALUES (?, ?, ?)`, args: [id, name.trim(), slug] });
    const tag = await db.execute({ sql: `SELECT id FROM tags WHERE slug = ?`, args: [slug] });
    if (tag.rows[0]) {
      await db.execute({ sql: `INSERT OR IGNORE INTO article_tags (article_id, tag_id) VALUES (?, ?)`, args: [articleId, tag.rows[0].id] });
    }
  }
}

// Comments
export async function getCommentsByArticle(articleId) {
  const result = await db.execute({
    sql: `SELECT * FROM comments WHERE article_id = ? AND status = 'approved' ORDER BY created_at ASC`,
    args: [articleId]
  });
  // Nest replies under parent
  const all = result.rows;
  const parents = all.filter(c => !c.parent_id);
  const replies = all.filter(c => c.parent_id);
  return parents.map(p => ({
    ...p,
    replies: replies.filter(r => r.parent_id === p.id)
  }));
}

export async function getAllComments() {
  const result = await db.execute(`SELECT * FROM comments ORDER BY created_at DESC`);
  return result.rows;
}

export async function getCommentStats() {
  const [total, pending, approved, rejected, todayApproved] = await Promise.all([
    db.execute(`SELECT COUNT(*) as count FROM comments`),
    db.execute(`SELECT COUNT(*) as count FROM comments WHERE status = 'pending'`),
    db.execute(`SELECT COUNT(*) as count FROM comments WHERE status = 'approved'`),
    db.execute(`SELECT COUNT(*) as count FROM comments WHERE status = 'rejected'`),
    db.execute(`SELECT COUNT(*) as count FROM comments WHERE status = 'approved' AND date(created_at) = date('now')`)
  ]);
  return {
    total: total.rows[0]?.count || 0,
    pending: pending.rows[0]?.count || 0,
    approved: approved.rows[0]?.count || 0,
    rejected: rejected.rows[0]?.count || 0,
    todayApproved: todayApproved.rows[0]?.count || 0
  };
}

// Affiliates
export async function getAllAffiliates() {
  const result = await db.execute(`
    SELECT ap.*, a.title as article_title, a.slug as article_slug
    FROM affiliate_products ap LEFT JOIN articles a ON ap.article_id = a.id
    ORDER BY ap.created_at DESC
  `);
  return result.rows;
}

export async function getActiveAffiliates() {
  const result = await db.execute(`
    SELECT ap.*, a.title as article_title, a.slug as article_slug
    FROM affiliate_products ap
    LEFT JOIN articles a ON ap.article_id = a.id
    WHERE ap.is_active = 1
    ORDER BY ap.sort_order ASC, ap.created_at DESC
  `);
  return result.rows;
}

export async function getAffiliateById(id) {
  const result = await db.execute({ sql: `SELECT * FROM affiliate_products WHERE id = ?`, args: [id] });
  return result.rows[0] || null;
}

export async function getAffiliatesByArticle(articleId) {
  const result = await db.execute({
    sql: `SELECT * FROM affiliate_products WHERE article_id = ? AND is_active = 1 ORDER BY sort_order ASC, created_at ASC`,
    args: [articleId]
  });
  return result.rows;
}

export async function getAffiliatesAdminByArticle(articleId) {
  const result = await db.execute({
    sql: `SELECT * FROM affiliate_products WHERE article_id = ? ORDER BY sort_order ASC, created_at ASC`,
    args: [articleId]
  });
  return result.rows;
}

export async function createAffiliate(data) {
  const id = Date.now().toString() + Math.random().toString(36).slice(2);
  // article_id opsional — bisa null untuk produk standalone
  await db.execute({
    sql: `INSERT INTO affiliate_products (id, article_id, name, description, image, price, affiliate_url, platform, is_active, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [id, data.article_id || null, data.name, data.description || '', data.image || '', data.price || '', data.affiliate_url, data.platform || '', data.is_active ?? 1, data.sort_order ?? 0]
  });
}

export async function updateAffiliate(id, data) {
  await db.execute({
    sql: `UPDATE affiliate_products SET name=?, description=?, image=?, price=?, affiliate_url=?, platform=?, is_active=?, sort_order=? WHERE id=?`,
    args: [data.name, data.description || '', data.image || '', data.price || '', data.affiliate_url, data.platform || '', data.is_active ?? 1, data.sort_order ?? 0, id]
  });
}

export async function deleteAffiliate(id) {
  await db.execute({ sql: `DELETE FROM affiliate_products WHERE id = ?`, args: [id] });
}

// Admin
export async function getAdminByUsername(username) {
  const result = await db.execute({ sql: `SELECT * FROM admins WHERE username = ?`, args: [username] });
  return result.rows[0] || null;
}

export async function getAdminById(id) {
  const result = await db.execute({ sql: `SELECT * FROM admins WHERE id = ?`, args: [id] });
  return result.rows[0] || null;
}

export async function updateAdminProfile(id, data) {
  await db.execute({
    sql: `UPDATE admins SET name = ?, avatar = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    args: [data.name, data.avatar, id]
  });
}

// Stats
export async function getDetailedStats() {
  const [articles, comments, subscribers, users] = await Promise.all([
    db.execute(`SELECT * FROM articles`),
    db.execute(`SELECT * FROM comments`),
    db.execute(`SELECT * FROM subscribers`),
    db.execute(`SELECT * FROM users`)
  ]);

  const articleRows = articles.rows;
  const commentRows = comments.rows;
  const subscriberRows = subscribers.rows;
  const userRows = users.rows;

  const totalViews = articleRows.reduce((sum, a) => sum + (a.views || 0), 0);
  const totalArticles = articleRows.filter(a => a.status === 'published').length;
  const totalComments = commentRows.filter(c => c.status === 'approved').length;
  const totalSubscribers = subscriberRows.length;
  const totalUsers = userRows.length;

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

  function calcGrowth(recent, previous) {
    return previous > 0 ? Math.round(((recent - previous) / previous) * 100) : (recent > 0 ? 100 : 0);
  }

  const recentArticles = articleRows.filter(a => a.status === 'published' && a.published_at && new Date(a.published_at) >= sevenDaysAgo).length;
  const previousArticles = articleRows.filter(a => a.status === 'published' && a.published_at && new Date(a.published_at) >= fourteenDaysAgo && new Date(a.published_at) < sevenDaysAgo).length;

  const recentComments = commentRows.filter(c => new Date(c.created_at) >= sevenDaysAgo).length;
  const previousComments = commentRows.filter(c => new Date(c.created_at) >= fourteenDaysAgo && new Date(c.created_at) < sevenDaysAgo).length;

  const recentSubscribers = subscriberRows.filter(s => new Date(s.created_at) >= sevenDaysAgo).length;
  const previousSubscribers = subscriberRows.filter(s => new Date(s.created_at) >= fourteenDaysAgo && new Date(s.created_at) < sevenDaysAgo).length;

  const recentUsers = userRows.filter(u => new Date(u.created_at) >= sevenDaysAgo).length;
  const previousUsers = userRows.filter(u => new Date(u.created_at) >= fourteenDaysAgo && new Date(u.created_at) < sevenDaysAgo).length;

  return {
    totalArticles, totalViews, totalComments, totalSubscribers, totalUsers,
    articlesGrowth: calcGrowth(recentArticles, previousArticles),
    viewsGrowth: 0,
    commentsGrowth: calcGrowth(recentComments, previousComments),
    subscribersGrowth: calcGrowth(recentSubscribers, previousSubscribers),
    usersGrowth: calcGrowth(recentUsers, previousUsers)
  };
}

export async function getDailyViews() {
  const dayNames = ['MIN', 'SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB'];
  const result = await db.execute(`SELECT published_at, views FROM articles WHERE status = 'published'`);
  const articles = result.rows;

  const viewsByDay = {};
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    viewsByDay[date.toISOString().split('T')[0]] = 0;
  }

  articles.forEach(a => {
    if (!a.published_at) return;
    const key = new Date(a.published_at).toISOString().split('T')[0];
    if (viewsByDay[key] !== undefined) viewsByDay[key] += a.views || 0;
  });

  const rawValues = Object.values(viewsByDay);
  const maxVal = Math.max(...rawValues, 1);

  return Object.entries(viewsByDay).map(([dateStr, views]) => {
    const date = new Date(dateStr);
    return { day: dayNames[date.getDay()], views, percentage: views === 0 ? 6 : Math.max(15, Math.round((views / maxVal) * 90)) };
  });
}

export async function getRecentActivities() {
  function timeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 1) return 'Baru saja';
    if (mins < 60) return `${mins} menit yang lalu`;
    if (hours < 24) return `${hours} jam yang lalu`;
    if (days === 1) return 'Kemarin';
    return `${days} hari yang lalu`;
  }

  const activities = [];

  const [recentArticles, recentComments, recentSubs] = await Promise.all([
    db.execute(`SELECT id, title, published_at FROM articles WHERE status = 'published' ORDER BY published_at DESC LIMIT 2`),
    db.execute(`SELECT id, article_id, created_at FROM comments WHERE status = 'approved' ORDER BY created_at DESC LIMIT 1`),
    db.execute(`SELECT COUNT(*) as count FROM subscribers WHERE created_at >= datetime('now', '-24 hours')`)
  ]);

  recentArticles.rows.forEach(a => activities.push({
    type: 'article', title: `Artikel Baru: "${a.title}"`,
    description: `Oleh Admin • ${timeAgo(a.published_at)}`, time: a.published_at, priority: 'high'
  }));

  recentComments.rows.forEach(c => activities.push({
    type: 'comment', title: 'Komentar disetujui pada artikel',
    description: `Sistem • ${timeAgo(c.created_at)}`, time: c.created_at, priority: 'medium'
  }));

  const subCount = recentSubs.rows[0]?.count || 0;
  if (subCount > 0) activities.push({
    type: 'subscriber', title: `${subCount} pengguna baru mendaftar newsletter`,
    description: 'Marketing • Hari ini', time: new Date().toISOString(), priority: 'medium'
  });

  return activities.sort((a, b) => new Date(b.time) - new Date(a.time));
}
