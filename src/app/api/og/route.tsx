import { ImageResponse } from 'next/og'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Media } from '@/payload-types'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const projectId = searchParams.get('projectId')
  const paramTitle = searchParams.get('title')
  const paramDescription = searchParams.get('description')
  const paramType = searchParams.get('type') // 'Project' | 'Category' | 'Home' | 'About' | 'Projects'

  const BASE_URL = 'https://clarabaptista.com'

  let title = paramTitle ?? 'Graphic Designer'
  let description: string | null = paramDescription
  let pageType: string | null = paramType
  let imageUrl: string | null = null

  if (projectId) {
    try {
      const payloadConfig = await config
      const payload = await getPayload({ config: payloadConfig })
      const result = await payload.find({
        collection: 'projects',
        where: { id: { equals: projectId } },
        depth: 1,
      })
      const project = result.docs[0]
      if (project) {
        title = (project.meta?.title ?? `Clara Baptista — ${project.name}`).replace(
          /^Clara Baptista — /,
          '',
        )
        description = project.meta?.description ?? project.description ?? null
        pageType = pageType ?? 'Project'
        const img = project.image as Media | null
        if (img?.url) {
          imageUrl = img.url.startsWith('http') ? img.url : `${BASE_URL}${img.url}`
        }
      }
    } catch {
      // fall through to defaults
    }
  }

  // Truncate description to ~90 chars for visual clarity
  const shortDesc =
    description && description.length > 90 ? description.slice(0, 90) + '…' : description

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          backgroundColor: '#0000ff',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Background project image */}
        {imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt=""
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.25,
            }}
          />
        )}

        {/* Dark gradient overlay when image is present */}
        {imageUrl && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(135deg, rgba(0,0,255,0.9) 0%, rgba(0,0,0,0.6) 100%)',
            }}
          />
        )}

        {/* Top bar: logo left, page type right */}
        <div
          style={{
            position: 'absolute',
            top: 52,
            left: 60,
            right: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* CB monogram */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                border: '2px solid rgba(255,255,255,0.9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: '0.05em',
              }}
            >
              CB
            </div>
            <span
              style={{
                color: 'rgba(255,255,255,0.7)',
                fontSize: 16,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
              }}
            >
              Clara Baptista
            </span>
          </div>

          {/* Page type badge */}
          {pageType && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px 20px',
                border: '1px solid rgba(255,255,255,0.5)',
                color: 'rgba(255,255,255,0.85)',
                fontSize: 14,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
              }}
            >
              {pageType}
            </div>
          )}
        </div>

        {/* Main content: bottom-left */}
        <div
          style={{
            position: 'absolute',
            bottom: 60,
            left: 60,
            right: 60,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <p
            style={{
              color: '#ffffff',
              fontSize: shortDesc ? 52 : 64,
              fontWeight: 700,
              margin: 0,
              lineHeight: 1.1,
              letterSpacing: '-0.01em',
            }}
          >
            {title}
          </p>
          {shortDesc && (
            <p
              style={{
                color: 'rgba(255,255,255,0.65)',
                fontSize: 22,
                margin: '18px 0 0',
                lineHeight: 1.45,
                maxWidth: '860px',
              }}
            >
              {shortDesc}
            </p>
          )}
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  )
}
