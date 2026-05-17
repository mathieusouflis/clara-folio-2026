'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import Image from 'next/image'
import Link from 'next/link'
import { Grid, GridItem } from '@/components/layout/grid'
import type { Project } from '@/payload-types'

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export function ProjectHeroClient({ project }: { project: Project }) {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const tocRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })

      tl.from(titleRef.current, { y: 40, opacity: 0, duration: 1, delay: 0.2 })

      if (tocRef.current) {
        tl.from(
          gsap.utils.toArray(tocRef.current.children),
          { x: -12, opacity: 0, duration: 0.6, stagger: 0.05, ease: 'power3.out' },
          '-=0.5',
        )
      }

      if (imageRef.current) {
        gsap.from(imageRef.current, {
          scale: 1.04,
          opacity: 0,
          duration: 1.1,
          delay: 0.3,
          ease: 'power3.out',
        })
      }
    })
    return () => ctx.revert()
  }, [])

  return (
    <Grid as="section" withMargins={false} withGap={false}>
      <GridItem
        span={'full'}
        className="p-[calc(2*var(--grid-margin))] flex flex-col justify-between bg-white h-screen md:col-span-6!"
      >
        <div className="flex flex-col justify-between h-full w-full">
          <h1 ref={titleRef} className="opacity-80 text-blue-700 font-bold text-8xl">
            {project.name}
          </h1>
          <div className="flex items-center justify-center p-[calc(2*var(--grid-margin))] md:hidden">
            {project.image && typeof project.image === 'object' && (
              <Image
                src={project.image.url ?? ''}
                alt={project.image.alt}
                width={project.image.width || 1920}
                height={project.image.height || 1080}
                className="w-4/5 object-cover"
              />
            )}
          </div>
          <div ref={tocRef}>
            {project.content?.map((content, idx) => (
              <Link
                href={`#${content.id}`}
                key={idx}
                className="flex flex-row justify-between border-b-2 p-3 border-blue-700 text-blue-700 font-bold"
              >
                <span>{content.title.toLocaleLowerCase()}</span>
                <span>{idx + 1 > 10 ? idx + 1 : `0${idx + 1}`}</span>
              </Link>
            ))}
          </div>
        </div>
      </GridItem>
      <GridItem
        span={6}
        className="items-center justify-center p-[calc(2*var(--grid-margin))] hidden md:flex"
      >
        {project.image && typeof project.image === 'object' && (
          <div ref={imageRef} className="w-4/5">
            <Image
              key={project.image.id}
              src={project.image.url ?? ''}
              alt={project.image.alt}
              width={project.image.width || 1920}
              height={project.image.height || 1080}
              className="w-full object-cover"
            />
          </div>
        )}
      </GridItem>
    </Grid>
  )
}
