# 🚀 Deployment Guide - Animedia Blog

## Quick Deploy to Vercel

### 1️⃣ Pre-Deployment Checklist

```bash
# Test locally first
npm run dev

# Build test
npm run build

# Preview build
npm run preview
```

**Check these before deploying:**
- [ ] All pages load without errors
- [ ] Images load correctly (lazy loading works)
- [ ] Dark mode toggle works
- [ ] Search functionality works
- [ ] Newsletter CTAs work
- [ ] Mobile responsive (test on real device if possible)
- [ ] Sticky newsletter bar appears after scroll

---

### 2️⃣ Environment Variables (Vercel Dashboard)

Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

#### Required Variables:
```env
# Database (REQUIRED)
TURSO_DATABASE_URL=your-turso-database-url
TURSO_AUTH_TOKEN=your-turso-auth-token

# Email (REQUIRED for user registration)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password

# Cloudinary (REQUIRED for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# TinyMCE (REQUIRED for rich text editor)
TINYMCE_API_KEY=your-tinymce-api-key
```

#### Optional Variables:
```env
# SEO (Optional but recommended)
GOOGLE_SITE_VERIFICATION=your-verification-code
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

**⚠️ IMPORTANT:**
- Semua variables harus di-set untuk **Production**, **Preview**, dan **Development**
- Jangan ada spasi sebelum/sesudah nilai
- Jangan gunakan quotes kecuali nilai mengandung spasi

---

### 3️⃣ Deploy Commands

#### Option A: Auto Deploy (Recommended)
```bash
# Commit and push to main branch
git add .
git commit -m "feat: homepage improvements - 10/10 optimization"
git push origin main

# Vercel will auto-deploy
# Monitor at: https://vercel.com/dashboard
```

#### Option B: Manual Deploy via Vercel CLI
```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Or deploy to preview
vercel
```

---

### 4️⃣ Post-Deployment Verification

#### A. Check Deployment Status
1. Go to Vercel Dashboard
2. Check deployment logs for errors
3. Verify build completed successfully

#### B. Test Production Site
```
✅ Homepage loads
✅ Articles page works
✅ Individual article pages load
✅ Search works
✅ Newsletter signup works
✅ Dark mode toggle works
✅ Mobile responsive
✅ Images load (check lazy loading)
✅ Sitemap accessible: https://animedia.web.id/sitemap.xml
✅ Robots.txt accessible: https://animedia.web.id/robots.txt
```

#### C. Performance Testing
1. **Google PageSpeed Insights**
   - URL: https://pagespeed.web.dev/
   - Test: https://animedia.web.id
   - Target: 90+ score

2. **GTmetrix**
   - URL: https://gtmetrix.com/
   - Test: https://animedia.web.id
   - Target: A grade

3. **WebPageTest**
   - URL: https://www.webpagetest.org/
   - Test: https://animedia.web.id
   - Target: First Contentful Paint < 1.5s

---

### 5️⃣ Google Search Console Setup

#### A. Submit Sitemap
1. Go to: https://search.google.com/search-console
2. Select your property
3. Go to: **Sitemaps** (left sidebar)
4. Remove old sitemap if exists: `sitemap-index.xml`
5. Add new sitemap: `https://animedia.web.id/sitemap.xml`
6. Click **Submit**

#### B. Request Indexing
1. Go to: **URL Inspection** (top bar)
2. Enter: `https://animedia.web.id`
3. Click: **Request Indexing**
4. Repeat for important pages:
   - `/artikel`
   - `/tentang`
   - `/kontak`
   - Top 5 articles

#### C. Monitor Coverage
1. Go to: **Coverage** (left sidebar)
2. Check for errors
3. Fix any "Excluded" pages
4. Wait 1-2 weeks for re-indexing

---

### 6️⃣ Troubleshooting

#### Issue: Build Failed
```bash
# Check build logs in Vercel Dashboard
# Common fixes:

# 1. Clear cache and rebuild
vercel --prod --force

# 2. Check environment variables
# Make sure all required vars are set

# 3. Test build locally
npm run build
```

#### Issue: Images Not Loading
```bash
# Check Cloudinary credentials
# Verify CLOUDINARY_* variables in Vercel

# Test image upload in dashboard
# Go to: /dashboard/artikel/buat
```

#### Issue: 500 Internal Server Error
```bash
# Check Vercel Function Logs
# Go to: Vercel Dashboard → Deployments → Functions

# Common causes:
# - Missing environment variables
# - Database connection issues
# - Invalid Turso credentials
```

#### Issue: Sitemap Not Updating
```bash
# Sitemap is dynamic, should update automatically
# Force refresh:
curl https://animedia.web.id/sitemap.xml

# Check if articles are in database:
# Go to: /dashboard/artikel
```

#### Issue: Newsletter Not Working
```bash
# Check email credentials
# Verify EMAIL_USER and EMAIL_PASSWORD

# Test email sending:
# Go to: /berlangganan
# Try subscribing with test email
```

---

### 7️⃣ Performance Optimization (Vercel)

#### A. Enable Vercel Analytics
```bash
# Install Vercel Analytics
npm install @vercel/analytics

# Add to BaseLayout.astro (already done)
```

#### B. Enable Vercel Speed Insights
```bash
# Install Speed Insights
npm install @vercel/speed-insights

# Add to BaseLayout.astro
```

#### C. Configure Caching
```javascript
// vercel.json (optional)
{
  "headers": [
    {
      "source": "/images/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*).css",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

---

### 8️⃣ Monitoring & Maintenance

#### Daily Checks
- [ ] Check Vercel deployment status
- [ ] Monitor error logs
- [ ] Check site uptime

#### Weekly Checks
- [ ] Review Google Search Console
- [ ] Check PageSpeed Insights score
- [ ] Monitor newsletter signups
- [ ] Review article views

#### Monthly Checks
- [ ] Update dependencies: `npm update`
- [ ] Review and optimize slow pages
- [ ] Check for broken links
- [ ] Backup database

---

### 9️⃣ Rollback (If Needed)

#### Quick Rollback
1. Go to Vercel Dashboard
2. Go to: **Deployments**
3. Find previous working deployment
4. Click: **⋯ (three dots)** → **Promote to Production**

#### Manual Rollback
```bash
# Revert git commit
git revert HEAD
git push origin main

# Or reset to previous commit
git reset --hard <commit-hash>
git push origin main --force
```

---

### 🎯 Success Metrics

After deployment, monitor these metrics:

#### Performance
- ✅ PageSpeed Score: 90+
- ✅ First Contentful Paint: < 1.5s
- ✅ Largest Contentful Paint: < 2.5s
- ✅ Time to Interactive: < 3.0s
- ✅ Cumulative Layout Shift: < 0.1

#### SEO
- ✅ Google Search Console: 0 errors
- ✅ Indexed pages: Increasing weekly
- ✅ Sitemap submitted successfully
- ✅ Mobile-friendly test: Passed

#### User Engagement
- ✅ Bounce rate: < 60%
- ✅ Average session duration: > 2 minutes
- ✅ Pages per session: > 2
- ✅ Newsletter signups: Increasing

---

### 📞 Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Astro Docs**: https://docs.astro.build
- **Turso Docs**: https://docs.turso.tech
- **Cloudinary Docs**: https://cloudinary.com/documentation

---

### 🎉 Deployment Complete!

Your site is now live at: **https://animedia.web.id**

**Next Steps:**
1. Share on social media
2. Submit to Google Search Console
3. Monitor analytics
4. Keep creating great content!

---

**Happy Deploying! 🚀**
