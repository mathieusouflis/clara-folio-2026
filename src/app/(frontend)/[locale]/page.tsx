import { HomePageWrapper } from '@/features/home'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: { absolute: 'Clara Baptista — Graphic Designer Paris' },
  description:
    'Portfolio of Clara Baptista, freelance graphic designer based in Paris. Branding, visual identity, and print design.',
  alternates: { canonical: '/' },
  openGraph: {
    images: [{ url: 'https://clarabaptista.com/api/og?title=Home', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['https://clarabaptista.com/api/og?title=Home'],
  },
}

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Clara Baptista',
  jobTitle: 'Graphic Designer',
  url: 'https://clarabaptista.com',
  sameAs: [],
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Paris',
    addressCountry: 'FR',
  },
}

export default async function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <HomePageWrapper />
    </>
  )
}
