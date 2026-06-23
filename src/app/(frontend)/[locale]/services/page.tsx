import { getPayload } from 'payload'
import { getLocale } from 'next-intl/server'
import { ServicesPage } from '@/features/services'
import config from '@/payload.config'
import type { Metadata } from 'next'
import {
  BASE_URL,
  SERVICE_ID,
  breadcrumbList,
  graph,
  localeAlternates,
  type Locale,
} from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const locale = (await getLocale()) as Locale
  const services = await payload.findGlobal({ slug: 'services', locale })

  const title =
    services.metaTitle ?? 'Freelance Graphic Designer in Paris — Branding & Print'
  const description = services.metaDescription ?? undefined
  const ogUrl = `${BASE_URL}/api/og?title=${encodeURIComponent('Services')}`

  return {
    title: { absolute: title },
    description,
    alternates: localeAlternates(locale, '/services'),
    openGraph: { images: [{ url: ogUrl, width: 1200, height: 630 }] },
    twitter: { card: 'summary_large_image', images: [ogUrl] },
  }
}

export default async function Page() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const locale = (await getLocale()) as Locale
  const services = await payload.findGlobal({ slug: 'services', locale })
  const pageUrl = `${BASE_URL}${locale === 'fr' ? '/fr' : ''}/services`

  const offerCatalog = {
    '@type': 'OfferCatalog',
    name: 'Graphic design services',
    itemListElement: (services.services ?? []).map((service, i) => ({
      '@type': 'Offer',
      position: i + 1,
      itemOffered: {
        '@type': 'Service',
        name: service.title,
        ...(service.description ? { description: service.description } : {}),
        provider: { '@id': SERVICE_ID },
      },
    })),
  }

  const jsonLd = graph(
    {
      '@type': 'Service',
      name: services.metaTitle ?? 'Freelance Graphic Designer in Paris',
      ...(services.metaDescription ? { description: services.metaDescription } : {}),
      url: pageUrl,
      provider: { '@id': SERVICE_ID },
      areaServed: [
        { '@type': 'City', name: 'Paris' },
        { '@type': 'AdministrativeArea', name: 'Île-de-France' },
      ],
      hasOfferCatalog: offerCatalog,
    },
    breadcrumbList([
      { name: 'Home', path: '/' },
      { name: 'Services', path: '/services' },
    ]),
  )

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <ServicesPage />
    </>
  )
}
