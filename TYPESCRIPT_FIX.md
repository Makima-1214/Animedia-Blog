# 🔧 TypeScript Error Fixes

## Problem
Database returns `Value` type from `@libsql/client` which can be:
- `string`
- `number`
- `bigint`
- `null`
- `Uint8Array`

This causes TypeScript errors when assigning to `string` properties.

## Solution
Created type helper functions in `src/lib/type-helpers.ts`:

```typescript
export function toString(value: Value | undefined | null): string
export function toNumber(value: Value | undefined | null): number
export function toBoolean(value: Value | undefined | null): boolean
export function toDate(value: Value | undefined | null): Date | null
```

## Usage

### Before (Error):
```astro
<BaseLayout title={article.title} />
<img src={article.cover_image} alt={article.title} />
```

### After (Fixed):
```astro
import { toString } from '../../lib/type-helpers';

<BaseLayout title={toString(article.title)} />
<img src={toString(article.cover_image)} alt={toString(article.title)} />
```

## Files Fixed
- [x] `src/lib/type-helpers.ts` - Created helper functions
- [x] `src/pages/artikel/[slug].astro` - Applied toString() helpers

## Remaining Files to Fix
- [ ] `src/pages/404.astro`
- [ ] `src/pages/profil.astro`
- [ ] `src/pages/artikel/index.astro`
- [ ] `src/pages/dashboard/artikel/edit/[id].astro`
- [ ] `src/pages/dashboard/tags.astro`
- [ ] `src/pages/api/auth/change-password.ts`
- [ ] `src/components/Header.astro` (window.darkMode, window.advancedSearch)
- [ ] `src/components/LoadingStates.astro` (window properties)

## Quick Fix Pattern

For any Value type error, wrap with appropriate helper:
```typescript
// String values
toString(value)

// Number values
toNumber(value)

// Boolean values
toBoolean(value)

// Date values
toDate(value)
```

## Status
🔄 In Progress - Main article page fixed, other pages need similar fixes
