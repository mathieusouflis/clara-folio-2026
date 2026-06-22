import { NavLayout } from '../nav/nav'
import type React from 'react'

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="bg-[#0000ff] flex flex-col min-h-screen">
      <NavLayout>{children}</NavLayout>
    </main>
  )
}
