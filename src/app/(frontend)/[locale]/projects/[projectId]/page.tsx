import { getPayload } from 'payload'
import { ProjectPage } from '@/features/project'
import { NotFoundPage } from '@/components/layout/not-found'
import config from '@/payload.config'
import type { Metadata } from 'next'

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
  })
  const project = projects.docs[0]
  if (!project) return { title: 'Clara Baptista — Graphic Designer' }
  return {
    title: project.meta?.title ?? `Clara Baptista — ${project.name}`,
    description: project.meta?.description ?? project.description,
    alternates: { canonical: `/projects/${project.id}` },
    openGraph: {
      images: [
        {
          url: `/api/og?type=Project&projectId=${project.id}`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      images: [`/api/og?type=Project&projectId=${project.id}`],
    },
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
