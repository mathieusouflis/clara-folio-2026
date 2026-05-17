'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Grid, GridItem } from '@/components/layout/grid'
import type { Project } from '@/payload-types'
import InfiniteScrollColumn from './components/infinite-scroll-column'
import { HomeHero } from './components/home-hero'

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
          <GridItem key={idx} span={2} className="relative">
            <InfiniteScrollColumn
              projects={group}
              gap={1200}
              direction="down"
              speed={speeds[idx]}
              pauseOnHover={false}
            />
            {projectsGroups.length > idx + 1 && (
              <span className="absolute top-0 -right-[calc(var(--grid-gap)/2)] bg-black w-0.5 h-full translate-x-1/2 opacity-15" />
            )}
          </GridItem>
        ))}
      </Grid>
    </div>
  )
}
