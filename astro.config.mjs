import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://animedia.web.id',
  output: 'server',
  adapter: vercel(),
  integrations: [
    tailwind(),
    sitemap({
      filter: (page) => !/(\/dashboard|admin|api|profil)/.test(page)
    })
  ],
  vite: {
    define: {
      'process.env.TURSO_DATABASE_URL': JSON.stringify(process.env.TURSO_DATABASE_URL),
      'process.env.TURSO_AUTH_TOKEN': JSON.stringify(process.env.TURSO_AUTH_TOKEN),
    }
  }
});
