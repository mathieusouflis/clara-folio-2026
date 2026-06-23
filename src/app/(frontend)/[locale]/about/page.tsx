import { AboutPage } from '@/features/about'
import { getPayload } from 'payload'
import { getLocale } from 'next-intl/server'
import config from '@/payload.config'
import type { Media } from '@/payload-types'
import type { Metadata } from 'next'
import {
  BASE_URL,
  absoluteMediaUrl,
  graph,
  localeAlternates,
  personNode,
  type Locale,
} from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const locale = (await getLocale()) as Locale
  const aboutGlobal = await payload.findGlobal({ slug: 'about', locale })

  const rawImageUrl = absoluteMediaUrl((aboutGlobal.image as Media | null)?.url)

  const ogParams = new URLSearchParams({ title: 'About' })
  if (rawImageUrl) ogParams.set('imageUrl', rawImageUrl)
  const ogUrl = `${BASE_URL}/api/og?${ogParams.toString()}`

  return {
    title: { absolute: 'About — Clara Baptista, Graphic Designer Paris' },
    description:
      'Clara Baptista is a freelance graphic designer based in Paris. Learn about her experience, education, and skills.',
    alternates: localeAlternates(locale, '/about'),
    openGraph: {
      images: [{ url: ogUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      images: [ogUrl],
    },
  }
}

export default async function Page() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const locale = (await getLocale()) as Locale
  const aboutGlobal = await payload.findGlobal({ slug: 'about', depth: 1, locale })

  const rawImageUrl = absoluteMediaUrl((aboutGlobal.image as Media | null)?.url)

  const jsonLd = graph({
    '@type': 'ProfilePage',
    url: `${BASE_URL}${locale === 'fr' ? '/fr' : ''}/about`,
    mainEntity: personNode(rawImageUrl),
  })

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <AboutPage />
    </>
  )
}
