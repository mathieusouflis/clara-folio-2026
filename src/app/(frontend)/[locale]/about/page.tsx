import { AboutPage } from '@/features/about'
import { getPayload } from 'payload'
import { getLocale } from 'next-intl/server'
import config from '@/payload.config'
import type { Media } from '@/payload-types'
import type { Metadata } from 'next'

const BASE_URL = 'https://clarabaptista.com'

export async function generateMetadata(): Promise<Metadata> {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const locale = (await getLocale()) as 'en' | 'fr'
  const aboutGlobal = await payload.findGlobal({ slug: 'about', locale })

  const img = aboutGlobal.image as Media | null
  const rawImageUrl = img?.url
    ? img.url.startsWith('http')
      ? img.url
      : `${BASE_URL}${img.url}`
    : null

  const ogParams = new URLSearchParams({ title: 'About' })
  if (rawImageUrl) ogParams.set('imageUrl', rawImageUrl)
  const ogUrl = `${BASE_URL}/api/og?${ogParams.toString()}`

  return {
    title: { absolute: 'About — Clara Baptista, Graphic Designer Paris' },
    description:
      'Clara Baptista is a freelance graphic designer based in Paris. Learn about her experience, education, and skills.',
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
  const locale = (await getLocale()) as 'en' | 'fr'
  const aboutGlobal = await payload.findGlobal({ slug: 'about', depth: 1, locale })

  const img = aboutGlobal.image as Media | null
  const rawImageUrl = img?.url
    ? img.url.startsWith('http')
      ? img.url
      : `${BASE_URL}${img.url}`
    : null

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Clara Baptista',
    jobTitle: 'Graphic Designer',
    url: 'https://clarabaptista.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Paris',
      addressCountry: 'FR',
    },
    ...(rawImageUrl && { image: rawImageUrl }),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <AboutPage />
    </>
  )
}
