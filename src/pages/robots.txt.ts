import type { APIRoute } from 'astro';
import { withBase } from '../i18n/routes';

export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL(withBase('/sitemap-index.xml'), site).href;
  // Preview builds (PUBLIC_NOINDEX=true) block all crawlers.
  const body = import.meta.env.PUBLIC_NOINDEX === 'true' ? 'User-agent: *\nDisallow: /\n' : `User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`;
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
