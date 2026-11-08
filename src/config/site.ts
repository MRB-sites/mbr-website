/**
 * Technical site settings (forms, analytics). Values come from environment
 * variables – see .env.example. Company facts live in ./company.ts.
 */

const provider = (import.meta.env.PUBLIC_FORM_PROVIDER || 'netlify') as 'netlify' | 'formspree' | 'custom';

export const FORMS = {
  /** "netlify" posts to Netlify Forms; "formspree"/"custom" posts to PUBLIC_FORM_ENDPOINT. */
  provider,
  endpoint: provider === 'netlify' ? '' : import.meta.env.PUBLIC_FORM_ENDPOINT || '[https://formspree.io/f/XXXXXXX]',
  /** Upload limits for the quote form (Netlify Forms caps a submission at about 8 MB). */
  maxFiles: 5,
  maxTotalMb: 8,
  accept: 'image/jpeg,image/png,image/webp,image/heic,application/pdf',
  names: { quote: 'offertforfragan', application: 'jobbansokan', advice: 'radgivning' },
};

/**
 * n8n webhooks for the quote form ("Begär offert") and the advice button ("Kontakt för rådgivning").
 * 'test'       → /webhook-test/ URLs. Only answer while "Listen for test event" is running in the n8n editor.
 * 'production' → /webhook/ URLs. Only answer while the n8n workflow is switched to Active.
 */
export const N8N_MODE = 'production' as 'test' | 'production';
const N8N_BASE = 'https://meggamind.app.n8n.cloud';
const n8nHook = (name: string) => `${N8N_BASE}/${N8N_MODE === 'production' ? 'webhook' : 'webhook-test'}/${name}`;

export const WEBHOOKS = {
  quote: n8nHook('mbr-offert'),
  advice: n8nHook('mbr'),
};

export const ANALYTICS = {
  provider: (import.meta.env.PUBLIC_ANALYTICS_PROVIDER || '') as '' | 'plausible',
  domain: import.meta.env.PUBLIC_ANALYTICS_DOMAIN || '',
  src: import.meta.env.PUBLIC_ANALYTICS_SRC || 'https://plausible.io/js/script.js',
};

export const analyticsEnabled = ANALYTICS.provider !== '' && ANALYTICS.domain !== '';
