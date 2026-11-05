/**
 * ============================================================================
 *  FÖRETAGSUPPGIFTER / COMPANY CONFIG
 * ============================================================================
 *  All company facts live in this one file.
 *
 *  Empty values ('' or []) are hidden on the site together with the section,
 *  row or button that needs them. Fill a value in and it appears automatically
 *  (e.g. set PHONE and every "Ring oss" button, the phone row and tel: links return).
 *
 *  Never enter numbers, certifications, clients or people that are not true.
 *
 *  Values shown in both languages use { sv: '…', en: '…' }.
 *  Images are referenced by their path below src/assets/
 *  (e.g. 'placeholders/team-1.jpg'). Swap a photo by replacing the file or
 *  by pointing the path at a new file.
 *
 *  Projects are Markdown files in src/content/projects/ (one file per project,
 *  same fields as described in the README) – see "PROJECTS" at the bottom.
 * ============================================================================
 */

export type Localized = { sv: string; en: string };

// --- Identitet ---------------------------------------------------------------
export const COMPANY_NAME = 'Malmö Bygg & Riv AB';
/** Short wordmark shown in the header. Replace with an SVG logo in Header.astro when available. */
export const WORDMARK = 'MBR';
export const ORG_NR = '559097-5214';
/** Säte (registered seat) as stated in Bolagsverket. */
export const SEAT = 'Malmö';
/** Shown in the footer. Only keep if the company is approved for F-tax. */
export const F_TAX_TEXT: Localized = { sv: 'Godkänd för F-skatt', en: 'Approved for F-tax (F-skatt)' };
/** e.g. '2016'. Empty = not shown. */
export const FOUNDED_YEAR = '';

// --- Adress & kontakt --------------------------------------------------------
export const ADDRESS = 'Von Lingens Väg 122, 213 71 Malmö';
/** Structured address used in JSON-LD (search engines). */
export const ADDRESS_PARTS = {
  street: 'Von Lingens Väg 122',
  postalCode: '213 71',
  city: 'Malmö',
  region: 'Skåne län',
  country: 'SE',
};
export const SERVICE_AREA: Localized = { sv: 'Malmö och Skåne', en: 'Malmö and Skåne' };
/** Individual places for JSON-LD "areaServed". */
export const AREA_SERVED = ['Malmö', 'Skåne'];
export const EMAIL = 'info@mbr.se';
/** e.g. '+46 40 123 45 67'. Empty = phone buttons become "Mejla oss". */
export const PHONE = '';
/** e.g. { sv: 'Mån–Fre 07–16', en: 'Mon–Fri 07–16' }. Empty = not shown. */
export const OPENING_HOURS: Localized = { sv: '', en: '' };
/**
 * Opening hours in schema.org format, e.g. ['Mo-Fr 07:00-16:00'].
 * Left empty on purpose until real hours are known (then it is omitted from JSON-LD).
 */
export const OPENING_HOURS_SCHEMA: string[] = [];
/** Optional coordinates for JSON-LD, e.g. { lat: 55.605, lng: 13.0038 }. */
export const GEO: { lat: number; lng: number } | null = null;

/** Expected response time on quote requests, shown on the success screen. */
/** e.g. { sv: 'inom 1 arbetsdag', en: 'within 1 business day' }. Empty = not shown. */
export const RESPONSE_TIME: Localized = { sv: '', en: '' };

// --- Sociala medier ----------------------------------------------------------
/** Full https:// URLs. Empty = icon hidden. INSTAGRAM_URL + INSTAGRAM_IMAGES also enable the Instagram section on the home page. */
export const INSTAGRAM_URL = '';
export const LINKEDIN_URL = '';
export const FACEBOOK_URL = '';
export const INSTAGRAM_HANDLE = '';

