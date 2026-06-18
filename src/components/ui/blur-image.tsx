'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils/cn'

type Props = ComponentProps<typeof Image>

export function BlurImage({ className, ...props }: Props) {
  const [loaded, setLoaded] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    // Handle already-cached images that won't fire onLoad
    if (imgRef.current?.complete) setLoaded(true)
  }, [])

  return (
    <Image
      ref={imgRef}
      {...props}
      className={cn('transition-opacity duration-700 ease-in-out', loaded ? 'opacity-100' : 'opacity-0', className)}
      onLoad={() => setLoaded(true)}
    />
  )
}
