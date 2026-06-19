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

    if (img.complete) {
      skeleton.style.display = 'none'
      return
    }

    img.style.opacity = '0'
    img.style.transition = 'opacity 0.7s ease-in-out'

    const onLoad = () => {
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

    img.addEventListener('load', onLoad)
    return () => img.removeEventListener('load', onLoad)
  }, [])

  // fill images need an absolute wrapper so the skeleton covers the positioned parent
  const wrapperStyle: React.CSSProperties = props.fill
    ? { position: 'absolute', inset: 0 }
    : { position: 'relative' }

  return (
    <div style={wrapperStyle}>
      <div ref={skeletonRef} className="blur-image-skeleton absolute inset-0 z-10" />
      <Image ref={imgRef} {...props} />
    </div>
  )
}
