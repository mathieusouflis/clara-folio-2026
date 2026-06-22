import { ImageResponse } from 'next/og'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Media } from '@/payload-types'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const projectId = searchParams.get('projectId')

  const BASE_URL = 'https://clarabaptista.com'

  let title = 'Clara Baptista — Graphic Designer'
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
        title = project.meta?.title ?? `Clara Baptista — ${project.name}`
        const img = project.image as Media | null
        if (img?.url) {
          imageUrl = img.url.startsWith('http') ? img.url : `${BASE_URL}${img.url}`
        }
      }
    } catch {
      // fall through to default
    }
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          backgroundColor: '#0a0a0a',
        }}
      >
        {imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.45 }}
          />
        )}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '60px',
            background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)',
          }}
        >
          <p
            style={{
              color: 'rgba(255,255,255,0.5)',
              fontSize: 22,
              fontFamily: 'sans-serif',
              margin: '0 0 12px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}
          >
            Clara Baptista
          </p>
          <p
            style={{
              color: '#ffffff',
              fontSize: 56,
              fontFamily: 'sans-serif',
              fontWeight: 700,
              margin: 0,
              lineHeight: 1.15,
            }}
          >
            {title.replace(/^Clara Baptista — /, '')}
          </p>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  )
}
