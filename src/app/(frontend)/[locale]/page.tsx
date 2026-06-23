import { HomePageWrapper } from '@/features/home'
import { getLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import {
  BASE_URL,
  graph,
  localeAlternates,
  personNode,
  siteNavigationNode,
  websiteNode,
  type Locale,
} from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale
  return {
    title: { absolute: 'Clara Baptista — Graphic Designer Paris' },
    description:
      'Portfolio of Clara Baptista, freelance graphic designer based in Paris. Branding, visual identity, and print design.',
    alternates: localeAlternates(locale, '/'),
    openGraph: {
      images: [{ url: `${BASE_URL}/api/og?title=Home`, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      images: [`${BASE_URL}/api/og?title=Home`],
    },
  }
}

export default async function Page() {
  const locale = (await getLocale()) as Locale
  const jsonLd = graph(websiteNode(locale), personNode(), siteNavigationNode())

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <HomePageWrapper />
    </>
  )
}
