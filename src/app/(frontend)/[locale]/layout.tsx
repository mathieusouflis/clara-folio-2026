import type React from 'react'
import type { Metadata } from 'next'
import '../styles.css'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import Script from 'next/script'
import ReactLenis from 'lenis/react'
import { MainLayout } from '@/components/layout/main'
import { allFonts } from '@/lib/fonts'
import { TransitionProvider } from '@/components/layout/transition/TransitionProvider'
import { TransitionOverlay } from '@/components/layout/transition/TransitionOverlay'
import { CustomCursor } from '@/components/ui/cursor'
import { routing } from '@/i18n/routing'

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
    images: [{ url: '/api/og?type=Home', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/api/og?type=Home'],
  },
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!routing.locales.includes(locale as 'en' | 'fr')) {
    notFound()
  }

  const messages = await getMessages()
  const fontVariables = allFonts.map((font) => font.variable).join(' ')
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

  return (
    <html lang={locale} className={fontVariables}>
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
        <NextIntlClientProvider messages={messages}>
          <TransitionProvider>
            <CustomCursor />
            <TransitionOverlay />
            <ReactLenis root />
            <MainLayout>{children}</MainLayout>
          </TransitionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
