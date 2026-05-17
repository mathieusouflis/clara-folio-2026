import { useEffect, type RefObject } from 'react'
import { gsap } from 'gsap'

interface StaggerInOptions {
  y?: number
  x?: number
  duration?: number
  delay?: number
  stagger?: number
  ease?: string
  selector?: string
}

export function useStaggerIn<T extends HTMLElement>(ref: RefObject<T | null>, options: StaggerInOptions = {}) {
  const {
    y = 0,
    x = -20,
    duration = 0.8,
    delay = 0,
    stagger = 0.08,
    ease = 'power3.out',
    selector = ':scope > *',
  } = options

  useEffect(() => {
    if (!ref.current) return
    const ctx = gsap.context(() => {
      gsap.from(selector, { y, x, opacity: 0, duration, delay, stagger, ease })
    }, ref as RefObject<Element>)
    return () => ctx.revert()
  }, [])
}
