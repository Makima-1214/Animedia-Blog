import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://animedia.web.id',
  output: 'server',
  adapter: vercel(),
  security: {
    checkOrigin: false,
  },
  integrations: [
    tailwind(),
    // Sitemap dinonaktifkan karena menggunakan sitemap dinamis custom di src/pages/sitemap.xml.ts
    // sitemap({
    //   filter: (page) => !/(\/dashboard|admin|api|profil)/.test(page)
    // })
  ],
  vite: {
    ssr: {
      noExternal: ['@libsql/client']
    }
  }
});
