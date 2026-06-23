'use client'

import { usePathname } from 'next/navigation'
import type React from 'react'

export function FooterWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)
  const isHome = segments.length === 0 || (segments.length === 1 && segments[0] === 'fr')
  if (isHome) return null
  return <>{children}</>
}
