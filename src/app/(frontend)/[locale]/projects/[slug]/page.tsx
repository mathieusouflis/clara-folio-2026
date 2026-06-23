import { getPayload } from 'payload'
import { getLocale } from 'next-intl/server'
import { permanentRedirect } from 'next/navigation'
import { ProjectPage } from '@/features/project'
import { NotFoundPage } from '@/components/layout/not-found'
import config from '@/payload.config'
import type { Media } from '@/payload-types'
import type { Metadata } from 'next'

const BASE_URL = 'https://clarabaptista.com'

async function findProject(slug: string) {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const locale = (await getLocale()) as 'en' | 'fr'

  // Numeric ID → find by ID and redirect to slug URL
  if (/^\d+$/.test(slug)) {
    const byId = await payload.find({
      collection: 'projects',
      where: { id: { equals: slug } },
      depth: 1,
      locale,
    })
    const project = byId.docs[0]
    if (project?.slug) permanentRedirect(`/projects/${project.slug}`)
    return project ?? null
  }

  const res = await payload.find({
    collection: 'projects',
    where: { slug: { equals: slug } },
    depth: 1,
    locale,
  })
  if (res.docs[0]) return res.docs[0]

  // Slug not found — check if it was renamed
  const redirect = await payload.find({
    collection: 'redirects',
    where: { and: [{ from: { equals: slug } }, { collectionType: { equals: 'project' } }] },
    limit: 1,
    depth: 0,
  })
  if (redirect.docs[0]) permanentRedirect(`/projects/${redirect.docs[0].to}`)
  return null
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = await findProject(slug)
  if (!project) return { title: 'Graphic Designer' }

  const title = project.meta?.title ?? project.name ?? ''
  const img = project.image as Media | null
  const rawImageUrl = img?.url
    ? img.url.startsWith('http')
      ? img.url
      : `${BASE_URL}${img.url}`
    : null

  const ogParams = new URLSearchParams({ type: 'Project', title })
  if (rawImageUrl) ogParams.set('imageUrl', rawImageUrl)
  const ogUrl = `${BASE_URL}/api/og?${ogParams.toString()}`
  const canonicalSlug = project.slug ?? String(project.id)

  return {
    title,
    description: project.meta?.description ?? project.description,
    alternates: { canonical: `/projects/${canonicalSlug}` },
    openGraph: { images: [{ url: ogUrl, width: 1200, height: 630 }] },
    twitter: { card: 'summary_large_image', images: [ogUrl] },
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = await findProject(slug)
  if (!project) return <NotFoundPage />

  const img = project.image as Media | null
  const rawImageUrl = img?.url
    ? img.url.startsWith('http')
      ? img.url
      : `${BASE_URL}${img.url}`
    : null

  const canonicalSlug = project.slug ?? String(project.id)
  const creativeWorkSchema = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.name,
    description: project.meta?.description ?? project.description,
    url: `${BASE_URL}/projects/${canonicalSlug}`,
    creator: {
      '@type': 'Person',
      name: 'Clara Baptista',
      url: BASE_URL,
    },
    ...(project.releaseDate && { dateCreated: project.releaseDate }),
    ...(rawImageUrl && { image: rawImageUrl }),
  }

  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const locale = (await getLocale()) as 'en' | 'fr'
  const projects = await payload.find({
    collection: 'projects',
    where: { id: { equals: project.id } },
    locale,
  })

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
