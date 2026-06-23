import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'fr'],
  defaultLocale: 'en',
  // No prefix for English — /about stays /about, /fr/about for French
  localePrefix: 'as-needed',
  // Don't auto-redirect "/" based on Accept-Language / cookie.
  // Otherwise Googlebot hits "/" and gets a 307 → "/fr", which Search Console
  // reports as "Page with redirect" and refuses to index the root page.
  localeDetection: false,
})
