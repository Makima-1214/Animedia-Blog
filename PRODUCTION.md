# 🚀 Production Deployment Guide

Panduan deploy Animedia Blog ke production dengan email verification.

---

## ⚠️ Pre-Production Checklist

### Security
- [ ] Ganti admin password default
- [ ] Gunakan HTTPS (SSL certificate)
- [ ] Set `secure: true` untuk cookies
- [ ] Gunakan environment variables untuk secrets
- [ ] Jangan commit `.env` ke Git
- [ ] Enable CORS protection
- [ ] Rate limiting untuk API endpoints

### Email Service
- [ ] **JANGAN** gunakan Gmail untuk production
- [ ] Gunakan email service profesional (SendGrid/Mailgun/AWS SES)
- [ ] Setup SPF, DKIM, DMARC records
- [ ] Verify domain untuk email sender

### Database
- [ ] Backup database secara berkala
- [ ] Setup database monitoring
- [ ] Optimize indexes
- [ ] Set max connections

### Performance
- [ ] Enable caching
- [ ] Optimize images
- [ ] Minify CSS/JS
- [ ] Enable compression (gzip/brotli)
- [ ] Setup CDN untuk static assets

---

## 📧 Email Service Setup (Production)

### Option 1: SendGrid (Recommended)

**Pros:**
- Free tier: 100 email/hari
- Deliverability tinggi
- Easy setup
- Good documentation

**Setup:**

1. **Daftar SendGrid**
   - Buka: https://sendgrid.com
   - Sign up (free account)
   - Verify email

2. **Create API Key**
   - Dashboard → Settings → API Keys
   - Create API Key
   - Name: "Animedia Production"
   - Permissions: Full Access
   - Copy API Key

3. **Update Code**

```typescript
// src/lib/email.ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_API_KEY
  }
});
```

4. **Update .env**
```env
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxx
```

5. **Verify Domain**
   - Dashboard → Settings → Sender Authentication
   - Authenticate Your Domain
   - Follow DNS setup instructions

---

### Option 2: Mailgun

**Pros:**
- Free tier: 5000 email/bulan
- Simple API
- Good for transactional emails

**Setup:**

1. **Daftar Mailgun**
   - Buka: https://www.mailgun.com
   - Sign up (free account)

2. **Get Credentials**
   - Dashboard → Sending → Domain settings
   - Copy SMTP credentials

3. **Update Code**

```typescript
// src/lib/email.ts
const transporter = nodemailer.createTransport({
  host: 'smtp.mailgun.org',
  port: 587,
  auth: {
    user: process.env.MAILGUN_SMTP_USER,
    pass: process.env.MAILGUN_SMTP_PASS
  }
});
```

4. **Update .env**
```env
MAILGUN_SMTP_USER=postmaster@your-domain.mailgun.org
MAILGUN_SMTP_PASS=your-smtp-password
```

---

### Option 3: AWS SES

**Pros:**
- Cheapest: $0.10 per 1000 email
- Unlimited scale
- AWS integration

**Cons:**
- Butuh AWS account
- Setup lebih kompleks

**Setup:**

1. **Setup AWS SES**
   - Login AWS Console
   - Services → SES
   - Verify domain
   - Request production access

2. **Create SMTP Credentials**
   - SES → SMTP Settings
   - Create SMTP Credentials
   - Download credentials

3. **Update Code**

```typescript
// src/lib/email.ts
const transporter = nodemailer.createTransport({
  host: 'email-smtp.us-east-1.amazonaws.com',
  port: 587,
  auth: {
    user: process.env.AWS_SES_SMTP_USER,
    pass: process.env.AWS_SES_SMTP_PASS
  }
});
```

---

## 🔐 Security Hardening

### 1. Change Admin Password

```bash
# Hash new password
node scripts/hash-admin-password.js
```

Update database:
```sql
UPDATE admins SET password_hash = 'new-hash' WHERE username = 'admin';
```

### 2. Environment Variables

**NEVER commit these to Git:**
```env
# Email
EMAIL_USER=
EMAIL_PASSWORD=
SENDGRID_API_KEY=

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Admin
ADMIN_PASSWORD_HASH=

# Session Secret
SESSION_SECRET=random-32-char-string
```

### 3. Rate Limiting

Install:
```bash
npm install express-rate-limit
```

Add middleware:
```typescript
// src/middleware/rateLimit.ts
import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Terlalu banyak percobaan login. Coba lagi nanti.'
});
```

Apply to login/register endpoints.

### 4. HTTPS Only

```typescript
// astro.config.mjs
export default defineConfig({
  server: {
    headers: {
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
    }
  }
});
```

---

## 🌐 Deployment Platforms

### Option 1: Vercel (Recommended)

**Pros:**
- Free tier
- Auto SSL
- Easy deployment
- Good performance

**Steps:**

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Login**
```bash
vercel login
```

3. **Deploy**
```bash
vercel
```

4. **Set Environment Variables**
```bash
vercel env add EMAIL_USER
vercel env add EMAIL_PASSWORD
vercel env add SENDGRID_API_KEY
```

