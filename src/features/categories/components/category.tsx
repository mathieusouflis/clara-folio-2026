'use client'

import { useRef, useCallback } from 'react'
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

  const handleEnter = useCallback(() => {
    onHoverChange(true)
    if (!rowRef.current) return
    gsap.to(rowRef.current, { opacity: 1, duration: 0.25, ease: 'power2.out' })
  }, [onHoverChange])

  const handleLeave = useCallback(() => {
    onHoverChange(false)
    if (!rowRef.current) return
    gsap.to(rowRef.current, { opacity: 0.6, duration: 0.25, ease: 'power2.out' })
  }, [onHoverChange])

  return (
    <div
      ref={rowRef}
      className="flex flex-row gap-11 text-white relative z-10"
      style={{ opacity: 0.6 }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <div className="flex flex-row gap-4">
        <span className="text-4xl font-thin">
          <i>{categoryNumber < 10 ? `0${categoryNumber}` : categoryNumber}</i>
        </span>
        <span>
          <TransitionLink href={`/categories/${category.id}`} className="text-8xl">
            {category.categoryName}
          </TransitionLink>
          <span>({projectsNumber})</span>
        </span>
      </div>
    </div>
  )
}
