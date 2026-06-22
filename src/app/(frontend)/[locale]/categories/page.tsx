import { CategoriesPage } from '@/features/categories'
import type { Metadata } from 'next'

const description =
  'Explore the graphic design projects of Clara Baptista, freelance graphic designer based in Paris.'

export const metadata: Metadata = {
  title: 'Projects — Clara Baptista, Graphic Designer Paris',
  description,
  openGraph: {
    images: [
      {
        url: `/api/og?type=Projects&title=Projects&description=${encodeURIComponent(description)}`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [`/api/og?type=Projects&title=Projects&description=${encodeURIComponent(description)}`],
  },
}

export default function Page() {
  return <CategoriesPage />
}
