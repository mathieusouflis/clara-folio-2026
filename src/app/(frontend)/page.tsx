import './styles.css'
import { HomePageWrapper } from '@/features/home'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Clara Baptista — Graphic Designer Paris',
  description:
    'Portfolio of Clara Baptista, freelance graphic designer based in Paris. Branding, visual identity, and print design.',
  alternates: { canonical: '/' },
}

export default async function Page() {
  return (
    <>
      <HomePageWrapper />
    </>
  )
}
