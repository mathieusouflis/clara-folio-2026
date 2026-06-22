import { AboutPage } from '@/features/about'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About — Clara Baptista, Graphic Designer Paris',
  description:
    'Clara Baptista is a freelance graphic designer based in Paris. Learn about her experience, education, and skills.',
}

export default async function Page() {
  return <AboutPage />
}
