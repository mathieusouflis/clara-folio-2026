import { CategoriesPage } from '@/features/categories'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Projects — Clara Baptista, Graphic Designer Paris',
  description:
    'Explore the graphic design projects of Clara Baptista, freelance graphic designer based in Paris.',
}

export default function Page() {
  return <CategoriesPage />
}
