'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'
import { Grid, GridItem } from '@/components/layout/grid'
import { AnimatedSection } from '@/components/ui/animated-section'
import type { Project } from '@/payload-types'

export const ProjectSection = (props: { content: NonNullable<Project['content']> }) => {
  if (!props.content[0]) return null
  const content = props.content[0]
  const contentImages =
    content.images && typeof content.images === 'object'
      ? content.images.filter((i) => typeof i !== 'number')
      : []

  const [currentImage, setCurrentImage] = useState(contentImages[0] ? contentImages[0] : undefined)

  return (
    <Grid key={content.id} as="section" id={content.id ?? ''}>
      <GridItem
        span={'full'}
        className="px-(--grid-margin) py-12 md:py-32 flex flex-col justify-between md:h-screen md:col-span-6!"
      >
        <Grid columns={6} withGap={false} withMargins={false}>
          <GridItem span={'full'} className="flex flex-col gap-12 md:col-start-2!">
            <AnimatedSection y={20} duration={0.8} start="top 90%">
              <h1 className="opacity-60 text-white font-bold text-5xl">{content.title}</h1>
              <div className="flex flex-col gap-4 mt-12">
                {Array.isArray(content.contentDescription) &&
                  content.contentDescription.map((item) => (
                    <p key={item.id} className="opacity-80 font-medium text-white text-5">
                      {item.text}
                    </p>
                  ))}
              </div>
            </AnimatedSection>
          </GridItem>
        </Grid>
      </GridItem>
      <GridItem
        span={'full'}
        className="relative flex flex-col gap-2 justify-start pt-8 pb-16 items-center px-[calc(2*var(--grid-margin))] md:pt-32 md:pb-20 md:h-screen w-full md:col-span-6!"
      >
        <AnimatedSection
          y={16}
          duration={0.9}
          delay={0.1}
          start="top 90%"
          className="w-fit h-max max-h-[calc(100%-120px)] flex items-center"
        >
          {currentImage && (
            <Image
              key={'header-' + currentImage.id}
              src={currentImage.url ?? ''}
              alt={currentImage.alt}
              width={currentImage.width || 1920}
              height={currentImage.height || 1080}
              className="w-fit h-max max-h-full object-cover"
            />
          )}
        </AnimatedSection>
        <div className="flex flex-row gap-2 min-h-fit h-30 overflow-y-scroll no-scrollbar">
          {contentImages.length > 1 &&
            contentImages.map((image) => (
              <Image
                key={'content-' + image.id}
                src={image.url ?? ''}
                alt={image.alt}
                width={image.width || 1920}
                height={image.height || 1080}
                onClick={() => setCurrentImage(image)}
                className="h-30 w-fit object-cover"
              />
            ))}
        </div>
      </GridItem>
    </Grid>
  )
}
