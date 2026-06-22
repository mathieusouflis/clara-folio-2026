import type React from 'react'
import type { Metadata } from 'next'
import './styles.css'
import ReactLenis from 'lenis/react'
import { MainLayout } from '@/components/layout/main'
import { allFonts } from '@/lib/fonts'
import { TransitionProvider } from '@/components/layout/transition/TransitionProvider'
import { TransitionOverlay } from '@/components/layout/transition/TransitionOverlay'
import { CustomCursor } from '@/components/ui/cursor'

export const metadata: Metadata = {
  metadataBase: new URL('https://clarabaptista.com'),
  title: {
    default: 'Clara Baptista — Graphic Designer Paris',
    template: '%s — Clara Baptista',
  },
  description:
    'Clara Baptista is a freelance graphic designer based in Paris, specialising in branding, visual identity, and print design.',
  openGraph: {
    siteName: 'Clara Baptista',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
  alternates: {
    canonical: '/',
  },
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  const fontVariables = allFonts.map((font) => font.variable).join(' ')

  return (
    <html lang="en" className={fontVariables}>
      <body>
        <TransitionProvider>
          <CustomCursor />
          <TransitionOverlay />
          <ReactLenis root />
          <MainLayout>{children}</MainLayout>
        </TransitionProvider>
      </body>
    </html>
  )
}
