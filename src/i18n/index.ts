import sv from './sv.json';
import enJson from './en.json';
import type { Locale } from './routes';
import type { Localized } from '../config/company';

// en.json must have exactly the same shape as sv.json – type errors point at missing keys.
const en: typeof sv = enJson;

export type Dict = typeof sv;
const DICTS: Record<Locale, Dict> = { sv, en };

export const useT = (locale: Locale): Dict => DICTS[locale];

/** Pick the right language from a { sv, en } config value. */
export const l = (value: Localized, locale: Locale) => value[locale];

/** Replace {name} tokens in a string. */
export const fmt = (template: string, vars: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? `{${k}}`));

export const formatDate = (date: Date, locale: Locale, style: 'long' | 'short' = 'long') =>
  new Intl.DateTimeFormat(locale === 'sv' ? 'sv-SE' : 'en-GB', {
    day: 'numeric',
    month: style === 'long' ? 'long' : 'short',
    year: 'numeric',
    timeZone: 'Europe/Stockholm',
  }).format(date);
