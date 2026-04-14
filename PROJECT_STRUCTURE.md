# Struktur Project Lengkap

Dokumentasi lengkap tentang struktur folder dan file dalam project.

## 📁 Root Directory

```
blog-astro/
├── db/                      # Database configuration
├── src/                     # Source code
├── public/                  # Static assets (akan dibuat otomatis)
├── .astro/                  # Astro cache (auto-generated)
├── dist/                    # Build output (auto-generated)
├── node_modules/            # Dependencies
├── .env                     # Environment variables
├── .env.example             # Environment template
├── .gitignore              # Git ignore rules
├── astro.config.mjs        # Astro configuration
├── package.json            # Project dependencies
├── tailwind.config.mjs     # Tailwind CSS config
├── tsconfig.json           # TypeScript config
├── README.md               # Main documentation
├── QUICKSTART.md           # Quick start guide
├── SETUP.md                # Detailed setup guide
├── MIGRATION.md            # Migration guide
├── API.md                  # API documentation
├── AUTH_OPTIONS.md         # Auth comparison
└── PROJECT_STRUCTURE.md    # This file
```

---

## 📂 Database (`db/`)

```
db/
├── config.ts               # Database schema definition
└── seed.ts                 # Seed data for development
```

### `config.ts`
Mendefinisikan struktur database dengan AstroDB:
- Tables: User, Session, Account, Category, Article, Comment, Bookmark
- Columns & types
- Relationships (foreign keys)

### `seed.ts`
Data awal untuk development:
- Demo categories
- Demo user
- Sample articles

---

## 📂 Source Code (`src/`)

```
src/
├── components/             # Reusable components
├── layouts/                # Page layouts
├── lib/                    # Utilities & helpers
├── pages/                  # Routes & pages
└── env.d.ts               # TypeScript environment types
```

### Components (`src/components/`)

```
components/
└── Header.astro           # Navigation header
```

**Header.astro**
- Logo & brand
- Search bar
- Navigation menu
- Login button
- Category links

**Cara Menambah Component:**
```astro
---
// src/components/Footer.astro
---
<footer>
  <!-- Footer content -->
</footer>
```

Gunakan di page:
```astro
---
import Footer from '../components/Footer.astro';
---
<Footer />
```

---

### Layouts (`src/layouts/`)

```
layouts/
└── BaseLayout.astro       # Base HTML structure
```

**BaseLayout.astro**
- HTML head (meta tags, fonts, styles)
- Global styles
- Slot untuk content

**Props:**
- `title` - Page title
- `description` - Meta description

**Usage:**
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="My Page">
  <h1>Content here</h1>
</BaseLayout>
```

---

### Library (`src/lib/`)

```
lib/
├── auth.ts                # Better Auth configuration
└── utils.ts               # Utility functions
```

**auth.ts**
- Better Auth setup
- Database connection
- OAuth providers config
- Session management

**utils.ts**
Helper functions:
- `slugify()` - Generate URL-friendly slugs
- `formatDate()` - Format dates to Indonesian
- `calculateReadTime()` - Calculate reading time
- `truncate()` - Truncate text
- `generateId()` - Generate random IDs
- `formatNumber()` - Format numbers
- `getExcerpt()` - Extract excerpt from HTML

---

### Pages (`src/pages/`)

```
pages/
├── index.astro                    # Homepage
├── login.astro                    # Login page
├── register.astro                 # Register page
├── profil.astro                   # User profile
├── artikel/
│   └── [slug].astro              # Article detail (dynamic)
├── kategori/
│   └── [slug].astro              # Category page (dynamic)
├── dashboard/
│   ├── index.astro               # Dashboard overview
│   ├── artikel.astro             # Article management
│   ├── kategori.astro            # Category management
│   ├── komentar.astro            # Comment moderation
│   └── pengaturan.astro          # Settings
└── api/
    └── auth/
        └── [...all].ts           # Better Auth API routes
