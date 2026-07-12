'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import type { ComponentProps } from 'react'

import { SERVER_URL } from '@/lib/server-url'

type Props = ComponentProps<typeof Image> & {
  skeletonRatio?: number
}

// Payload renvoie des URLs de médias absolues. Les ramener à un chemin relatif
// quand elles pointent vers notre propre origine : Next les traite alors comme
// des images locales, sans aller les rechercher en HTTP auprès de lui-même.
// C'est aussi ce qui évite le blocage des IP privées de l'optimiseur (Next 16),
// qui rejette http://localhost:3000/... en développement.
function toSameOriginPath(src: Props['src']): Props['src'] {
  if (typeof src !== 'string') return src
  try {
    const url = new URL(src, SERVER_URL)
    if (url.origin !== new URL(SERVER_URL).origin) return src
    return `${url.pathname}${url.search}`
  } catch {
    return src
  }
}

export function BlurImage({ skeletonRatio, ...props }: Props) {
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

    img.addEventListener('load', reveal)
    return () => img.removeEventListener('load', reveal)
  }, [])

  const wrapperStyle: React.CSSProperties = props.fill
    ? { position: 'absolute', inset: 0 }
    : skeletonRatio
      ? { position: 'relative', aspectRatio: `1 / ${skeletonRatio}` }
      : { position: 'relative' }

  return (
    <div style={wrapperStyle}>
      <div ref={skeletonRef} className="blur-image-skeleton absolute inset-0 z-10" />
      <Image ref={imgRef} {...props} src={toSameOriginPath(props.src)} />
    </div>
  )
}
