'use client'

import { useCallback } from 'react'
import NextLink from 'next/link'
import type { ComponentProps } from 'react'
import { Link as IntlLink } from '@/i18n/navigation'
import { usePageTransition } from './TransitionProvider'

type TransitionLinkProps = ComponentProps<typeof NextLink>

export function TransitionLink({
  href,
  onClick,
  children,
  // `locale` typing differs between next/link and the locale-aware Link; we
  // never set it manually, so drop it from the spread.
  locale: _locale,
  ...props
}: TransitionLinkProps) {
  const { navigateTo } = usePageTransition()
  const strHref = href.toString()
  const isExternal = strHref.startsWith('mailto:') || strHref.startsWith('http')

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault()
      navigateTo(strHref)
      onClick?.(e)
    },
    [strHref, navigateTo, onClick],
  )

  // External links (mailto:, http) keep the default behaviour and a plain anchor.
  if (isExternal) {
    return (
      <NextLink href={href} onClick={onClick} {...props}>
        {children}
      </NextLink>
    )
  }

  // Internal links go through the locale-aware Link so the active locale prefix
  // is preserved on prefetch / middle-click, and through navigateTo on click.
  return (
    <IntlLink href={strHref} onClick={handleClick} {...props}>
      {children}
    </IntlLink>
  )
}
