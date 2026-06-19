'use client'

import { BlurImage } from '@/components/ui/blur-image'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

export function ImageSwitcher({ images, hidden }: { images: string[]; hidden?: boolean }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const imageWrapperRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length)
    }, 2000)
    return () => clearTimeout(timeout)
  }, [currentImageIndex, images.length])

  // Cross-fade on image change — target the wrapper so BlurImage can manage the img opacity
  useEffect(() => {
    if (!imageWrapperRef.current) return
    gsap.fromTo(imageWrapperRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power2.out' })
  }, [currentImageIndex])

  // Container visibility
  useEffect(() => {
    if (!containerRef.current) return
    gsap.to(containerRef.current, {
      opacity: hidden ? 0 : 1,
      duration: 0.35,
      ease: 'power2.out',
    })
  }, [hidden])

  if (!images.length) return null

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center fixed my-[calc(var(--grid-margin-mobile)*2)] mx-(--grid-margin-mobile) right-0 top-0 z-0"
      style={{ opacity: 0 }}
    >
      <div ref={imageWrapperRef}>
        <BlurImage
          src={images[currentImageIndex]}
          alt={'Category Image'}
          width={1940}
          height={1080}
          className="aspect-18/24 w-auto h-[calc(100vh-2*var(--grid-margin-mobile)*2)] object-cover"
        />
      </div>
    </div>
  )
}