```

#### Public Pages

**index.astro** - Homepage
- Featured articles slider
- Latest articles list
- Popular posts sidebar
- Category index

**login.astro** - Login Page
- Email/password form
- Google OAuth button
- Link to register

**register.astro** - Register Page
- Registration form
- Social registration
- Link to login

**artikel/[slug].astro** - Article Detail
- Dynamic route (slug parameter)
- Full article content
- Author info
- Comments section
- Related articles

**kategori/[slug].astro** - Category Page
- Articles filtered by category
- Category description
- Pagination

#### Protected Pages (Requires Auth)

**dashboard/index.astro** - Dashboard Overview
- Statistics cards
- Recent articles
- Activity feed
- Quick actions

**dashboard/artikel.astro** - Article Management
- Article list table
- Search & filters
- Create/edit/delete actions
- Status management

**dashboard/kategori.astro** - Category Management
- Category list
- CRUD operations

**dashboard/komentar.astro** - Comment Moderation
- Comment list
- Approve/reject actions

**dashboard/pengaturan.astro** - Settings
- User profile settings
- Account settings

**profil.astro** - User Profile
- User info
- Reading history
- Bookmarks
- Statistics

#### API Routes

**api/auth/[...all].ts**
- Catch-all route for Better Auth
- Handles all auth endpoints:
  - `/api/auth/login`
  - `/api/auth/register`
  - `/api/auth/logout`
  - `/api/auth/session`
  - `/api/auth/callback/*`

---

## 🎨 Styling

### Tailwind Configuration

**tailwind.config.mjs**
- Custom color palette (Material Design 3)
- Custom border radius
- Custom font families
- Plugins: @tailwindcss/forms

### Custom Colors

```javascript
colors: {
  'primary': '#0057ce',        // Main brand color
  'secondary': '#576068',      // Secondary color
  'tertiary': '#605c78',       // Tertiary color
  'surface': '#f7f9ff',        // Background
  'on-surface': '#28343e',     // Text on surface
  'error': '#9f403d',          // Error states
  // ... dan banyak lagi
}
```

### Font Families

```javascript
fontFamily: {
  'headline': ['Inter'],       // For headings
  'body': ['Inter'],           // For body text
  'label': ['Inter']           // For labels
}
```

---

## ⚙️ Configuration Files

### `astro.config.mjs`

```javascript
export default defineConfig({
  output: 'server',              // SSR mode
  adapter: node(),               // Node.js adapter
  integrations: [
    tailwind(),                  // Tailwind CSS
    db()                         // AstroDB
  ]
});
```

### `tsconfig.json`

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react"
  }
}
```

### `package.json`

Scripts:
- `dev` - Development server
- `build` - Production build
- `preview` - Preview build
- `db:push` - Push database schema
- `db:seed` - Seed database

---

## 🗄️ Database Schema

### Tables

1. **User**
   - Authentication & profile data
   - Relations: Articles (author), Comments, Bookmarks, Sessions

2. **Session**
   - User sessions
   - Relations: User

3. **Account**
   - OAuth accounts
   - Relations: User

4. **Category**
   - Article categories
   - Relations: Articles

5. **Article**
   - Blog posts
   - Relations: User (author), Category, Comments, Bookmarks

6. **Comment**
   - Article comments
   - Relations: User, Article

7. **Bookmark**
   - User bookmarks
   - Relations: User, Article

### Relationships

```
User ─┬─ Article (1:N)
      ├─ Comment (1:N)
      ├─ Bookmark (1:N)
      └─ Session (1:N)

Category ── Article (1:N)

Article ─┬─ Comment (1:N)
         └─ Bookmark (1:N)
```

---

## 🔐 Environment Variables

### Required

```env
BETTER_AUTH_SECRET=xxx          # Auth secret key
BETTER_AUTH_URL=xxx             # Base URL
```

### Optional

```env
GOOGLE_CLIENT_ID=xxx            # Google OAuth
GOOGLE_CLIENT_SECRET=xxx        # Google OAuth
DATABASE_URL=xxx                # Database URL
```

---

## 📦 Dependencies

### Production

- `astro` - Framework
- `@astrojs/tailwind` - Tailwind integration
- `@astrojs/db` - Database integration
- `@astrojs/node` - Node adapter
- `better-auth` - Authentication
- `tailwindcss` - CSS framework
- `typescript` - Type safety

### Development

- `@types/node` - Node types
- `@tailwindcss/forms` - Form styles

---

## 🚀 Build Output

### Development

```
.astro/                         # Cache & types
└── types.d.ts                 # Generated types
```

### Production

```
dist/                          # Build output
├── client/                    # Client-side assets
├── server/                    # Server-side code
└── index.html                 # Entry point
```

---

## 📝 File Naming Conventions

### Pages
- `index.astro` - Index/home page
- `about.astro` - Static page
- `[slug].astro` - Dynamic route
- `[...path].astro` - Catch-all route

### Components
- `Header.astro` - PascalCase
- `ArticleCard.astro` - PascalCase

### Utilities
- `utils.ts` - camelCase
- `auth.ts` - camelCase

---

## 🎯 Best Practices

### File Organization
- Group related files together
- Use descriptive names
- Keep components small & focused

### Code Style
- Use TypeScript for type safety
- Follow Astro conventions
- Use Tailwind utility classes
- Comment complex logic

### Database
- Always use transactions for multiple operations
- Index frequently queried columns
- Use foreign keys for relationships

### Performance
- Optimize images
- Minimize JavaScript
- Use SSR for dynamic content
- Cache static assets

---

## 🔄 Adding New Features

### New Page

1. Create file in `src/pages/`
2. Import BaseLayout
3. Add content
4. Access via URL

### New Component

1. Create file in `src/components/`
2. Export component
3. Import in pages
4. Use component

### New Database Table

1. Define in `db/config.ts`
2. Run `npm run db:push`
3. Update seed if needed
4. Use in pages

### New API Endpoint

1. Create file in `src/pages/api/`
2. Export handler function
3. Return Response object
4. Test endpoint

---

## 📚 Further Reading

- [Astro Docs](https://docs.astro.build)
- [Tailwind Docs](https://tailwindcss.com/docs)
- [Better Auth Docs](https://better-auth.com)
- [TypeScript Docs](https://www.typescriptlang.org/docs)

---

**Happy Coding! 🚀**
