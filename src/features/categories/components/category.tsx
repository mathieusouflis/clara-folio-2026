'use client'

import { useRef, useCallback, useEffect } from 'react'
import { gsap } from 'gsap'
import type { Category as PayloadCategory } from '@/payload-types'
import { TransitionLink } from '@/components/layout/transition/TransitionLink'

export function Category({
  category,
  projectsNumber,
  categoryNumber,
  onHoverChange,
}: {
  category: PayloadCategory
  projectsNumber: number
  categoryNumber: number
  onHoverChange: (hovering: boolean) => void
}) {
  const rowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!rowRef.current) return
    const mm = gsap.matchMedia()
    mm.add('(hover: none)', () => {
      gsap.set(rowRef.current, { opacity: 1 })
    })
    return () => mm.revert()
  }, [])

  const handleEnter = useCallback(() => {
    onHoverChange(true)
    if (!rowRef.current) return
    gsap.to(rowRef.current, { opacity: 1, duration: 0.25, ease: 'power2.out' })
  }, [onHoverChange])

  const handleLeave = useCallback(() => {
    onHoverChange(false)
    if (!rowRef.current) return
    gsap.to(rowRef.current, { opacity: 0.7, duration: 0.25, ease: 'power2.out' })
  }, [onHoverChange])

  return (
    <div
      ref={rowRef}
      className="flex flex-row items-baseline gap-3 sm:gap-6 lg:gap-11 text-white relative z-10 py-1"
      // Mobile : opacité pleine (pas de hover sur touch)
      // Desktop : l'animation GSAP part de 0.7
      style={{ opacity: 0.7 }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <span className="text-xl sm:text-2xl lg:text-4xl font-thin shrink-0 tabular-nums">
        <i>{categoryNumber < 10 ? `0${categoryNumber}` : categoryNumber}</i>
      </span>

      <span className="flex items-baseline gap-1.5 min-w-0">
        <TransitionLink
          href={`/categories/${category.slug ?? category.id}`}
          className="text-3xl sm:text-5xl md:text-6xl lg:text-8xl leading-tight hover:opacity-100 transition-opacity"
        >
          {category.categoryName}
        </TransitionLink>
        <span className="text-sm sm:text-base opacity-60 shrink-0">({projectsNumber})</span>
      </span>
    </div>
  )
}
