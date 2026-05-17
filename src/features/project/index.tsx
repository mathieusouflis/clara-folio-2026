import type { PaginatedDocs } from 'payload'
import type { Project } from '@/payload-types'
import { ProjectSection } from './section'
import { ProjectHeroClient } from './components/project-hero-client'

export async function ProjectPage({
  projects,
  categoryId,
}: {
  projects: PaginatedDocs<Project>
  categoryId: number
}) {
  if (!projects.docs || projects.docs.length === 0) {
    return null
  }
  const project = projects.docs[0]

  return (
    <>
      <ProjectHeroClient project={project} />
      {project.content?.map((content) => (
        <ProjectSection key={content.id} content={[content]} />
      ))}
    </>
  )
}
