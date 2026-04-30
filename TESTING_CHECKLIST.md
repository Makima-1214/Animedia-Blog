# ✅ Testing Checklist - Animedia Blog

## Pre-Deployment Testing

### 🖥️ Desktop Testing (Chrome, Firefox, Safari, Edge)

#### Homepage
- [ ] Hero article loads with image
- [ ] Hero article has proper gradient overlay
- [ ] Headline badge has pulse animation
- [ ] View counter displays correctly (if > 0)
- [ ] Article grid shows 6 articles
- [ ] Article cards have hover effects (scale, shadow)
- [ ] Category badges visible and clickable
- [ ] "Berita Terbaru" section loads 8 articles
- [ ] "Lihat Semua Artikel" button visible and works
- [ ] Sidebar trending section shows 5 articles
- [ ] Sidebar categories show article counts
- [ ] Newsletter CTA in sidebar works
- [ ] Stats widget shows correct numbers
- [ ] Breaking news banner displays (if set)
- [ ] All images load with lazy loading
- [ ] Dark mode toggle works
- [ ] Search functionality works
- [ ] Category navigation works
- [ ] Footer loads correctly

#### Article Page
- [ ] Article content loads
- [ ] Cover image displays
- [ ] Author info shows
- [ ] Published date shows
- [ ] Read time shows
- [ ] View counter increments
- [ ] Comments section works
- [ ] Related articles show
- [ ] Share buttons work
- [ ] Dark mode works

#### Other Pages
- [ ] `/artikel` - All articles page loads
- [ ] `/kategori/[slug]` - Category pages work
- [ ] `/tag/[slug]` - Tag pages work
- [ ] `/toko` - Shop page loads
- [ ] `/berlangganan` - Newsletter page works
- [ ] `/tentang` - About page loads
- [ ] `/kontak` - Contact page loads
- [ ] `/privasi` - Privacy page loads
- [ ] `/disclaimer` - Disclaimer page loads

---

### 📱 Mobile Testing (iOS Safari, Chrome Mobile, Samsung Internet)

#### Homepage Mobile
- [ ] Hero article responsive
- [ ] Hero text readable (not too small)
- [ ] Trending horizontal scroll works
- [ ] Trending cards show view count badges
- [ ] Category pills scroll horizontally
- [ ] Article grid shows 2 columns
- [ ] Article cards properly sized
- [ ] "Berita Terbaru" cards horizontal layout
- [ ] Newsletter banner at bottom shows
- [ ] Sticky newsletter bar appears after scroll (5s)
- [ ] Sticky bar dismissible (X button works)
- [ ] Sticky bar remembers dismissal (localStorage)
- [ ] Mobile menu toggle works
- [ ] Mobile search expandable works
- [ ] Touch targets minimum 44x44px
- [ ] No horizontal scroll issues
- [ ] Images load properly
- [ ] Dark mode toggle accessible

#### Mobile Navigation
- [ ] Hamburger menu opens/closes
- [ ] Menu items clickable
- [ ] Category links work
- [ ] Search expands properly
- [ ] Search results show
- [ ] User menu works
- [ ] Dark mode toggle works

#### Mobile Performance
- [ ] Page loads in < 3 seconds
- [ ] Images lazy load
- [ ] No layout shift (CLS)
- [ ] Smooth scrolling
- [ ] No janky animations

---

### 🎨 Visual Testing

#### Typography
- [ ] All text readable (minimum 11px)
- [ ] Font weights correct (400, 600, 700, 800)
- [ ] Line heights comfortable
- [ ] No text overflow
- [ ] Proper text truncation (line-clamp)

#### Colors & Contrast
- [ ] Text readable on backgrounds (WCAG AA)
- [ ] Links distinguishable
- [ ] Buttons have proper contrast
- [ ] Dark mode colors appropriate
- [ ] Gradient overlays work

#### Spacing
- [ ] Consistent padding
- [ ] Consistent margins
- [ ] Proper gap between elements
- [ ] No elements touching edges
- [ ] Comfortable white space

#### Animations
- [ ] Hover effects smooth
- [ ] Transitions not too fast/slow
- [ ] No janky animations
- [ ] Pulse animation on headline badge
- [ ] Scale effects on images
- [ ] Shadow transitions on cards

---

### ⚡ Performance Testing

#### Lighthouse Audit (Chrome DevTools)
```bash
# Run Lighthouse audit
# Target scores:
Performance: 90+
Accessibility: 95+
Best Practices: 95+
SEO: 95+
```

- [ ] Performance score: ___/100
- [ ] Accessibility score: ___/100
- [ ] Best Practices score: ___/100
- [ ] SEO score: ___/100

#### Core Web Vitals
- [ ] First Contentful Paint (FCP): < 1.8s
- [ ] Largest Contentful Paint (LCP): < 2.5s
- [ ] First Input Delay (FID): < 100ms
- [ ] Cumulative Layout Shift (CLS): < 0.1
- [ ] Time to Interactive (TTI): < 3.8s
- [ ] Total Blocking Time (TBT): < 300ms

#### Network
- [ ] Images optimized (WebP/AVIF)
- [ ] Images lazy loaded
- [ ] Fonts preloaded
- [ ] No render-blocking resources
- [ ] Proper caching headers

---

### 🔍 SEO Testing

#### Meta Tags
- [ ] Title tag present and unique
- [ ] Meta description present (150-160 chars)
- [ ] Meta keywords present
- [ ] Canonical URL correct
- [ ] Open Graph tags present
- [ ] Twitter Card tags present
- [ ] Robots meta tag correct