// --- Karta --------------------------------------------------------------------
/** Optional static map image below src/assets/ (no tracking iframe), e.g. 'brand/karta.jpg'. Empty = only the Google Maps link. */
export const MAP_IMAGE = '';
export const MAP_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`;

// --- Hero-media ---------------------------------------------------------------
/**
 * Optional muted autoplay video for the home hero (e.g. '/video/hero.mp4' placed in public/video/).
 * Leave empty to show HERO_IMAGE only. The image is always used as poster/fallback.
 */
export const HERO_VIDEO_SRC = '';
export const HERO_IMAGE = 'placeholders/hero.jpg';

// --- Certifieringar & försäkring --------------------------------------------
/** Only what the company actually holds, e.g. ['ID06', 'Asbestbehörighet']. Empty = section hidden. */
export const CERTIFICATIONS: string[] = [];

/** e.g. { insurer: 'Försäkringsbolaget', type: { sv: 'Ansvarsförsäkring', en: 'Liability insurance' }, amount: '10 MSEK' }. null = hidden. */
export const INSURANCE: { insurer: string; type: Localized; amount: string } | null = null;

// --- Löften (trust strip) ----------------------------------------------------
export const PROMISES: { title: Localized; text: Localized }[] = [
  {
    title: { sv: 'Fast pris', en: 'Fixed price' },
    text: { sv: 'Du får ett tydligt pris innan vi börjar.', en: 'You get a clear price before we start.' },
  },
  {
    title: { sv: 'En kontaktperson hela projektet', en: 'One contact for the whole project' },
    text: { sv: 'Samma person från offert till slutbesiktning.', en: 'The same person from quote to final inspection.' },
  },
  {
    title: { sv: 'Vi söker rivningslov åt dig', en: 'We apply for the demolition permit' },
    text: { sv: 'Vi tar fram underlag och sköter kontakten med kommunen.', en: 'We prepare the documents and deal with the municipality.' },
  },
  {
    title: { sv: 'Källsortering enligt gällande regler', en: 'Waste sorting by the rules' },
    text: { sv: 'Materialet sorteras på plats och lämnas till godkänd mottagare.', en: 'Material is sorted on site and taken to approved facilities.' },
  },
];

// --- Nyckeltal ----------------------------------------------------------------
/**
 * Verified figures only, e.g. { label: { sv: 'Projekt utförda', en: 'Projects completed' }, value: '120', unit: { sv: 'st', en: '' } }.
 * Empty = the home page shows the "Vi jobbar för" section instead.
 */
export const KEY_FIGURES: { label: Localized; value: string; unit: Localized }[] = [];

// --- Team ---------------------------------------------------------------------
/** e.g. { name: 'Anna Andersson', role: { sv: 'Projektledare', en: 'Project manager' }, phone: '+46 …', email: 'anna@mbr.se', photo: 'stock/team-1.jpg' }. Empty = team section hidden. */
export const TEAM: { name: string; role: Localized; phone: string; email: string; photo?: string }[] = [];

// --- Maskinpark ---------------------------------------------------------------
/** e.g. { name: { sv: 'Rivningsrobot', en: 'Demolition robot' }, spec: { sv: 'Modell …', en: 'Model …' }, image: 'stock/machine-1.jpg' }. Empty = section hidden. */
export const EQUIPMENT: { name: Localized; spec: Localized; image: string }[] = [];

// --- Instagram (statiskt rutnät) --------------------------------------------
/** Images below src/assets/ for the static Instagram grid. */
export const INSTAGRAM_IMAGES: string[] = [];

/*
 * PROJECTS
 * --------
 * Projects are managed as Content Collection entries instead of an array here,
 * so each project can have its own page, images and text:
 *   src/content/projects/<slug>.md
 * Fields: title, location, year, category ("rivning" | "sanering" | "håltagning" |
 * "nybyggnad" | "ombyggnad"), client, scope, recycledPercent?, images[],
 * beforeImage?, afterImage? (+ cover, photographer, contractType, summary).
 * See README → "Lägga till projekt".
 */

// --- Helpers ------------------------------------------------------------------
/** True for values still in [placeholder] form. */
export const isPlaceholder = (value: string | undefined | null) => !value || /\[[^\]]*\]/.test(value);
/** True when a config value is filled in. */
export const hasValue = (value: string | undefined | null) => !isPlaceholder(value);
/** tel: link value, digits and + only. */
export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`;
/** Only real http(s) URLs are linked. */
export const isUrl = (value: string) => /^https?:\/\//.test(value);

// --- Derived ------------------------------------------------------------------
export const HAS_PHONE = hasValue(PHONE);
/** Direct-contact action: call when PHONE is set, otherwise email. Label key: cta.call / cta.email. */
export const DIRECT_CONTACT = HAS_PHONE ? { href: telHref(PHONE), label: 'call' as const } : { href: `mailto:${EMAIL}`, label: 'email' as const };
