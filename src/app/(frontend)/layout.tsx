import type React from 'react'
import type { Metadata } from 'next'
import Script from 'next/script'
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

  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

  return (
    <html lang="en" className={fontVariables}>
      <body>
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`}
            </Script>
          </>
        )}
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
