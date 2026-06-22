import { CategoriesPage } from '@/features/categories'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: { absolute: 'Projects — Clara Baptista, Graphic Designer Paris' },
  description:
    'Explore the graphic design projects of Clara Baptista, freelance graphic designer based in Paris.',
  openGraph: {
    images: [
      { url: 'https://clarabaptista.com/api/og?title=Categories', width: 1200, height: 630 },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['https://clarabaptista.com/api/og?title=Categories'],
  },
}

export default function Page() {
  return <CategoriesPage />
}
