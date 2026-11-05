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
  names: { quote: 'offertforfragan', application: 'jobbansokan' },
};

export const ANALYTICS = {
  provider: (import.meta.env.PUBLIC_ANALYTICS_PROVIDER || '') as '' | 'plausible',
  domain: import.meta.env.PUBLIC_ANALYTICS_DOMAIN || '',
  src: import.meta.env.PUBLIC_ANALYTICS_SRC || 'https://plausible.io/js/script.js',
};

export const analyticsEnabled = ANALYTICS.provider !== '' && ANALYTICS.domain !== '';
