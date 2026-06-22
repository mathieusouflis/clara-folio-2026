import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import config from '@/payload.config'

const BASE_URL = 'https://clarabaptista.com'

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
      alternates: { languages: { fr: `${BASE_URL}/fr` } },
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: { languages: { fr: `${BASE_URL}/fr/about` } },
    },
    {
      url: `${BASE_URL}/categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
      alternates: { languages: { fr: `${BASE_URL}/fr/categories` } },
    },
  ]

  const categoryRoutes: MetadataRoute.Sitemap = categoriesRes.docs.map((category) => ({
    url: `${BASE_URL}/categories/${category.id}`,
    lastModified: new Date(category.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
    alternates: { languages: { fr: `${BASE_URL}/fr/categories/${category.id}` } },
  }))

  const projectRoutes: MetadataRoute.Sitemap = projectsRes.docs.map((project) => ({
    url: `${BASE_URL}/projects/${project.id}`,
    lastModified: new Date(project.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.9,
    alternates: { languages: { fr: `${BASE_URL}/fr/projects/${project.id}` } },
  }))

  return [...staticRoutes, ...categoryRoutes, ...projectRoutes]
}
