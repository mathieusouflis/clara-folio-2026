import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import config from '@/payload.config'

const BASE_URL = 'https://clarabaptista.com'

// The sitemap reads projects and categories from Payload, so it cannot be
// prerendered: the database is unreachable during the Docker build. Rendering
// on demand also means new content appears without a rebuild.
export const dynamic = 'force-dynamic'

// Reciprocal + self-referencing hreflang. Listing only `fr` (without an `en`
// self-reference and `x-default`) breaks the cluster and Google ignores it.
function languages(enPath: string) {
  const en = `${BASE_URL}${enPath}`
  const fr = `${BASE_URL}/fr${enPath}`
  return { en, fr, 'x-default': en }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const [projectsRes, categoriesRes] = await Promise.all([
    payload.find({ collection: 'projects', limit: 1000, depth: 0 }),
    payload.find({ collection: 'categories', limit: 1000, depth: 0 }),
  ])

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
      alternates: { languages: languages('') },
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: { languages: languages('/about') },
    },
    {
      url: `${BASE_URL}/categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
      alternates: { languages: languages('/categories') },
    },
    {
      url: `${BASE_URL}/services`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
      alternates: { languages: languages('/services') },
    },
  ]

  const categoryRoutes: MetadataRoute.Sitemap = categoriesRes.docs
    .filter((category) => category.slug)
    .map((category) => ({
      url: `${BASE_URL}/categories/${category.slug}`,
      lastModified: new Date(category.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
      alternates: { languages: languages(`/categories/${category.slug}`) },
    }))

  const projectRoutes: MetadataRoute.Sitemap = projectsRes.docs
    .filter((project) => project.slug)
    .map((project) => ({
      url: `${BASE_URL}/projects/${project.slug}`,
      lastModified: new Date(project.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
      alternates: { languages: languages(`/projects/${project.slug}`) },
    }))

  return [...staticRoutes, ...categoryRoutes, ...projectRoutes]
}