5. **Deploy Production**
```bash
vercel --prod
```

**Note:** Vercel uses serverless functions. SQLite might not work. Consider using:
- PostgreSQL (Vercel Postgres)
- MySQL (PlanetScale)
- MongoDB (MongoDB Atlas)

---

### Option 2: Netlify

**Pros:**
- Free tier
- Auto SSL
- Form handling
- Edge functions

**Steps:**

1. **Install Netlify CLI**
```bash
npm install -g netlify-cli
```

2. **Login**
```bash
netlify login
```

3. **Deploy**
```bash
netlify deploy --prod
```

4. **Set Environment Variables**
- Dashboard → Site settings → Environment variables
- Add all env vars

**Note:** Same as Vercel, consider using external database.

---

### Option 3: VPS (DigitalOcean/Linode)

**Pros:**
- Full control
- SQLite works
- No serverless limitations

**Steps:**

1. **Create Droplet**
   - Ubuntu 22.04
   - 1GB RAM minimum
   - $6/month

2. **SSH to Server**
```bash
ssh root@your-server-ip
```

3. **Install Node.js**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

4. **Install PM2**
```bash
npm install -g pm2
```

5. **Clone & Setup**
```bash
git clone <your-repo>
cd blogWebsite
npm install
npm run build
```

6. **Create .env**
```bash
nano .env
# Paste production env vars
```

7. **Start with PM2**
```bash
pm2 start npm --name "animedia" -- start
pm2 save
pm2 startup
```

8. **Setup Nginx**
```bash
sudo apt install nginx
sudo nano /etc/nginx/sites-available/animedia
```

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:4321;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/animedia /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

9. **Setup SSL (Let's Encrypt)**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

---

## 📊 Monitoring & Logging

### 1. Error Tracking

Install Sentry:
```bash
npm install @sentry/node
```

Setup:
```typescript
// src/lib/sentry.ts
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
});
```

### 2. Email Monitoring

Track:
- Delivery rate
- Bounce rate
- Open rate
- Click rate

SendGrid/Mailgun provide dashboards for this.

### 3. Database Backup

**Automated backup script:**
```bash
#!/bin/bash
# backup-db.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
DB_FILE="/path/to/data/blog.db"

cp $DB_FILE $BACKUP_DIR/blog_$DATE.db

# Keep only last 30 days
find $BACKUP_DIR -name "blog_*.db" -mtime +30 -delete
```

**Cron job:**
```bash
crontab -e
# Add: Daily backup at 2 AM
0 2 * * * /path/to/backup-db.sh
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 📈 Performance Optimization

### 1. Image Optimization

Use Cloudinary transformations:
```typescript
const imageUrl = `https://res.cloudinary.com/${cloudName}/image/upload/w_800,q_auto,f_auto/${publicId}`;
```

### 2. Caching

Add cache headers:
```typescript
// For static assets
export const GET: APIRoute = async () => {
  return new Response(data, {
    headers: {
      'Cache-Control': 'public, max-age=31536000, immutable'
    }
  });
};
```

### 3. Database Indexes

```sql
CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_articles_created ON articles(created_at);
CREATE INDEX idx_comments_article ON comments(article_id);
CREATE INDEX idx_sessions_token ON sessions(token);
```

---

## ✅ Production Launch Checklist

### Pre-Launch
- [ ] All tests passing
- [ ] Email service configured (SendGrid/Mailgun)
- [ ] Domain verified for email
- [ ] SSL certificate installed
- [ ] Environment variables set
- [ ] Database backed up
- [ ] Admin password changed
- [ ] Rate limiting enabled
- [ ] Error tracking setup (Sentry)
- [ ] Monitoring setup

### Launch
- [ ] Deploy to production
- [ ] Test email verification flow
- [ ] Test login/register
- [ ] Test admin dashboard
- [ ] Test comment system
- [ ] Test newsletter subscription
- [ ] Check all pages load
- [ ] Check mobile responsive

### Post-Launch
- [ ] Monitor error logs
- [ ] Monitor email delivery
- [ ] Monitor server resources
- [ ] Setup automated backups
- [ ] Setup uptime monitoring
- [ ] Document any issues

---

## 🆘 Emergency Procedures

### Email Service Down
1. Check service status page
2. Switch to backup email service
3. Update environment variables
4. Restart application

### Database Corruption
1. Stop application
2. Restore from latest backup
3. Verify data integrity
4. Restart application

### High Traffic Spike
1. Enable caching
2. Scale server resources
3. Enable CDN
4. Rate limit aggressive IPs

---

## 📞 Support Resources

- **SendGrid Docs:** https://docs.sendgrid.com
- **Mailgun Docs:** https://documentation.mailgun.com
- **AWS SES Docs:** https://docs.aws.amazon.com/ses
- **Vercel Docs:** https://vercel.com/docs
- **Netlify Docs:** https://docs.netlify.com

---

**Good luck with your production deployment! 🚀**
