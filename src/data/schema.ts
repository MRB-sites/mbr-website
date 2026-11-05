/** JSON-LD builders (schema.org). Values come from src/config/company.ts. */
import {
  ADDRESS_PARTS,
  AREA_SERVED,
  COMPANY_NAME,
  EMAIL,
  FACEBOOK_URL,
  FOUNDED_YEAR,
  GEO,
  INSTAGRAM_URL,
  LINKEDIN_URL,
  OPENING_HOURS_SCHEMA,
  ORG_NR,
  PHONE,
  isPlaceholder,
  isUrl,
} from '../config/company';

export const orgId = (site: URL) => new URL('/#organization', site).href;

export function organizationSchema(site: URL, logoUrl: string) {
  const sameAs = [INSTAGRAM_URL, LINKEDIN_URL, FACEBOOK_URL].filter(isUrl);
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'GeneralContractor'],
    '@id': orgId(site),
    name: COMPANY_NAME,
    url: site.href,
    logo: logoUrl,
    image: logoUrl,
    email: EMAIL,
    ...(isPlaceholder(PHONE) ? {} : { telephone: PHONE }),
    taxID: ORG_NR,
    ...(isPlaceholder(FOUNDED_YEAR) ? {} : { foundingDate: FOUNDED_YEAR }),
    address: {
      '@type': 'PostalAddress',
      streetAddress: ADDRESS_PARTS.street,
      postalCode: ADDRESS_PARTS.postalCode,
      addressLocality: ADDRESS_PARTS.city,
      addressRegion: ADDRESS_PARTS.region,
      addressCountry: ADDRESS_PARTS.country,
    },
    ...(GEO ? { geo: { '@type': 'GeoCoordinates', latitude: GEO.lat, longitude: GEO.lng } } : {}),
    areaServed: AREA_SERVED.map((name) => ({ '@type': 'Place', name })),
    ...(OPENING_HOURS_SCHEMA.length ? { openingHours: OPENING_HOURS_SCHEMA } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function serviceSchema(site: URL, opts: { name: string; description: string; url: string; serviceType: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: opts.name,
    serviceType: opts.serviceType,
    description: opts.description,
    url: opts.url,
    provider: { '@id': orgId(site) },
    areaServed: AREA_SERVED.map((name) => ({ '@type': 'Place', name })),
  };
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((i) => ({
      '@type': 'Question',
      name: i.q,
      acceptedAnswer: { '@type': 'Answer', text: i.a },
    })),
  };
}

export function breadcrumbSchema(items: { label: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({ '@type': 'ListItem', position: i + 1, name: item.label, item: item.url })),
  };
}
