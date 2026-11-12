import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { contentImages } from './scripts/remark-content-images.mjs';
const site = process.env.SITE_URL || 'https://trolljano.github.io';
const base = process.env.BASE_PATH || '/MYWEBPG';
export default defineConfig({
  site,
  base,
  output: 'static',
  trailingSlash: 'always',
  integrations: [mdx(), sitemap({ filter: (url) => !url.endsWith('/404/') })],
  markdown: {
    processor: unified({ remarkPlugins: [[contentImages, { base }]] }),
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: false,
    },
  },
  vite: { plugins: [tailwindcss()] },
});
