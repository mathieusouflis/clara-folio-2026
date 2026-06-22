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
    const ogUrl = `https://clarabaptista.com/api/og?type=Category&title=${encodeURIComponent(category.categoryName)}`
    return {
      title: category.categoryName,
      alternates: { canonical: `/categories/${category.id}` },
      openGraph: { images: [{ url: ogUrl, width: 1200, height: 630 }] },
      twitter: { card: 'summary_large_image', images: [ogUrl] },
    }
  } catch {
    return { title: 'Graphic Designer' }
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
