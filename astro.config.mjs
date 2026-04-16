import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://animedia.web.id',
  output: 'server',
  adapter: vercel(),
  security: {
    checkOrigin: false,
  },
  integrations: [
    tailwind(),
    sitemap({
      filter: (page) => !/(\/dashboard|admin|api|profil)/.test(page)
    })
  ],
  vite: {
    ssr: {
      noExternal: ['@libsql/client']
    }
  }
});
