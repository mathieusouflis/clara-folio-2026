import { getPayload } from 'payload'
import { getLocale } from 'next-intl/server'
import { permanentRedirect } from 'next/navigation'
import { NotFoundPage } from '@/components/layout/not-found'
import { ProjectListPage } from '@/features/project-list'
import config from '@/payload.config'
import type { Metadata } from 'next'
import type { Project } from '@/payload-types'
import { BASE_URL, breadcrumbList, graph, localeAlternates, type Locale } from '@/lib/seo'

async function findCategory(slugOrId: string, locale?: Locale) {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  if (/^\d+$/.test(slugOrId)) {
    try {
      const category = await payload.findByID({
        collection: 'categories',
        id: parseInt(slugOrId),
        ...(locale ? { locale } : {}),
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
    ...(locale ? { locale } : {}),
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
  const locale = (await getLocale()) as Locale
  const category = await findCategory(categorySlug, locale)
  if (!category) return { title: 'Graphic Designer' }

  const canonicalSlug = category.slug ?? String(category.id)
  const ogUrl = `${BASE_URL}/api/og?type=Category&title=${encodeURIComponent(category.categoryName)}`
  return {
    title: category.categoryName,
    alternates: localeAlternates(locale, `/categories/${canonicalSlug}`),
    openGraph: { images: [{ url: ogUrl, width: 1200, height: 630 }] },
    twitter: { card: 'summary_large_image', images: [ogUrl] },
  }
}

export default async function Page({ params }: { params: Promise<{ categorySlug: string }> }) {
  const { categorySlug } = await params

  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const locale = (await getLocale()) as 'en' | 'fr'

  try {
    let category

    if (/^\d+$/.test(categorySlug)) {
      category = await payload.findByID({
        collection: 'categories',
        id: parseInt(categorySlug),
        locale,
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
        locale,
        populate: {
          projects: { image: true, name: true, releaseDate: true, slug: true },
        },
      })
      category = res.docs[0]
    }

    if (!category) return <NotFoundPage />

    const canonicalSlug = category.slug ?? String(category.id)
    const categoryPath = `/categories/${canonicalSlug}`
    const projectItems = ((category.relatedProjects ?? []) as (number | Project)[])
      .filter((p): p is Project => typeof p === 'object' && Boolean(p.slug))
      .map((p, i) => ({
        '@type': 'ListItem' as const,
        position: i + 1,
        url: `${BASE_URL}/projects/${p.slug}`,
        name: p.name,
      }))

    const jsonLd = graph(
      {
        '@type': 'CollectionPage',
        name: category.categoryName,
        url: `${BASE_URL}${locale === 'fr' ? '/fr' : ''}${categoryPath}`,
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: projectItems.length,
          itemListElement: projectItems,
        },
      },
      breadcrumbList([
        { name: 'Home', path: '/' },
        { name: 'Projects', path: '/categories' },
        { name: category.categoryName, path: categoryPath },
      ]),
    )

    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
        <ProjectListPage category={category} />
      </>
    )
  } catch {
    return <NotFoundPage />
  }
}
