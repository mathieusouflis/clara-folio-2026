import { getPayload } from 'payload'
import { permanentRedirect } from 'next/navigation'
import { NotFoundPage } from '@/components/layout/not-found'
import { ProjectListPage } from '@/features/project-list'
import config from '@/payload.config'
import type { Metadata } from 'next'

const BASE_URL = 'https://clarabaptista.com'

async function findCategory(slugOrId: string) {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  if (/^\d+$/.test(slugOrId)) {
    try {
      const category = await payload.findByID({
        collection: 'categories',
        id: parseInt(slugOrId),
      })
      if (category?.slug) permanentRedirect(`/categories/${category.slug}`)
      return category ?? null
    } catch {
      return null
    }
  }

  const res = await payload.find({
    collection: 'categories',
    where: { slug: { equals: slugOrId } },
    limit: 1,
  })
  if (res.docs[0]) return res.docs[0]

  // Slug not found — check if it was renamed
  const redirect = await payload.find({
    collection: 'redirects',
    where: { and: [{ from: { equals: slugOrId } }, { collectionType: { equals: 'category' } }] },
    limit: 1,
    depth: 0,
  })
  if (redirect.docs[0]) permanentRedirect(`/categories/${redirect.docs[0].to}`)
  return null
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categorySlug: string }>
}): Promise<Metadata> {
  const { categorySlug } = await params
  const category = await findCategory(categorySlug)
  if (!category) return { title: 'Graphic Designer' }

  const canonicalSlug = category.slug ?? String(category.id)
  const ogUrl = `${BASE_URL}/api/og?type=Category&title=${encodeURIComponent(category.categoryName)}`
  return {
    title: category.categoryName,
    alternates: { canonical: `/categories/${canonicalSlug}` },
    openGraph: { images: [{ url: ogUrl, width: 1200, height: 630 }] },
    twitter: { card: 'summary_large_image', images: [ogUrl] },
  }
}

export default async function Page({ params }: { params: Promise<{ categorySlug: string }> }) {
  const { categorySlug } = await params

  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  try {
    let category

    if (/^\d+$/.test(categorySlug)) {
      category = await payload.findByID({
        collection: 'categories',
        id: parseInt(categorySlug),
        populate: {
          projects: { image: true, name: true, releaseDate: true, slug: true },
        },
      })
      if (category?.slug) permanentRedirect(`/categories/${category.slug}`)
    } else {
      const res = await payload.find({
        collection: 'categories',
        where: { slug: { equals: categorySlug } },
        limit: 1,
        populate: {
          projects: { image: true, name: true, releaseDate: true, slug: true },
        },
      })
      category = res.docs[0]
    }

    if (!category) return <NotFoundPage />
    return <ProjectListPage category={category} />
  } catch {
    return <NotFoundPage />
  }
}
