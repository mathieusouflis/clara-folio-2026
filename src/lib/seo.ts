import type { Metadata } from 'next'

export const BASE_URL = 'https://clarabaptista.com'

// Stable @id anchors so every JSON-LD block references the SAME entities
// instead of repeating their definitions (builds a single knowledge graph).
export const PERSON_ID = `${BASE_URL}/#person`
export const WEBSITE_ID = `${BASE_URL}/#website`
export const SERVICE_ID = `${BASE_URL}/#service`

// Centralised external-profile links. Add Behance/Dribbble URLs here once live —
// they flow into both the Person and ProfessionalService `sameAs` automatically.
export const SAME_AS = [
  'https://www.linkedin.com/in/clarabaptista',
  'https://www.instagram.com/hhwgii',
]

export type Locale = 'en' | 'fr'

/** EN path → its FR counterpart. EN is the unprefixed default (`localePrefix: 'as-needed'`). */
export function frPath(enPath: string): string {
  return enPath === '/' ? '/fr' : `/fr${enPath}`
}

/**
 * Locale-aware canonical + reciprocal hreflang for a page.
 * Pass the EN path (e.g. `/projects/foo`); the current locale picks the canonical.
 * Without this, FR pages self-canonicalise to their EN URL and drop out of the index.
 */
export function localeAlternates(locale: Locale, enPath: string): Metadata['alternates'] {
  return {
    canonical: locale === 'fr' ? frPath(enPath) : enPath,
    languages: {
      en: enPath,
      fr: frPath(enPath),
      'x-default': enPath,
    },
  }
}

/** Resolve a Payload media URL to an absolute URL (schema/OG require absolute). */
export function absoluteMediaUrl(url?: string | null): string | null {
  if (!url) return null
  return url.startsWith('http') ? url : `${BASE_URL}${url}`
}

const localeTag: Record<Locale, string> = { en: 'en-US', fr: 'fr-FR' }

export const CONTACT_EMAIL = 'contact@clarabaptista.com'

/** Canonical Person node, referenced everywhere by @id. */
export function personNode(image?: string | null) {
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: 'Clara Baptista',
    // Name components + reversed-order variant so Google matches the entity
    // whether searched as "Clara Baptista" or "Baptista Clara".
    givenName: 'Clara',
    familyName: 'Baptista',
    alternateName: 'Baptista Clara',
    jobTitle: 'Graphic Designer',
    url: BASE_URL,
    email: CONTACT_EMAIL,
    sameAs: SAME_AS,
    knowsAbout: ['Branding', 'Visual identity', 'Print design', 'Graphic design'],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Paris',
      addressCountry: 'FR',
    },
    ...(image ? { image } : {}),
  }
}

/**
 * Local-business entity for "graphiste freelance Paris" intent + local pack
 * synergy with the Google Business Profile. Service-area business: areaServed
 * instead of a street address, no phone (privacy). NAP name must match GBP.
 */
export function professionalServiceNode() {
  return {
    '@type': 'ProfessionalService',
    '@id': SERVICE_ID,
    name: 'Clara Baptista — Graphic Designer',
    url: BASE_URL,
    email: CONTACT_EMAIL,
    image: `${BASE_URL}/api/og?title=Graphic+Designer`,
    priceRange: '€€',
    sameAs: SAME_AS,
    provider: { '@id': PERSON_ID },
    areaServed: [
      { '@type': 'City', name: 'Paris' },
      { '@type': 'AdministrativeArea', name: 'Île-de-France' },
    ],
    knowsLanguage: ['fr', 'en'],
    serviceType: ['Branding', 'Visual identity', 'Print design', 'Logo design'],
  }
}

/**
 * Primary navigation as SiteNavigationElement — the structured-data type Google
 * associates with site nav. Improves sitelink *eligibility* (never guarantees it).
 * Only indexable pages belong here; a mailto: can't be a sitelink.
 */
export function siteNavigationNode() {
  const items: { name: string; path: string }[] = [
    { name: 'Projects', path: '/categories' },
    { name: 'About', path: '/about' },
  ]
  return {
    '@type': 'ItemList',
    name: 'Primary navigation',
    itemListElement: items.map((item, i) => ({
      '@type': 'SiteNavigationElement',
      position: i + 1,
      name: item.name,
      url: `${BASE_URL}${item.path}`,
    })),
  }
}

export function websiteNode(locale: Locale) {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: BASE_URL,
    name: 'Clara Baptista',
    inLanguage: localeTag[locale],
    publisher: { '@id': PERSON_ID },
  }
}

/** BreadcrumbList from [{ name, path }] (paths are EN/relative; resolved to absolute). */
export function breadcrumbList(items: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${BASE_URL}${item.path}`,
    })),
  }
}

/**
 * Wrap nodes in a single @graph document.
 *
 * The result is injected via `dangerouslySetInnerHTML` into a <script> tag, so we
 * escape the HTML-significant characters that `JSON.stringify` leaves untouched.
 * Without this, a string containing `</script>` (e.g. from CMS-authored content)
 * could break out of the tag and execute arbitrary JS (stored XSS). U+2028/U+2029
 * are also escaped since they are invalid raw in a script context.
 */
export function graph(...nodes: object[]) {
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes })
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}
