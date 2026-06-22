'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { gsap } from 'gsap'
import { cn } from '@/lib/utils/cn'
import { NavPathLink } from './nav-path-link'
import { TransitionLink } from '@/components/layout/transition/TransitionLink'
import { Logo } from '@/components/ui/logo'

export function NavClient() {
  const t = useTranslations('nav')
  const pages = [
    { label: t('home'), href: '/' },
    { label: t('projects'), href: '/categories' },
    { label: t('about'), href: '/about' },
    { label: t('contact'), href: 'mailto:contact@clarabaptista.com' },
  ]
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const linksRef = useRef<HTMLUListElement>(null)
  const hasOpened = useRef(false)
  const pathname = usePathname()

  // Ferme le menu à chaque changement de page
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Animation GSAP du menu
  useEffect(() => {
    if (!menuRef.current || !linksRef.current) return

    if (isOpen) {
      hasOpened.current = true
      gsap.set(menuRef.current, { display: 'flex', opacity: 1 })
      gsap.from(menuRef.current, { opacity: 0, duration: 0.25, ease: 'power2.out' })
      gsap.from(Array.from(linksRef.current.children), {
        y: 24,
        opacity: 0,
        stagger: 0.07,
        duration: 0.5,
        delay: 0.1,
        ease: 'power3.out',
      })
    } else if (hasOpened.current) {
      gsap.to(menuRef.current, {
        opacity: 0,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => {
          gsap.set(menuRef.current, { display: 'none' })
        },
      })
    }
  }, [isOpen])

  return (
    <>
      <nav className="fixed flex items-center justify-between top-0 left-0 w-full px-(--grid-margin) py-3 z-[10000]">
        {/* Logo */}
        <TransitionLink
          href="/"
          className="text-white opacity-80 hover:opacity-100 transition-opacity"
          aria-label="Clara Baptista — Home"
        >
          <Logo className="h-7 w-auto" />
        </TransitionLink>

        {/* Liens desktop */}
        <ul className="hidden md:flex flex-row gap-4 ml-auto">
          {pages.map((page) => (
            <NavPathLink key={page.href} href={page.href}>
              {page.label}
            </NavPathLink>
          ))}
        </ul>

        {/* Bouton hamburger / fermer (mobile uniquement) */}
        <button
          className="flex md:hidden flex-col items-center justify-center gap-[5px] w-12 h-12 -mr-2"
          onClick={() => setIsOpen((v) => !v)}
          aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        >
          <span
            className={cn(
              'block w-6 h-[1.5px] bg-white transition-all duration-300 origin-center',
              isOpen && 'rotate-45 translate-y-[6.5px]',
            )}
          />
          <span
            className={cn(
              'block w-6 h-[1.5px] bg-white transition-all duration-300',
              isOpen && 'opacity-0',
            )}
          />
          <span
            className={cn(
              'block w-6 h-[1.5px] bg-white transition-all duration-300 origin-center',
              isOpen && '-rotate-45 -translate-y-[6.5px]',
            )}
          />
        </button>
      </nav>

      {/* Overlay menu mobile */}
      <div
        ref={menuRef}
        className="fixed inset-0 z-[9995] bg-[#0000ff] flex-col items-center justify-center"
        style={{ display: 'none' }}
        aria-hidden="true"
      >
        <ul ref={linksRef} className="flex flex-col items-center gap-10">
          {pages.map((page) => (
            <li key={page.href}>
              <TransitionLink
                href={page.href}
                className="text-white text-4xl font-bold uppercase tracking-wide opacity-80 hover:opacity-100 transition-opacity"
              >
                {page.label}
              </TransitionLink>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
