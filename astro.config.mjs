// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { loadEnv } from 'vite';

const env = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '');

// Set PUBLIC_SITE_URL in .env / your host's environment, e.g. https://www.dittforetag.se
const site = env.PUBLIC_SITE_URL || 'https://www.example.se';
// Subfolder hosting, e.g. '/mbr-website' for the GitHub Pages preview. Leave empty on the real domain.
const base = env.PUBLIC_BASE_PATH || undefined;

export default defineConfig({
  site,
  base,
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [
    sitemap({
      filter: (page) => !/\/(tack|thank-you)\/?$/.test(page),
    }),
  ],
  image: {
    // Off: components size images with Tailwind classes (Astro’s unlayered styles would override them).
    responsiveStyles: false,
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
