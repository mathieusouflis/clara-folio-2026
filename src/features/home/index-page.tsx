'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { cn } from '@/lib/utils/cn'
import { Grid, GridItem } from '@/components/layout/grid'
import type { Project } from '@/payload-types'
import InfiniteScrollColumn from './components/infinite-scroll-column'
import { HomeHero } from './components/home-hero'

// Responsive visibility + span par index de colonne
//   Mobile  (<sm):  affiche cols 0-1  → span-6 (2 colonnes)
//   Tablet (sm-lg): affiche cols 0-3  → span-3 (4 colonnes)
//   Desktop (lg+):  affiche cols 0-5  → span-2 (6 colonnes)
const colClass = (idx: number) =>
  cn(
    // Spans responsifs (pas de prop span= pour éviter le conflit de classe)
    'relative',
    idx < 2 && 'grid-span-6 sm:grid-span-3 lg:grid-span-2',
    idx >= 2 && idx < 4 && 'hidden sm:block sm:grid-span-3 lg:grid-span-2',
    idx >= 4 && 'hidden lg:block lg:grid-span-2',
  )

export function HomePage({ projectsList }: { projectsList: Project[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const totalProjects = projectsList.length

  while (projectsList.length < 24) {
    const randomIndex = Math.floor(Math.random() * totalProjects)
    projectsList.push({ ...projectsList[randomIndex] })
  }

  const projectsGroups: Project[][] = []
  for (let i = 0; i < 6; i++) {
    projectsGroups.push(
      projectsList.slice((i * projectsList.length) / 6, ((i + 1) * projectsList.length) / 6),
    )
  }

  const speeds = [40, 60, 80, 90, 70, 50]

  useEffect(() => {
    if (!containerRef.current) return
    const ctx = gsap.context(() => {
      gsap.from('.grid-container > *', {
        opacity: 0,
        duration: 1.2,
        stagger: 0.1,
        delay: 0.4,
        ease: 'power3.out',
      })
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="relative">
      <HomeHero />
      <Grid className="h-screen pointer-events-none">
        {projectsGroups.map((group, idx) => (
          <GridItem key={idx} className={colClass(idx)}>
            <InfiniteScrollColumn
              projects={group}
              gap={1200}
              direction="down"
              speed={speeds[idx]}
              pauseOnHover={false}
            />
            {/* Séparateur vertical — masqué sur la dernière colonne visible */}
            {idx < 5 && (
              <span className="absolute top-0 -right-[calc(var(--grid-gap)/2)] bg-black w-0.5 h-full translate-x-1/2 opacity-15" />
            )}
          </GridItem>
        ))}
      </Grid>
    </div>
  )
}
