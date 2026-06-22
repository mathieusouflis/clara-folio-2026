import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'fr'],
  defaultLocale: 'en',
  // No prefix for English — /about stays /about, /fr/about for French
  localePrefix: 'as-needed',
})
