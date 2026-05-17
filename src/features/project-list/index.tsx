import { Play } from 'lucide-react'
import Image from 'next/image'
import { Grid, GridItem } from '@/components/layout/grid'
import { TransitionLink } from '@/components/layout/transition/TransitionLink'
import type { Category } from '@/payload-types'

// Responsive column layout :
//   Mobile  (<sm):  2 colonnes → grid-span-6
//   Tablet (sm-lg): 3 colonnes → grid-span-4
//   Desktop (lg+):  6 colonnes → grid-span-2
const COL_COUNT = 6
const colClass = (idx: number) => {
  // On mobile on réduit à 2 cols (masque 4 sur 6)
  // Sur tablette on réduit à 3 cols (masque 3 sur 6)
  const hiddenOnMobile = idx >= 2   // cols 2-5 masquées sur mobile
  const hiddenOnTablet = idx >= 3   // cols 3-5 masquées sur tablette

  if (hiddenOnTablet) return 'hidden lg:flex flex-col gap-(--grid-gap) lg:grid-span-2'
  if (hiddenOnMobile) return 'hidden sm:flex flex-col gap-(--grid-gap) sm:grid-span-4 lg:grid-span-2'
  return 'flex flex-col gap-(--grid-gap) grid-span-6 sm:grid-span-4 lg:grid-span-2'
}

export async function ProjectListPage({ category }: { category: Category }) {
  const projects =
    category?.relatedProjects
      ?.map(
        (project) =>
          typeof project !== 'number' && {
            ...project,
            imageUrl:
              project.image && typeof project.image !== 'number' && project.image.url,
          },
      )
      .sort((a, b) => {
        if (!a || !b) return 0
        if (!a.releaseDate && !b.releaseDate) return 0
        if (!a.releaseDate) return 1
        if (!b.releaseDate) return -1
        return a.releaseDate > b.releaseDate ? -1 : 1
      }) || []

  if (projects.length === 0)
    return (
      <Grid className="h-screen">
        <GridItem
          span={'full'}
          className="py-10 h-screen flex flex-col gap-10 items-center justify-center"
        >
          <h1 className="opacity-60 text-white text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold text-center px-4">
            WIP, stay tuned !
          </h1>
          <TransitionLink
            href="/categories"
            className="text-white px-12 py-4 min-h-[48px] flex items-center text-[14px] border border-white hover:bg-white hover:text-black duration-300 font-semibold"
          >
            GO BACK
          </TransitionLink>
        </GridItem>
      </Grid>
    )

  return (
    <Grid className="my-10">
      <GridItem span={'full'}>
        <h1 className="text-white text-4xl sm:text-6xl lg:text-8xl">{category?.categoryName}</h1>
      </GridItem>
      {Array.from({ length: COL_COUNT }).map((_, columnIdx) => (
        <GridItem key={`column-${columnIdx}`} className={colClass(columnIdx)}>
          {projects
            .map((project, idx) => ({ project, idx }))
            .filter(({ idx }) => idx % COL_COUNT === columnIdx)
            .map(({ project, idx }) =>
              project && project.imageUrl ? (
                <ProjectPreview
                  categoryId={category.id}
                  imageUrl={project.imageUrl}
                  projectId={project.id}
                  key={idx}
                />
              ) : null,
            )}
        </GridItem>
      ))}
    </Grid>
  )
}

function ProjectPreview({
  categoryId,
  imageUrl,
  projectId,
}: {
  categoryId: number
  imageUrl: string
  projectId: number
}) {
  return (
    <TransitionLink
      href={`/categories/${categoryId}/${projectId}`}
      className="relative group block min-h-[48px]"
    >
      <Play className="group-hover:opacity-100 stroke-white w-8 opacity-0 duration-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10" />
      <Image
        src={imageUrl}
        alt={'Project preview'}
        width={1940}
        height={1080}
        className="w-full h-auto group-hover:opacity-50 transition-opacity duration-300 object-cover"
      />
    </TransitionLink>
  )
}
