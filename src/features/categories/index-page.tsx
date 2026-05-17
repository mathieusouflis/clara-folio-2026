'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { Grid, GridItem } from '@/components/layout/grid'
import { Category } from './components/category'
import { ImageSwitcher } from './components/images-switcher'

export function CategoriesPageClient({
  categoriesData,
}: {
  categoriesData: any[]
}) {
  const [hoveredCategoryIndex, setHoveredCategoryIndex] = useState<number | null>(null)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!listRef.current) return
    const ctx = gsap.context(() => {
      gsap.from(':scope > *', {
        x: -24,
        opacity: 0,
        duration: 0.9,
        stagger: 0.08,
        delay: 0.2,
        ease: 'power3.out',
      })
    }, listRef)
    return () => ctx.revert()
  }, [])

  return (
    <div className="min-h-screen flex flex-col justify-center relative">
      <div className="fixed inset-0 z-0 pointer-events-none">
        {categoriesData.map((data, idx) => (
          <ImageSwitcher
            key={`image-${data.category.id}`}
            images={data.images}
            hidden={hoveredCategoryIndex !== idx}
          />
        ))}
      </div>

      <Grid className="px-0 relative z-10">
        <GridItem span={'full'} start={2}>
          <div ref={listRef} className="flex flex-col">
            {categoriesData.map((data, idx) => (
              <Category
                key={data.category.id}
                category={data.category}
                categoryNumber={idx + 1}
                projectsNumber={data.projectCount}
                onHoverChange={(hovering) => setHoveredCategoryIndex(hovering ? idx : null)}
              />
            ))}
          </div>
        </GridItem>
      </Grid>
    </div>
  )
}
