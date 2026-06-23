'use client'

import { cn } from '@/lib/utils/cn'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

export function MobileNotSupported() {
  const t = useTranslations('mobile')
  const [screenSize, setScreenSize] = useState(window.innerWidth)

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div
      className={cn(
        'fixed top-1/2 left-1/2 -translate-1/2 w-screen h-screen flex-col justify-center items-center text-white text-[16px]',
        screenSize <= 425 ? 'z-9999999999 flex' : 'hidden',
      )}
    >
      <p className="text-center">{t('message')}</p>
    </div>
  )
}
