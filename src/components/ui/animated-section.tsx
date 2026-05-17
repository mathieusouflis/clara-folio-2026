'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cn } from '@/lib/utils/cn'

gsap.registerPlugin(ScrollTrigger)

interface AnimatedSectionProps {
  children: React.ReactNode
  className?: string
  y?: number
  x?: number
  duration?: number
  delay?: number
  stagger?: number
  selector?: string
  start?: string
  /** Si true, l'animation se joue au mount sans ScrollTrigger */
  mountOnly?: boolean
}

export function AnimatedSection({
  children,
  className,
  y = 20,
  x = 0,
  duration = 0.8,
  delay = 0,
  stagger = 0,
  selector,
  start = 'top 88%',
  mountOnly = false,
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const ctx = gsap.context(() => {
      const target = selector ?? ref.current!
      const animProps = { y, x, opacity: 0, duration, delay, stagger, ease: 'power3.out' }

      if (mountOnly) {
        gsap.from(target, animProps)
      } else {
        gsap.from(target, {
          ...animProps,
          scrollTrigger: {
            trigger: ref.current,
            start,
            toggleActions: 'play none none none',
          },
        })
      }
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  )
}
