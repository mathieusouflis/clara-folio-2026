import { NavClient } from './nav-client'
import type React from 'react'

export function NavLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavClient />
      {children}
    </>
  )
}
