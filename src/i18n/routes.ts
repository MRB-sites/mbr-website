/**
 * Route registry: every page and its URL in each language.
 * Change a slug here and all links, hreflang tags and the language switcher follow.
 */
export const LOCALES = ['sv', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'sv';
export const HTML_LANG: Record<Locale, string> = { sv: 'sv-SE', en: 'en-GB' };
export const OG_LOCALE: Record<Locale, string> = { sv: 'sv_SE', en: 'en_GB' };

export const ROUTES = {
  home: { sv: '/', en: '/en/' },
  services: { sv: '/tjanster/', en: '/en/services/' },
  'service.rivning': { sv: '/tjanster/rivning/', en: '/en/services/demolition/' },
  'service.sanering': { sv: '/tjanster/sanering/', en: '/en/services/remediation/' },
  'service.haltagning': { sv: '/tjanster/haltagning/', en: '/en/services/concrete-cutting/' },
  'service.nybyggnation': { sv: '/tjanster/nybyggnation/', en: '/en/services/new-construction/' },
  'service.ombyggnad': { sv: '/tjanster/ombyggnad-renovering/', en: '/en/services/renovation/' },
  'service.avfall': { sv: '/tjanster/avfall-containrar/', en: '/en/services/waste-containers/' },
  projects: { sv: '/projekt/', en: '/en/projects/' },
  environment: { sv: '/miljo-sakerhet/', en: '/en/environment-safety/' },
  about: { sv: '/om-oss/', en: '/en/about/' },
  news: { sv: '/nyheter/', en: '/en/news/' },
  careers: { sv: '/karriar/', en: '/en/careers/' },
  careersThanks: { sv: '/karriar/tack/', en: '/en/careers/thank-you/' },
  contact: { sv: '/kontakt/', en: '/en/contact/' },
  contactThanks: { sv: '/kontakt/tack/', en: '/en/contact/thank-you/' },
  privacy: { sv: '/integritetspolicy/', en: '/en/privacy-policy/' },
  cookies: { sv: '/cookies/', en: '/en/cookies/' },
  accessibility: { sv: '/tillganglighet/', en: '/en/accessibility/' },
} as const satisfies Record<string, Record<Locale, string>>;

export type RouteKey = keyof typeof ROUTES;

export const path = (key: RouteKey, locale: Locale): string => ROUTES[key][locale];

/** Detail pages (projects, news, jobs) live below their list page. */
export const detailPath = (key: 'projects' | 'news' | 'careers', slug: string, locale: Locale) => `${ROUTES[key][locale]}${slug}/`;

/** Anchor to the quote form. */
export const quotePath = (locale: Locale, service?: string) =>
  `${ROUTES.contact[locale]}${service ? `?tjanst=${encodeURIComponent(service)}` : ''}#offert`;

export type Alternates = Record<Locale, string>;
