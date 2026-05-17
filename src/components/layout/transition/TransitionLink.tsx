'use client'

import { useCallback } from 'react'
import Link from 'next/link'
import type { ComponentProps } from 'react'
import { usePageTransition } from './TransitionProvider'

type TransitionLinkProps = ComponentProps<typeof Link>

export function TransitionLink({ href, onClick, children, ...props }: TransitionLinkProps) {
  const { navigateTo } = usePageTransition()

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      const strHref = href.toString()
      if (strHref.startsWith('mailto:') || strHref.startsWith('http')) return
      e.preventDefault()
      navigateTo(strHref)
      onClick?.(e)
    },
    [href, navigateTo, onClick],
  )

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  )
}
