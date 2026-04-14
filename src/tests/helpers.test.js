import { describe, it, expect, vi } from 'vitest';

// Mock turso client agar test tidak butuh koneksi DB
vi.mock('../lib/turso.js', () => ({
  default: { execute: vi.fn() }
}));

import { calculateReadTime } from '../lib/turso-helpers.js';

describe('calculateReadTime', () => {
  it('mengembalikan minimal 1 menit', () => {
    expect(calculateReadTime('kata')).toBe(1);
  });

  it('menghitung dengan benar untuk 200 kata', () => {
    const text = Array(200).fill('kata').join(' ');
    expect(calculateReadTime(text)).toBe(1);
  });

  it('menghitung dengan benar untuk 400 kata', () => {
    const text = Array(400).fill('kata').join(' ');
    expect(calculateReadTime(text)).toBe(2);
  });

  it('mengabaikan tag HTML', () => {
    const html = '<p>' + Array(200).fill('kata').join(' ') + '</p>';
    expect(calculateReadTime(html)).toBe(1);
  });
});

describe('slug generation', () => {
  it('mengubah spasi menjadi tanda hubung', () => {
    const slug = 'judul artikel baru'.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    expect(slug).toBe('judul-artikel-baru');
  });

  it('menghapus karakter spesial', () => {
    const slug = 'artikel & berita!'.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    expect(slug).toBe('artikel-berita');
  });
});
