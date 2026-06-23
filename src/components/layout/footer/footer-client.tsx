'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { Footer } from '@/payload-types'

gsap.registerPlugin(ScrollTrigger)

type SocialLink = NonNullable<Footer['socialLinks']>[number]

const linkClass =
  'text-white/60 hover:text-white text-[13px] tracking-wider uppercase transition-colors duration-300 inline-flex items-center gap-1.5'

export function FooterClient({ socialLinks }: { socialLinks: SocialLink[] }) {
  const tFooter = useTranslations('footer')

  const footerRef = useRef<HTMLElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const claraContainerRef = useRef<HTMLDivElement>(null)
  const claraRef = useRef<HTMLParagraphElement>(null)

  // Fit CLARA width + enforce 1/4 cut at any screen size.
  // window resize avoids self-triggering loop when we mutate container.style.height.
  useEffect(() => {
    const fit = () => {
      const p = claraRef.current
      const container = claraContainerRef.current
      if (!p || !container) return
      p.style.fontSize = '100px'
      const fontSize = (container.clientWidth / p.scrollWidth) * 100
      p.style.fontSize = `${fontSize}px`
      container.style.height = `${fontSize * 0.75}px`
    }

    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])

  useEffect(() => {
    const footer = footerRef.current
    if (!footer) return

    const ctx = gsap.context(() => {
      const animItems = footer.querySelectorAll('[data-footer-animate]')
      if (animItems.length > 0) {
        gsap.from(animItems, {
          y: 16,
          opacity: 0,
          duration: 0.7,
          stagger: 0.06,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: footer,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        })
      }

      if (lineRef.current) {
        gsap.from(lineRef.current, {
          scaleX: 0,
          transformOrigin: 'left center',
          duration: 1.0,
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: footer,
            start: 'top 86%',
            toggleActions: 'play none none none',
          },
        })
      }

      if (claraRef.current) {
        gsap.from(claraRef.current, {
          y: '50%',
          opacity: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: footer,
            start: 'top 84%',
            toggleActions: 'play none none none',
          },
        })
      }
    }, footer)

    return () => ctx.revert()
  }, [])

  return (
    <footer ref={footerRef} className="pt-25 pb-0 overflow-hidden" aria-label="Site footer">
      {/* Socials — horizontal row, centered */}
      {socialLinks.length > 0 && (
        <nav aria-label={tFooter('socials')} className="flex justify-center">
          <ul className="flex flex-row flex-wrap justify-center gap-x-8 gap-y-3" role="list">
            {socialLinks.map((link, idx) => (
              <li key={idx} data-footer-animate>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                  aria-label={`${link.label} — ${tFooter('opensInNewTab')}`}
                >
                  <span aria-hidden="true">{link.label}</span>
                  <ArrowUpRight className="w-3 h-3 shrink-0" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {/* Divider */}
      <div ref={lineRef} className="mx-(--grid-margin) mt-0 h-px bg-white/10" aria-hidden="true" />

      {/* CLARA — fills screen width minus grid margins, 1/4 clipped with fade */}
      <div
        ref={claraContainerRef}
        className="mx-(--grid-margin) mt-6 overflow-hidden"
        style={{
          WebkitMaskImage: 'linear-gradient(to bottom, white 50%, transparent 100%)',
          maskImage: 'linear-gradient(to bottom, white 50%, transparent 100%)',
        }}
        aria-hidden="true"
      >
        <p
          ref={claraRef}
          className="text-white font-bold uppercase leading-none select-none whitespace-nowrap w-fit"
        >
          CLARA
        </p>
      </div>
    </footer>
  )
}
