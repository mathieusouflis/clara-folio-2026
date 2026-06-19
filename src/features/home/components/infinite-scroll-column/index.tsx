'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { gsap } from 'gsap'
import { BlurImage } from '@/components/ui/blur-image'
import { cn } from '@/lib/utils/cn'
import type { Project, Media } from '@/payload-types'

export interface InfiniteScrollColumnProps {
  projects: Project[]
  direction?: 'up' | 'down'
  speed?: number
  gap?: number
  className?: string
  pauseOnHover?: boolean
  initialOffset?: number
}

export function InfiniteScrollColumn({
  projects,
  direction = 'up',
  speed = 30,
  gap = 16,
  className,
  pauseOnHover = true,
  initialOffset,
}: InfiniteScrollColumnProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const tweenRef = useRef<gsap.core.Tween | null>(null)
  const [isReady, setIsReady] = useState(false)
  const randomOffsetRef = useRef<number>(
    initialOffset !== undefined ? initialOffset : Math.random(),
  )

  const getDisplayItems = useCallback(() => {
    if (projects.length === 0) return []

    const minItems = Math.max(12, projects.length * 3)
    const duplications = Math.ceil(minItems / projects.length)

    const items: Project[] = []
    for (let i = 0; i < duplications; i++) {
      items.push(...projects)
    }
    return items
  }, [projects])

  const displayItems = getDisplayItems()

  const initAnimation = useCallback(() => {
    if (!trackRef.current || !containerRef.current || projects.length === 0) return

    const track = trackRef.current
    const container = containerRef.current
    const items = gsap.utils.toArray<HTMLElement>('.scroll-item', track)

    if (items.length === 0) return

    if (tweenRef.current) {
      tweenRef.current.kill()
      tweenRef.current = null
    }

    const containerWidth = container.offsetWidth
    const itemHeight = (containerWidth * 4) / 3
    const totalItemHeight = itemHeight + gap

    items.forEach((item, index) => {
      gsap.set(item, {
        y: index * totalItemHeight,
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: itemHeight,
      })
    })

    const totalHeight = items.length * totalItemHeight
    const oneSetHeight = projects.length * totalItemHeight
    const wrapY = gsap.utils.wrap(-totalItemHeight, totalHeight - totalItemHeight)
    const yMovement = direction === 'up' ? `-=${oneSetHeight}` : `+=${oneSetHeight}`

    tweenRef.current = gsap.to(items, {
      y: yMovement,
      duration: speed,
      ease: 'none',
      repeat: -1,
      modifiers: {
        y: (y: string) => wrapY(parseFloat(y)) + 'px',
      },
    })

    tweenRef.current.progress(randomOffsetRef.current)
    setIsReady(true)
  }, [projects, direction, speed, gap])

  useEffect(() => {
    const initTimeout = setTimeout(() => {
      initAnimation()
    }, 50)

    const handleResize = () => {
      initAnimation()
    }

    let resizeTimeout: NodeJS.Timeout
    const debouncedResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(handleResize, 200)
    }

    window.addEventListener('resize', debouncedResize)

    return () => {
      clearTimeout(initTimeout)
      clearTimeout(resizeTimeout)
      window.removeEventListener('resize', debouncedResize)
      if (tweenRef.current) {
        tweenRef.current.kill()
        tweenRef.current = null
      }
    }
  }, [initAnimation])

  const handleMouseEnter = useCallback(() => {
    if (pauseOnHover && tweenRef.current) {
      tweenRef.current.pause()
    }
  }, [pauseOnHover])

  const handleMouseLeave = useCallback(() => {
    if (pauseOnHover && tweenRef.current) {
      tweenRef.current.resume()
    }
  }, [pauseOnHover])

  const getImageUrl = (project: Project): string | null => {
    if (!project.image) return null
    if (typeof project.image === 'number') return null
    return (project.image as Media).url || null
  }

  if (projects.length === 0) return null

  return (
    <div
      ref={containerRef}
      className={cn('relative h-full w-full overflow-hidden', className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={trackRef}
        className="relative h-full w-full"
        style={{
          opacity: isReady ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out',
        }}
      >
        {displayItems.map((project, index) => {
          const imageUrl = getImageUrl(project)

          return (
            <div
              key={`${project.id}-${index}`}
              className="scroll-item"
              style={{
                willChange: 'transform',
                paddingBottom: gap,
              }}
            >
              <div
                className="relative w-full overflow-hidden bg-neutral-100"
                style={{ aspectRatio: '18 / 24' }}
              >
                {imageUrl ? (
                  <BlurImage
                    src={imageUrl}
                    alt={project.name || 'Project image'}
                    fill
                    className="object-cover brightness-75"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
                    priority={index < 4}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-neutral-200">
                    <span className="text-sm text-neutral-400">{project.name || 'No image'}</span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default InfiniteScrollColumn
