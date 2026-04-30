# 🐛 Bugfix: TypeScript Type Errors

## Issue
TypeScript errors pada view counter karena tipe `Value` dari database tidak bisa langsung dibandingkan dengan `number`.

## Error Messages
```
Operator '>' cannot be applied to types 'Value' and 'number'
Operator '/' cannot be applied to types 'Value' and 'number'
The left-hand side of an arithmetic operation must be of type 'any', 'number', 'bigint' or an enum type
```

## Root Cause
Database library (`@libsql/client`) mengembalikan tipe `Value` yang bisa berupa `string | number | null | undefined`. TypeScript tidak bisa melakukan operasi matematika langsung pada tipe ini.

## Solution
Wrap semua operasi dengan `Number()` untuk explicit type casting.

### Before (Error):
```typescript
{article.views && article.views > 0 && (
  <span>
    {article.views > 1000 ? `${(article.views / 1000).toFixed(1)}k` : article.views}
  </span>
)}
```

### After (Fixed):
```typescript
{article.views && Number(article.views) > 0 && (
  <span>
    {Number(article.views) > 1000 ? `${(Number(article.views) / 1000).toFixed(1)}k` : article.views}
  </span>
)}
```

## Files Modified
- `src/pages/index.astro` - Fixed 5 instances of view counter

## Verification
```bash
npm run build
# ✅ Build successful with no TypeScript errors
```

## Status
✅ **FIXED** - All TypeScript errors resolved

## Date
April 30, 2026
