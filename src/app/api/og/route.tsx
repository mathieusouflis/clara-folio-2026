import { ImageResponse } from 'next/og'
import fs from 'fs'
import path from 'path'

export const runtime = 'nodejs'

function loadFont(): Buffer {
  return fs.readFileSync(path.join(process.cwd(), 'public/fonts/Satoshi-Variable.woff2'))
}

const LOGO_DATA_URI =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NzQuODQgNDc3LjU5IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuNCkiPjxwYXRoIGQ9Ik0yNzcuMTUsMzA0LjAyYy04LjcsMy42Ny0xOS42MSw3LjE0LTIyLjk5LDE2LjAxLTMuNzksOS45Myw3LjI4LDE4LjQ3LDE3Ljk3LDE4LjIyLDI3Ljk2LS42Nyw1NC41MS0xNy42OCw2Ny4xNy00Mi40LDYuOTItMTMuNTItLjQ0LTI2Ljc0LTEyLjM3LTMyLjc5LTEzLjktNy4wNS0yNy41Mi01LjYzLTQzLjk5LTcuNCwyMS44NC0xNy4zMSw1MC41NS0xNy42MSw3Mi41Ny00Ljg1LDI0LjU5LDE0LjI1LDMyLjQxLDQzLjIzLDE3LjUsNjcuNzgtMTcuMTksMjguMy00Ny45NCw0Ny43NS04MS44LDQ4Ljk4LTMwLjE4LDEuMS01OS4wOS0xNC40NC03MC42OC00MS4wNS00Ljc1LTEwLjktMi43NS0yMi4yOCwzLjE0LTMwLDYuMTQtOC4wNSwxNi42Ni0xMi4wMSwyNy44LTkuODVzMTkuNTQsOC44MywyNS42NywxNy4zNVoiLz48cGF0aCBkPSJNMTMzLjI5LDMwNC4xM2M2LjI0LDEyLjYxLDE5Ljc3LDE2LDMwLjk4LDExLjQ2LDE1LjE4LTYuMTUsMjIuMzEtMTguOTcsMzQuNjYtMzIuMywxLjU1LDMwLjA5LTE5LjM2LDU3LjY3LTQ4LjE4LDY0LjMxLTIzLjI0LDUuMzYtNDQuNzQtNS40Mi01NC40OC0yNi45OS0xMi45Ni0yOC43MS0xMS43OS02My42MiwzLjgyLTkxLjIzLDE1LjM2LTI3LjE4LDQ0LjQ5LTQzLjc4LDc0LjY2LTM5LjM3LDEyLjgzLDEuODgsMjIuNDIsOS40NywyNS43NiwxOS45MiwzLjQ0LDEwLjc3LS4wOSwyMi41OS05LjU0LDMwLjUyLTcuMjMsNi4wNi0xNi4xOCw5LjUzLTI3LjMzLDguNzQsMS41Ni04LjI3LDUuNzktMjEuMTMtLjI3LTI4LjI0LTcuNTktOC45MS0yMS4wNy0yLjIzLTI2LjQ4LDYuODEtMTMuNjIsMjIuNzYtMTUuOSw1MS40OC0zLjU5LDc2LjM2WiIvPjxwYXRoIGQ9Ik0yOTUuMjksMTk0LjA0YzExLjQ3LjM2LDE0LjktMTQuMDgsMTEuMjMtMjMuMjYtMTAuMjEtMjUuNDctMzQuNDctNDQuNTktNjEuNy00OC4xMi0xNS4yNC0xLjk3LTI1LjEsNy41OC0yNy40NSwyMC45Mi0yLjUzLDE0LjM5LDMuODYsMjUuODQsNS4zOSw0Mi42NC0yNi42My0xNi43Ni0zNS01MS42NS0yMS43LTc4LjIsOS4zOC0xOC43MiwyOC4wMS0yOC42OCw0OS4wMy0yNS41MSwzNS4yLDUuMzIsNjYuMzEsMjkuNjYsNzguNTksNjMuMDksOS40NiwyNS43NCw1LjUsNTQuODMtMTEuOTQsNzQuNDUtOC40NCw5LjQ5LTE5Ljg3LDE0LjIzLTMwLjk1LDExLjM5LTEwLjQxLTIuNjctMTkuMy0xMS43Mi0yMC43Mi0yNC4wMi0xLjE3LTEwLjA5LDEuMDQtMjAuMzYsNy44NC0yOS4yNSw1LjczLDUuMTIsMTIuMDQsMTUuNTQsMjIuMzgsMTUuODZaIi8+PC9zdmc+'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') ?? 'Graphic Designer'
  const pageType = searchParams.get('type') // 'Project' | 'Category' | null
  const imageUrl = searchParams.get('imageUrl') // absolute URL, only for projects

  const font = loadFont()
  const hasImage = Boolean(imageUrl)

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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={LOGO_DATA_URI} width={36} height={36} alt="" />

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
    </div>,
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
