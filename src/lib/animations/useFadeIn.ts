import { useEffect, type RefObject } from 'react'
import { gsap } from 'gsap'

interface FadeInOptions {
  y?: number
  x?: number
  duration?: number
  delay?: number
  ease?: string
}

export function useFadeIn<T extends HTMLElement>(ref: RefObject<T | null>, options: FadeInOptions = {}) {
  const { y = 20, x = 0, duration = 0.8, delay = 0, ease = 'power3.out' } = options

  useEffect(() => {
    if (!ref.current) return
    const ctx = gsap.context(() => {
      gsap.from(ref.current, { y, x, opacity: 0, duration, delay, ease })
    }, ref as RefObject<Element>)
    return () => ctx.revert()
  }, [])
}
