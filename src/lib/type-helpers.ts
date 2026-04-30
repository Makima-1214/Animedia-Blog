/**
 * Type Helper Functions
 * Converts database Value types to proper TypeScript types
 */

import type { Value } from '@libsql/client';

/**
 * Safely convert Value to string
 */
export function toString(value: Value | undefined | null): string {
  if (value === null || value === undefined) return '';
  return String(value);
}

/**
 * Safely convert Value to number
 */
export function toNumber(value: Value | undefined | null): number {
  if (value === null || value === undefined) return 0;
  return Number(value);
}

/**
 * Safely convert Value to boolean
 */
export function toBoolean(value: Value | undefined | null): boolean {
  if (value === null || value === undefined) return false;
  return Boolean(value);
}

/**
 * Safely convert Value to Date
 */
export function toDate(value: Value | undefined | null): Date | null {
  if (value === null || value === undefined) return null;
  try {
    return new Date(String(value));
  } catch {
    return null;
  }
}

/**
 * Convert article object with proper types
 */
export function toArticle(raw: any) {
  return {
    ...raw,
    id: toString(raw.id),
    title: toString(raw.title),
    slug: toString(raw.slug),
    excerpt: toString(raw.excerpt),
    content: toString(raw.content),
    cover_image: toString(raw.cover_image),
    category_id: toString(raw.category_id),
    read_time: toNumber(raw.read_time),
    views: toNumber(raw.views),
    published_at: toString(raw.published_at),
    updated_at: toString(raw.updated_at),
    created_at: toString(raw.created_at),
  };
}

/**
 * Convert category object with proper types
 */
export function toCategory(raw: any) {
  return {
    ...raw,
    id: toString(raw.id),
    name: toString(raw.name),
    slug: toString(raw.slug),
    description: toString(raw.description),
  };
}

/**
 * Convert tag object with proper types
 */
export function toTag(raw: any) {
  return {
    ...raw,
    id: toString(raw.id),
    name: toString(raw.name),
    slug: toString(raw.slug),
  };
}
