import { NavClient } from './nav-client'

const pages = [
  { label: 'Home', href: '/' },
  { label: 'Projects', href: '/categories' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: 'mailto:contact@clarabaptista.com' },
]

export function NavLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavClient pages={pages} />
      {children}
    </>
  )
}
