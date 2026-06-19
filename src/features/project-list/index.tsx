import { Grid, GridItem } from '@/components/layout/grid'
import { TransitionLink } from '@/components/layout/transition/TransitionLink'
import { BlurImage } from '@/components/ui/blur-image'
import type { Category } from '@/payload-types'

export async function ProjectListPage({ category }: { category: Category }) {
  const projects =
    category?.relatedProjects
      ?.map(
        (project) =>
          typeof project !== 'number' && {
            ...project,
            imageUrl: project.image && typeof project.image !== 'number' && project.image.url,
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
            data-cursor="open"
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
      <GridItem span={'full'}>
        <div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6"
          style={{ gap: 'var(--grid-gap)' }}
        >
          {projects.map((project, idx) =>
            project && project.imageUrl ? (
              <ProjectPreview
                key={idx}
                categoryId={category.id}
                imageUrl={project.imageUrl}
                projectId={project.id}
              />
            ) : null,
          )}
        </div>
      </GridItem>
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
      data-cursor="view"
      className="relative group block min-h-[48px]"
    >
      <BlurImage
        src={imageUrl}
        alt={'Project preview'}
        width={1940}
        height={1080}
        className="w-full h-auto group-hover:opacity-50 transition-opacity duration-300 object-cover"
      />
    </TransitionLink>
  )
}
