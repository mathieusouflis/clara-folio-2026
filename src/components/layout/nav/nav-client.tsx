'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { gsap } from 'gsap'
import { cn } from '@/lib/utils/cn'
import { NavPathLink } from './nav-path-link'
import { TransitionLink } from '@/components/layout/transition/TransitionLink'
import { LocaleSwitcher } from './locale-switcher'
import { Logo } from '@/components/ui/logo'

export function NavClient() {
  const t = useTranslations('nav')
  const pages = [
    { label: t('home'), href: '/' },
    { label: t('projects'), href: '/categories' },
    { label: t('services'), href: '/services' },
    { label: t('about'), href: '/about' },
    { label: t('contact'), href: 'mailto:contact@clarabaptista.com' },
  ]
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const linksRef = useRef<HTMLUListElement>(null)
  const hasOpened = useRef(false)
  const pathname = usePathname()
  const [lastPathname, setLastPathname] = useState(pathname)

  // Ferme le menu à chaque changement de page. Ajusté pendant le rendu plutôt
  // que dans un useEffect : React relance le rendu immédiatement, sans passe
  // de rendu supplémentaire committée.
  if (lastPathname !== pathname) {
    setLastPathname(pathname)
    setIsOpen(false)
  }

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
        {/* Logo — mix-blend-difference le fait s'inverser selon le fond */}
        <TransitionLink
          href="/"
          className="text-white opacity-80 hover:opacity-100 transition-opacity mix-blend-difference"
          aria-label="Clara Baptista — Home"
        >
          <Logo className="h-9 w-auto" />
        </TransitionLink>

        {/* Liens desktop + switcher de langue */}
        <div className="ml-auto flex items-center gap-4">
          <ul className="hidden md:flex flex-row gap-4">
            {pages.map((page) => (
              <NavPathLink key={page.href} href={page.href}>
                {page.label}
              </NavPathLink>
            ))}
          </ul>

          <LocaleSwitcher />
        </div>

        {/* Bouton hamburger / fermer (mobile uniquement) */}
        <button
          className="flex md:hidden flex-col items-center justify-center gap-[5px] w-12 h-12 -mr-2"
          onClick={() => setIsOpen((v) => !v)}
          aria-label={isOpen ? t('closeMenu') : t('openMenu')}
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
