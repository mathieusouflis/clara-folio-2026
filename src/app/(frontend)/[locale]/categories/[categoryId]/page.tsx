import { getPayload } from 'payload'
import { NotFoundPage } from '@/components/layout/not-found'
import { ProjectListPage } from '@/features/project-list'
import config from '@/payload.config'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categoryId: string }>
}): Promise<Metadata> {
  const { categoryId } = await params
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  try {
    const category = await payload.findByID({
      collection: 'categories',
      id: parseInt(categoryId),
    })
    const defaultTitle = `Clara Baptista — ${category.categoryName}`
    return {
      title: category.meta?.title ?? defaultTitle,
      description: category.meta?.description ?? undefined,
      alternates: { canonical: `/categories/${category.id}` },
      openGraph: {
        title: category.meta?.title ?? defaultTitle,
        description: category.meta?.description ?? undefined,
      },
    }
  } catch {
    return { title: 'Clara Baptista — Graphic Designer' }
  }
}

export default async function Page({ params }: { params: Promise<{ categoryId: string }> }) {
  const { categoryId } = await params

  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  try {
    const category = await payload.findByID({
      collection: 'categories',
      id: parseInt(categoryId),
      populate: {
        projects: {
          image: true,
          name: true,
          releaseDate: true,
        },
      },
    })
    return <ProjectListPage category={category} />
  } catch {
    return <NotFoundPage />
  }
}