#### Structured Data
- [ ] Schema.org markup (if applicable)
- [ ] Article schema on article pages
- [ ] Organization schema on homepage
- [ ] Breadcrumb schema (if applicable)

#### Sitemap & Robots
- [ ] `/sitemap.xml` accessible
- [ ] Sitemap has all pages
- [ ] Sitemap has lastmod dates
- [ ] `/robots.txt` accessible
- [ ] Robots.txt allows crawling
- [ ] Robots.txt references sitemap

#### URLs
- [ ] URLs clean (no trailing slashes inconsistency)
- [ ] URLs descriptive
- [ ] No broken links
- [ ] Internal links work
- [ ] External links open in new tab (if applicable)

---

### ♿ Accessibility Testing

#### Keyboard Navigation
- [ ] Tab order logical
- [ ] All interactive elements focusable
- [ ] Focus indicators visible
- [ ] Skip to content link (if applicable)
- [ ] No keyboard traps

#### Screen Reader
- [ ] Images have alt text
- [ ] Links have descriptive text
- [ ] Buttons have labels
- [ ] Form inputs have labels
- [ ] ARIA labels where needed
- [ ] Heading hierarchy correct (h1, h2, h3)

#### Color & Contrast
- [ ] Text contrast ratio ≥ 4.5:1 (normal text)
- [ ] Text contrast ratio ≥ 3:1 (large text)
- [ ] Links distinguishable without color alone
- [ ] Focus indicators visible

#### Forms
- [ ] Labels associated with inputs
- [ ] Error messages clear
- [ ] Required fields marked
- [ ] Validation messages accessible

---

### 🔐 Security Testing

#### Headers
- [ ] HTTPS enabled
- [ ] Content-Security-Policy set
- [ ] X-Frame-Options set
- [ ] X-Content-Type-Options set
- [ ] Referrer-Policy set

#### Forms
- [ ] CSRF protection enabled
- [ ] Input validation works
- [ ] XSS protection enabled
- [ ] SQL injection protection

#### Authentication
- [ ] Login works
- [ ] Logout works
- [ ] Session management secure
- [ ] Password requirements enforced
- [ ] Email verification works

---

### 🧪 Functional Testing

#### Search
- [ ] Search input works
- [ ] Search results accurate
- [ ] Search results clickable
- [ ] No results message shows
- [ ] Search on mobile works

#### Newsletter
- [ ] Subscription form works
- [ ] Email validation works
- [ ] Success message shows
- [ ] Error handling works
- [ ] Confirmation email sent

#### Comments (if enabled)
- [ ] Comment form works
- [ ] Comments display
- [ ] Comment moderation works
- [ ] Reply functionality works

#### User Account
- [ ] Registration works
- [ ] Login works
- [ ] Logout works
- [ ] Profile update works
- [ ] Password change works
- [ ] Email verification works

---

### 🌐 Cross-Browser Testing

#### Desktop Browsers
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

#### Mobile Browsers
- [ ] iOS Safari
- [ ] Chrome Mobile (Android)
- [ ] Samsung Internet
- [ ] Firefox Mobile

#### Tablet
- [ ] iPad Safari
- [ ] Android Chrome

---

### 📊 Analytics Testing

#### Google Analytics
- [ ] GA tracking code present
- [ ] Page views tracked
- [ ] Events tracked (if applicable)
- [ ] Real-time data shows

#### Vercel Analytics
- [ ] Analytics enabled
- [ ] Data collecting
- [ ] Dashboard accessible

---

### 🐛 Error Handling

#### 404 Page
- [ ] Custom 404 page shows
- [ ] 404 page styled correctly
- [ ] Links back to homepage work

#### Error States
- [ ] No articles message shows
- [ ] No search results message shows
- [ ] Loading states show
- [ ] Error messages clear

#### Console Errors
- [ ] No JavaScript errors
- [ ] No CSS errors
- [ ] No 404 errors for assets
- [ ] No CORS errors

---

### 🔄 Edge Cases

#### Content
- [ ] Long article titles truncate properly
- [ ] Short article titles display well
- [ ] No articles state handled
- [ ] Many articles (100+) handled
- [ ] Special characters in titles work
- [ ] Emoji in content work

#### Images
- [ ] Missing images show placeholder
- [ ] Large images load properly
- [ ] Small images don't pixelate
- [ ] Image aspect ratios maintained

#### Data
- [ ] Empty categories handled
- [ ] No trending articles handled
- [ ] No breaking news handled
- [ ] Database connection errors handled

---

## Testing Tools

### Automated Testing
```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch
```

### Manual Testing Tools
- **Chrome DevTools** - Performance, Network, Console
- **Lighthouse** - Performance audit
- **WAVE** - Accessibility testing
- **axe DevTools** - Accessibility testing
- **Responsive Design Mode** - Mobile testing
- **BrowserStack** - Cross-browser testing

### Online Tools
- **PageSpeed Insights**: https://pagespeed.web.dev/
- **GTmetrix**: https://gtmetrix.com/
- **WebPageTest**: https://www.webpagetest.org/
- **Mobile-Friendly Test**: https://search.google.com/test/mobile-friendly
- **Rich Results Test**: https://search.google.com/test/rich-results
- **Security Headers**: https://securityheaders.com/

---

## Sign-Off

### Tested By: ________________
### Date: ________________
### Environment: ☐ Local ☐ Staging ☐ Production

### Overall Status:
- [ ] All critical tests passed
- [ ] All high-priority tests passed
- [ ] Known issues documented
- [ ] Ready for deployment

### Notes:
```
[Add any notes, issues, or observations here]
```

---

**Happy Testing! 🧪**
