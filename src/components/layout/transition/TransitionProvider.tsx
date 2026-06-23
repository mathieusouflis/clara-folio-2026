'use client'

import { createContext, useCallback, useContext, useRef, useState } from 'react'
import { useRouter } from '@/i18n/navigation'
import { gsap } from 'gsap'

type NavigateOptions = { locale?: 'en' | 'fr' }

interface TransitionContextValue {
  navigateTo: (href: string, options?: NavigateOptions) => void
  overlayRef: React.RefObject<HTMLDivElement | null>
  isNavigating: boolean
  setIsNavigating: (v: boolean) => void
}

const TransitionContext = createContext<TransitionContextValue | null>(null)

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const [isNavigating, setIsNavigating] = useState(false)

  const navigateTo = useCallback(
    (href: string, options?: NavigateOptions) => {
      if (!overlayRef.current) {
        router.push(href, options)
        return
      }
      gsap.to(overlayRef.current, {
        scaleY: 1,
        transformOrigin: 'bottom center',
        duration: 0.6,
        ease: 'power3.inOut',
        onComplete: () => {
          // Le rideau est en place — on signale qu'on attend le fetch
          setIsNavigating(true)
          router.push(href, options)
        },
      })
    },
    [router],
  )

  return (
    <TransitionContext.Provider value={{ navigateTo, overlayRef, isNavigating, setIsNavigating }}>
      {children}
    </TransitionContext.Provider>
  )
}

export function usePageTransition() {
  const ctx = useContext(TransitionContext)
  if (!ctx) throw new Error('usePageTransition must be used within TransitionProvider')
  return ctx
}
