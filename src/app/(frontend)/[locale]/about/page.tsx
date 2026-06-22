import { AboutPage } from '@/features/about'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: { absolute: 'About — Clara Baptista, Graphic Designer Paris' },
  description:
    'Clara Baptista is a freelance graphic designer based in Paris. Learn about her experience, education, and skills.',
  openGraph: {
    images: [{ url: 'https://clarabaptista.com/api/og?title=About', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['https://clarabaptista.com/api/og?title=About'],
  },
}

export default async function Page() {
  return <AboutPage />
}
