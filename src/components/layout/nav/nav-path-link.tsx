'use client'

import { usePathname } from '@/i18n/navigation'
import { cn } from '@/lib/utils/cn'
import { TransitionLink } from '@/components/layout/transition/TransitionLink'

export function NavPathLink({ href, children }: { href: string; children: React.ReactNode }) {
  const path = usePathname()

  return (
    <TransitionLink
      href={href}
      className={cn(
        'text-black md:text-white hover:opacity-100 opacity-60 font-bold uppercase text-[16px] duration-300',
        (path !== '/' ? path === href : path.startsWith(href)) ? 'opacity-100' : '',
      )}
    >
      {children}
    </TransitionLink>
  )
}
