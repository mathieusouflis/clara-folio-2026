import { useEffect, type RefObject } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface ScrollRevealOptions {
  y?: number
  x?: number
  duration?: number
  delay?: number
  ease?: string
  start?: string
  stagger?: number
  selector?: string
}

export function useScrollReveal<T extends HTMLElement>(ref: RefObject<T | null>, options: ScrollRevealOptions = {}) {
  const {
    y = 20,
    x = 0,
    duration = 0.8,
    delay = 0,
    ease = 'power3.out',
    start = 'top 85%',
    stagger = 0,
    selector,
  } = options

  useEffect(() => {
    if (!ref.current) return
    const ctx = gsap.context(() => {
      const target = selector ?? ref.current!
      gsap.from(target, {
        y,
        x,
        opacity: 0,
        duration,
        delay,
        stagger,
        ease,
        scrollTrigger: {
          trigger: ref.current,
          start,
          toggleActions: 'play none none none',
        },
      })
    }, ref as RefObject<Element>)
    return () => ctx.revert()
  }, [])
}
