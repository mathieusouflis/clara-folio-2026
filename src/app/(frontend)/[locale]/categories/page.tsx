import { CategoriesPage } from '@/features/categories'
import { getLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import { BASE_URL, localeAlternates, type Locale } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale
  return {
    title: { absolute: 'Projects — Clara Baptista, Graphic Designer Paris' },
    description:
      'Explore the graphic design projects of Clara Baptista, freelance graphic designer based in Paris.',
    alternates: localeAlternates(locale, '/categories'),
    openGraph: {
      images: [{ url: `${BASE_URL}/api/og?title=Categories`, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      images: [`${BASE_URL}/api/og?title=Categories`],
    },
  }
}

export default function Page() {
  return <CategoriesPage />
}
