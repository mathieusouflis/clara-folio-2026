'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { gsap } from 'gsap'
import { usePageTransition } from './TransitionProvider'

export function TransitionOverlay() {
  const { overlayRef, isNavigating, setIsNavigating } = usePageTransition()
  const pathname = usePathname()
  const isFirst = useRef(true)
  const loadingBarRef = useRef<HTMLDivElement>(null)
  const loaderTweenRef = useRef<gsap.core.Tween | null>(null)

  // Démarre l'animation de la barre de chargement quand le fetch est en attente
  useEffect(() => {
    if (!isNavigating || !loadingBarRef.current) return

    gsap.set(loadingBarRef.current, { scaleX: 0, transformOrigin: 'left center', opacity: 1 })
    loaderTweenRef.current = gsap.to(loadingBarRef.current, {
      scaleX: 1,
      duration: 1.8,
      ease: 'power1.inOut',
      repeat: -1,
      yoyo: true,
      repeatDelay: 0.1,
    })
  }, [isNavigating])

  // Sur chaque changement de pathname = nouvelle page prête
  useEffect(() => {
    if (!overlayRef.current) return

    // Stoppe la barre de chargement
    if (loaderTweenRef.current) {
      loaderTweenRef.current.kill()
      loaderTweenRef.current = null
    }
    if (loadingBarRef.current) {
      gsap.set(loadingBarRef.current, { opacity: 0 })
    }
    setIsNavigating(false)

    if (isFirst.current) {
      gsap.set(overlayRef.current, { scaleY: 1, transformOrigin: 'top center' })
      gsap.to(overlayRef.current, {
        scaleY: 0,
        transformOrigin: 'top center',
        duration: 0.7,
        delay: 0.1,
        ease: 'power3.inOut',
        onComplete: () => {
          window.dispatchEvent(new Event('resize'))
        },
      })
      isFirst.current = false
      return
    }

    gsap.to(overlayRef.current, {
      scaleY: 0,
      transformOrigin: 'top center',
      duration: 0.7,
      delay: 0.1,
      ease: 'power3.inOut',
      onComplete: () => {
        window.dispatchEvent(new Event('resize'))
      },
    })
  }, [pathname])

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9998] bg-black pointer-events-none"
      style={{ transform: 'scaleY(0)', transformOrigin: 'bottom center' }}
    >
      {/* Barre de chargement indéterminée — visible si le fetch prend du temps */}
      <div
        ref={loadingBarRef}
        className="absolute top-0 left-0 w-full h-[2px] bg-white"
        style={{ opacity: 0, transformOrigin: 'left center' }}
      />
    </div>
  )
}
