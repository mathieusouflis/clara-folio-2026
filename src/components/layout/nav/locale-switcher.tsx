'use client'

import { useRef } from 'react'
import { useLocale } from 'next-intl'
import { usePathname } from '@/i18n/navigation'
import { gsap } from 'gsap'
import { cn } from '@/lib/utils/cn'
import { usePageTransition } from '@/components/layout/transition/TransitionProvider'

export function LocaleSwitcher({ className }: { className?: string }) {
  const locale = useLocale()
  // Unprefixed pathname (e.g. "/categories/branding") — navigateTo re-applies
  // the target locale prefix, so the switch works on every page.
  const pathname = usePathname()
  const { navigateTo } = usePageTransition()
  const labelRef = useRef<HTMLSpanElement>(null)
  const isAnimating = useRef(false)

  const targetLocale = locale === 'en' ? 'fr' : 'en'

  const handleClick = () => {
    const el = labelRef.current
    if (!el || isAnimating.current) return
    isAnimating.current = true

    gsap
      .timeline()
      // Current label slides up and fades out
      .to(el, { yPercent: -110, opacity: 0, duration: 0.22, ease: 'power2.in' })
      // Swap to the target locale + kick off the page transition
      .add(() => {
        el.textContent = targetLocale.toUpperCase()
        navigateTo(pathname, { locale: targetLocale })
      })
      // New label slides in from below
      .fromTo(
        el,
        { yPercent: 110, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.3, ease: 'power3.out' },
      )
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'relative inline-flex h-9 items-center justify-center overflow-hidden rounded-full',
        'border border-white/40 px-3 text-[11px] font-bold uppercase tracking-widest text-white',
        'mix-blend-difference transition-colors duration-300 hover:border-white',
        className,
      )}
      aria-label={`Switch to ${targetLocale === 'en' ? 'English' : 'Français'}`}
    >
      <span ref={labelRef} className="block leading-none">
        {locale.toUpperCase()}
      </span>
    </button>
  )
}
