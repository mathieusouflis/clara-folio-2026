import { getPayload } from 'payload'
import { ProjectPage } from '@/features/project'
import { NotFoundPage } from '@/components/layout/not-found'
import config from '@/payload.config'
import type { Media } from '@/payload-types'
import type { Metadata } from 'next'

const BASE_URL = 'https://clarabaptista.com'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ projectId: string }>
}): Promise<Metadata> {
  const { projectId } = await params
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const projects = await payload.find({
    collection: 'projects',
    where: { id: { equals: projectId } },
    depth: 1,
  })
  const project = projects.docs[0]
  if (!project) return { title: 'Clara Baptista — Graphic Designer' }

  const title = (project.meta?.title ?? project.name ?? '').replace(/^Clara Baptista — /, '')
  const img = project.image as Media | null
  const rawImageUrl = img?.url
    ? img.url.startsWith('http')
      ? img.url
      : `${BASE_URL}${img.url}`
    : null

  const ogParams = new URLSearchParams({ type: 'Project', title })
  if (rawImageUrl) ogParams.set('imageUrl', rawImageUrl)
  const ogUrl = `${BASE_URL}/api/og?${ogParams.toString()}`

  return {
    title: project.meta?.title ?? `Clara Baptista — ${project.name}`,
    description: project.meta?.description ?? project.description,
    alternates: { canonical: `/projects/${project.id}` },
    openGraph: { images: [{ url: ogUrl, width: 1200, height: 630 }] },
    twitter: { card: 'summary_large_image', images: [ogUrl] },
  }
}

export default async function Page({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const projects = await payload.find({
    collection: 'projects',
    where: { id: { equals: projectId } },
  })
  const project = projects.docs[0]
  if (!project) return <NotFoundPage />

  const creativeWorkSchema = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.name,
    description: project.meta?.description ?? project.description,
    url: `https://clarabaptista.com/projects/${project.id}`,
    creator: {
      '@type': 'Person',
      name: 'Clara Baptista',
      url: 'https://clarabaptista.com',
    },
    ...(project.releaseDate && { dateCreated: project.releaseDate }),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkSchema) }}
      />
      <ProjectPage projects={projects} />
    </>
  )
}
