'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { TransitionLink } from '@/components/layout/transition/TransitionLink'

export function HomeHero() {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const nameRef = useRef<HTMLParagraphElement>(null)
  const btnRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
      tl.from(titleRef.current, { y: 40, opacity: 0, duration: 1.2, delay: 0.3 })
        .from(nameRef.current, { x: 10, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.7')
        .from(btnRef.current, { opacity: 0, scale: 0.95, duration: 0.6, ease: 'power3.out' }, '-=0.5')
    })
    return () => ctx.revert()
  }, [])

  return (
    <div className="absolute flex flex-col items-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
      <span className="relative">
        <h1
          ref={titleRef}
          className="font-aston-script text-6xl md:text-8xl lg:text-9xl text-white whitespace-nowrap"
        >
          Portfolio
        </h1>
        <p ref={nameRef} className="absolute -bottom-5 right-0 text-white text-xl uppercase">
          Clara Baptista
        </p>
        <span ref={btnRef} className="absolute -bottom-52 left-1/2 -translate-x-1/2">
          <TransitionLink
            href="/categories"
            className="text-white px-16 py-4 text-[14px] border border-white hover:bg-white hover:text-black hover:border-white duration-300 font-semibold"
          >
            ENTER
          </TransitionLink>
        </span>
      </span>
    </div>
  )
}
