import { ImageResponse } from 'next/og'
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

export const runtime = 'nodejs'

function loadFonts() {
  const regular = fs.readFileSync(path.join(process.cwd(), 'public/fonts/Satoshi-Regular.otf'))
  const bold = fs.readFileSync(path.join(process.cwd(), 'public/fonts/Satoshi-Bold.otf'))
  return { regular, bold }
}

async function fetchImageAsJpegDataUrl(imageUrl: string): Promise<string | null> {
  try {
    const res = await fetch(imageUrl)
    if (!res.ok) return null
    const buffer = Buffer.from(await res.arrayBuffer())
    const jpeg = await sharp(buffer)
      .resize(620, 630, { fit: 'cover' })
      .jpeg({ quality: 85 })
      .toBuffer()
    return `data:image/jpeg;base64,${jpeg.toString('base64')}`
  } catch {
    return null
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') ?? 'Graphic Designer'
  const pageType = searchParams.get('type') // 'Project' | 'Category' | null
  const rawImageUrl = searchParams.get('imageUrl') // absolute URL, only for projects

  const { regular, bold } = loadFonts()

  const imageSrc = rawImageUrl ? await fetchImageAsJpegDataUrl(rawImageUrl) : null
  const hasImage = Boolean(imageSrc)

  return new ImageResponse(
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
        {/* Top: Logo */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 474.84 477.59"
          width={52}
          height={52}
          fill="rgba(255,255,255,0.4)"
        >
          <path d="M277.15,304.02c-8.7,3.67-19.61,7.14-22.99,16.01-3.79,9.93,7.28,18.47,17.97,18.22,27.96-.67,54.51-17.68,67.17-42.4,6.92-13.52-.44-26.74-12.37-32.79-13.9-7.05-27.52-5.63-43.99-7.4,21.84-17.31,50.55-17.61,72.57-4.85,24.59,14.25,32.41,43.23,17.5,67.78-17.19,28.3-47.94,47.75-81.8,48.98-30.18,1.1-59.09-14.44-70.68-41.05-4.75-10.9-2.75-22.28,3.14-30,6.14-8.05,16.66-12.01,27.8-9.85s19.54,8.83,25.67,17.35Z" />
          <path d="M133.29,304.13c6.24,12.61,19.77,16,30.98,11.46,15.18-6.15,22.31-18.97,34.66-32.3,1.55,30.09-19.36,57.67-48.18,64.31-23.24,5.36-44.74-5.42-54.48-26.99-12.96-28.71-11.79-63.62,3.82-91.23,15.36-27.18,44.49-43.78,74.66-39.37,12.83,1.88,22.42,9.47,25.76,19.92,3.44,10.77-.09,22.59-9.54,30.52-7.23,6.06-16.18,9.53-27.33,8.74,1.56-8.27,5.79-21.13-.27-28.24-7.59-8.91-21.07-2.23-26.48,6.81-13.62,22.76-15.9,51.48-3.59,76.36Z" />
          <path d="M295.29,194.04c11.47.36,14.9-14.08,11.23-23.26-10.21-25.47-34.47-44.59-61.7-48.12-15.24-1.97-25.1,7.58-27.45,20.92-2.53,14.39,3.86,25.84,5.39,42.64-26.63-16.76-35-51.65-21.7-78.2,9.38-18.72,28.01-28.68,49.03-25.51,35.2,5.32,66.31,29.66,78.59,63.09,9.46,25.74,5.5,54.83-11.94,74.45-8.44,9.49-19.87,14.23-30.95,11.39-10.41-2.67-19.3-11.72-20.72-24.02-1.17-10.09,1.04-20.36,7.84-29.25,5.73,5.12,12.04,15.54,22.38,15.86Z" />
        </svg>

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
          src={imageSrc!}
          alt=""
          style={{
            flex: 1,
            height: '100%',
            objectFit: 'cover',
          }}
        />
      )}
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Satoshi', data: regular, style: 'normal', weight: 400 },
        { name: 'Satoshi', data: bold, style: 'normal', weight: 700 },
      ],
    },
  )
}
