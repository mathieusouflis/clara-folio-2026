'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import type { ComponentProps } from 'react'

type Props = ComponentProps<typeof Image>

export function BlurImage({ ...props }: Props) {
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const img = imgRef.current
    if (!img) return
    // Already loaded (cached or fast network) — leave visible, no animation needed
    if (img.complete) return

    // Not yet loaded — hide now (before browser paints image data) then fade in
    img.style.opacity = '0'
    img.style.transition = 'opacity 0.7s ease-in-out'

    const onLoad = () => {
      img.style.opacity = '1'
    }
    img.addEventListener('load', onLoad)
    return () => img.removeEventListener('load', onLoad)
  }, [])

  return <Image ref={imgRef} {...props} />
}
