import { ImageResponse } from 'next/og'
import fs from 'fs'
import path from 'path'

export const runtime = 'nodejs'

function loadFont(): Buffer {
  return fs.readFileSync(path.join(process.cwd(), 'public/fonts/Satoshi-Variable.woff2'))
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') ?? 'Graphic Designer'
  const pageType = searchParams.get('type') // 'Project' | 'Category' | null
  const imageUrl = searchParams.get('imageUrl') // absolute URL, only for projects

  const font = loadFont()
  const hasImage = Boolean(imageUrl)

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'row',
          backgroundColor: '#0000ff',
          fontFamily: 'Satoshi',
        }}
      >
        {/* Left: branding + title */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: hasImage ? 580 : 1200,
            height: '100%',
            padding: '54px 64px 60px',
            flexShrink: 0,
          }}
        >
          {/* Top: CLARA BAPTISTA */}
          <span
            style={{
              color: 'rgba(255,255,255,0.4)',
              fontSize: 12,
              fontWeight: 400,
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
            }}
          >
            Clara Baptista
          </span>

          {/* Bottom: eyebrow + title */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {pageType && (
              <span
                style={{
                  color: 'rgba(255,255,255,0.5)',
                  fontSize: 12,
                  fontWeight: 400,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  marginBottom: 20,
                }}
              >
                {pageType}
              </span>
            )}
            <span
              style={{
                color: '#ffffff',
                fontSize: hasImage ? 52 : 80,
                fontWeight: 700,
                lineHeight: 1.0,
                letterSpacing: hasImage ? '-0.01em' : '-0.02em',
              }}
            >
              {title}
            </span>
          </div>
        </div>

        {/* Right: project image */}
        {hasImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl!}
            alt=""
            style={{
              flex: 1,
              height: '100%',
              objectFit: 'cover',
            }}
          />
        )}
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Satoshi', data: font, style: 'normal', weight: 400 },
        { name: 'Satoshi', data: font, style: 'normal', weight: 700 },
      ],
    },
  )
}
