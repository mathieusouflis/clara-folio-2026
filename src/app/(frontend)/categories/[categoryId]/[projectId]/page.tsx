import { getPayload } from 'payload'
import { ProjectPage } from '@/features/project'
import config from '@/payload.config'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categoryId: string; projectId: string }>
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
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ categoryId: string; projectId: string }>
}) {
  const { categoryId, projectId } = await params

  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const projects = await payload.find({
    collection: 'projects',
    where: { id: { equals: projectId } },
  })

  return <ProjectPage projects={projects} categoryId={parseInt(categoryId)} />
}
