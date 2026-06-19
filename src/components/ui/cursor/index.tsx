'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Only run on devices with a precise pointer (mouse/trackpad), not touch/stylus
    if (!window.matchMedia('(pointer: fine)').matches) return

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50 })

    let mouseX = -200
    let mouseY = -200
    let prevX = mouseX
    let prevY = mouseY
    let ringX = mouseX
    let ringY = mouseY
    let cursorState: 'default' | 'active' = 'default'
    let currentTarget: HTMLElement | null = null

    const setDotX = gsap.quickSetter(dot, 'x', 'px')
    const setDotY = gsap.quickSetter(dot, 'y', 'px')
    const setRingX = gsap.quickSetter(ring, 'x', 'px')
    const setRingY = gsap.quickSetter(ring, 'y', 'px')

    const enterState = () => {
      cursorState = 'active'
      gsap.killTweensOf(ring)
      gsap.killTweensOf(dot)
      gsap.to(ring, {
        width: 80,
        height: 80,
        backgroundColor: 'rgba(255,255,255,0.1)',
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
        duration: 0.35,
        ease: 'power2.out',
      })
      gsap.to(dot, { opacity: 0, scale: 0, duration: 0.2, ease: 'power2.in' })
    }

    const leaveState = () => {
      cursorState = 'default'
      gsap.killTweensOf(ring)
      gsap.killTweensOf(dot)
      gsap.to(ring, {
        width: 32,
        height: 32,
        backgroundColor: 'transparent',
        duration: 0.35,
        ease: 'power2.out',
      })
      gsap.to(dot, { opacity: 1, scale: 1, duration: 0.2, ease: 'power2.out' })
    }

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY

      const el = document.elementFromPoint(mouseX, mouseY) as HTMLElement | null
      const cursorEl = el?.closest('a, button, [data-cursor]') as HTMLElement | null

      if (cursorEl !== currentTarget) {
        currentTarget = cursorEl
        if (cursorEl) enterState()
        else leaveState()
      }
    }

    window.addEventListener('mousemove', onMouseMove)

    const tickerFn = () => {
      setDotX(mouseX)
      setDotY(mouseY)

      ringX += (mouseX - ringX) * 0.15
      ringY += (mouseY - ringY) * 0.15
      setRingX(ringX)
      setRingY(ringY)

      if (cursorState === 'active') return

      const vx = mouseX - prevX
      const vy = mouseY - prevY
      const speed = Math.sqrt(vx * vx + vy * vy)
      prevX = mouseX
      prevY = mouseY

      const stretch = Math.min(speed * 0.035, 0.35)
      const angle = Math.atan2(vy, vx) * (180 / Math.PI)

      if (stretch > 0.02) {
        gsap.to(ring, {
          scaleX: 1 + stretch,
          scaleY: Math.max(1 - stretch * 0.5, 0.65),
          rotation: angle,
          duration: 0.08,
          ease: 'none',
          overwrite: 'auto',
        })
      } else {
        gsap.to(ring, {
          scaleX: 1,
          scaleY: 1,
          duration: 0.5,
          ease: 'elastic.out(1, 0.4)',
          overwrite: 'auto',
        })
      }
    }

    gsap.ticker.add(tickerFn)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      gsap.ticker.remove(tickerFn)
    }
  }, [])

  return (
    <>
      <div
        ref={dotRef}
        className="cursor-dot fixed top-0 left-0 w-2 h-2 rounded-full bg-white pointer-events-none z-[99999]"
        style={{ mixBlendMode: 'difference' }}
      />
      <div
        ref={ringRef}
        className="cursor-ring fixed top-0 left-0 w-8 h-8 rounded-full border border-white pointer-events-none z-[99998]"
        style={{ mixBlendMode: 'difference' }}
      />
    </>
  )
}
