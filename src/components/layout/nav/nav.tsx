import { getTranslations } from 'next-intl/server'
import { NavClient } from './nav-client'

export async function NavLayout({ children }: { children: React.ReactNode }) {
  const t = await getTranslations('nav')

  const pages = [
    { label: t('home'), href: '/' },
    { label: t('projects'), href: '/categories' },
    { label: t('about'), href: '/about' },
    { label: t('contact'), href: 'mailto:contact@clarabaptista.com' },
  ]

  return (
    <>
      <NavClient pages={pages} />
      {children}
    </>
  )
}
