// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// 本番の公開URLに合わせて変更してください
export const SITE = 'https://tsunoshima.org';

// https://astro.build/config
export default defineConfig({
  site: SITE,
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  image: {
    // ローカルのCC画像を最適化（AVIF/WebP）
    responsiveStyles: true,
  },
});
