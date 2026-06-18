import type React from 'react'
import './styles.css'
import ReactLenis from 'lenis/react'
import { MainLayout } from '@/components/layout/main'
import { allFonts } from '@/lib/fonts'
import { TransitionProvider } from '@/components/layout/transition/TransitionProvider'
import { TransitionOverlay } from '@/components/layout/transition/TransitionOverlay'
import { CustomCursor } from '@/components/ui/cursor'

export const metadata = {
  title: 'Clara Baptista portfolio',
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
