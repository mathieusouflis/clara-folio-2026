import type { Metadata } from 'next'

export const BASE_URL = 'https://clarabaptista.com'

// Stable @id anchors so every JSON-LD block references the SAME entities
// instead of repeating their definitions (builds a single knowledge graph).
export const PERSON_ID = `${BASE_URL}/#person`
export const WEBSITE_ID = `${BASE_URL}/#website`

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
    jobTitle: 'Graphic Designer',
    url: BASE_URL,
    email: CONTACT_EMAIL,
    sameAs: ['https://www.linkedin.com/in/clarabaptista', 'https://www.instagram.com/hhwgii'],
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

/** Wrap nodes in a single @graph document. */
export function graph(...nodes: object[]) {
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes })
}
