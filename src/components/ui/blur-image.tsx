'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import type { ComponentProps } from 'react'

type Props = ComponentProps<typeof Image>

export function BlurImage({ ...props }: Props) {
  const imgRef = useRef<HTMLImageElement>(null)
  const skeletonRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const img = imgRef.current
    const skeleton = skeletonRef.current
    if (!img || !skeleton) return

    img.style.opacity = '0'
    img.style.transition = 'opacity 0.7s ease-in-out'

    const reveal = () => {
      img.style.opacity = '1'
      skeleton.style.transition = 'opacity 0.4s ease-in-out'
      skeleton.style.opacity = '0'
      img.addEventListener(
        'transitionend',
        () => {
          img.style.opacity = ''
          img.style.transition = ''
          skeleton.style.display = 'none'
        },
        { once: true },
      )
    }

    // DEV: forced delay to inspect skeleton — swap the two lines below when done:
    const timer = setTimeout(reveal, 3000)
    return () => clearTimeout(timer)
    // PROD: img.addEventListener('load', reveal); return () => img.removeEventListener('load', reveal)
  }, [])

  const hasAspectClass = typeof props.className === 'string' && props.className.includes('aspect-')

  const wrapperStyle: React.CSSProperties = props.fill
    ? { position: 'absolute', inset: 0 }
    : {
        position: 'relative',
        // Pre-reserve exact space so skeleton matches image size before load.
        // Skip when className already has an aspect-* override.
        ...(!hasAspectClass && props.width && props.height
          ? { aspectRatio: `${props.width} / ${props.height}` }
          : {}),
      }

  return (
    <div style={wrapperStyle}>
      <div ref={skeletonRef} className="blur-image-skeleton absolute inset-0 z-10" />
      <Image ref={imgRef} {...props} />
    </div>
  )
}
