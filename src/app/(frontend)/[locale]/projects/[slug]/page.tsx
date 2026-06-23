import { getPayload } from 'payload'
import { getLocale } from 'next-intl/server'
import { permanentRedirect } from 'next/navigation'
import { ProjectPage } from '@/features/project'
import { NotFoundPage } from '@/components/layout/not-found'
import config from '@/payload.config'
import type { Category, Media } from '@/payload-types'
import type { Metadata } from 'next'
import {
  BASE_URL,
  PERSON_ID,
  absoluteMediaUrl,
  breadcrumbList,
  graph,
  localeAlternates,
  personNode,
  type Locale,
} from '@/lib/seo'

const localeTag: Record<Locale, string> = { en: 'en-US', fr: 'fr-FR' }

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
  const locale = (await getLocale()) as Locale
  const project = await findProject(slug)
  if (!project) return { title: 'Graphic Designer' }

  const title = project.meta?.title ?? project.name ?? ''
  const rawImageUrl = absoluteMediaUrl((project.image as Media | null)?.url)

  const ogParams = new URLSearchParams({ type: 'Project', title })
  if (rawImageUrl) ogParams.set('imageUrl', rawImageUrl)
  const ogUrl = `${BASE_URL}/api/og?${ogParams.toString()}`
  const canonicalSlug = project.slug ?? String(project.id)

  return {
    title,
    description: project.meta?.description ?? project.description,
    alternates: localeAlternates(locale, `/projects/${canonicalSlug}`),
    openGraph: { type: 'article', images: [{ url: ogUrl, width: 1200, height: 630 }] },
    twitter: { card: 'summary_large_image', images: [ogUrl] },
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const locale = (await getLocale()) as Locale
  const project = await findProject(slug)
  if (!project) return <NotFoundPage />

  const img = project.image as Media | null
  const rawImageUrl = absoluteMediaUrl(img?.url)
  const canonicalSlug = project.slug ?? String(project.id)
  const pageUrl = `${BASE_URL}${locale === 'fr' ? '/fr' : ''}/projects/${canonicalSlug}`

  // Crawlable case-study text → articleBody (image-only projects yield '').
  const articleBody = (project.content ?? [])
    .map((section) =>
      [section.title, ...(section.contentDescription ?? []).map((d) => d.text)]
        .filter(Boolean)
        .join(' '),
    )
    .filter(Boolean)
    .join('\n\n')

  const keywords = ((project.relatedCategories ?? []) as (number | Category)[])
    .filter((c): c is Category => typeof c === 'object')
    .map((c) => c.categoryName)

  const imageNode = rawImageUrl
    ? {
        '@type': 'ImageObject',
        contentUrl: rawImageUrl,
        url: rawImageUrl,
        creditText: 'Clara Baptista',
        creator: { '@id': PERSON_ID },
        ...(img?.caption || img?.alt ? { caption: img.caption ?? img.alt } : {}),
      }
    : null

  const creativeWork = {
    '@type': 'CreativeWork',
    '@id': `${pageUrl}#work`,
    name: project.name,
    headline: project.name,
    description: project.meta?.description ?? project.description,
    url: pageUrl,
    inLanguage: localeTag[locale],
    mainEntityOfPage: pageUrl,
    creator: { '@id': PERSON_ID },
    dateModified: project.updatedAt,
    ...(project.releaseDate
      ? { dateCreated: project.releaseDate, datePublished: project.releaseDate }
      : {}),
    ...(keywords.length ? { keywords } : {}),
    ...(articleBody ? { articleBody } : {}),
    ...(imageNode ? { image: imageNode } : {}),
  }

  const jsonLd = graph(
    creativeWork,
    breadcrumbList([
      { name: 'Home', path: '/' },
      { name: 'Projects', path: '/categories' },
      { name: project.name, path: `/projects/${canonicalSlug}` },
    ]),
    personNode(),
  )

  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const projects = await payload.find({
    collection: 'projects',
    where: { id: { equals: project.id } },
    locale,
  })

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <ProjectPage projects={projects} />
    </>
  )
}
