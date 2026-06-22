import { AboutPage } from '@/features/about'
import type { Metadata } from 'next'

const description =
  'Clara Baptista is a freelance graphic designer based in Paris. Learn about her experience, education, and skills.'

export const metadata: Metadata = {
  title: 'About — Clara Baptista, Graphic Designer Paris',
  description,
  openGraph: {
    images: [
      {
        url: `/api/og?type=About&title=About&description=${encodeURIComponent(description)}`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [`/api/og?type=About&title=About&description=${encodeURIComponent(description)}`],
  },
}

export default async function Page() {
  return <AboutPage />
}
