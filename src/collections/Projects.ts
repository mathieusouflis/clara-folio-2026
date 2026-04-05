import { revalidatePath } from 'next/cache'
import type { CollectionConfig } from 'payload'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'name',
    group: 'Projects',
    groupBy: true,
  },
  access: {
    read: () => true,
  },

  hooks: {
    beforeDelete: [
      async ({ req, id }) => {
        try {
          const project = await req.payload.findByID({
            collection: 'projects',
            id,
            req,
          })

          if (project && project.relatedCategories) {
            const categoryIds = (project.relatedCategories || []).map((c: any) =>
              typeof c === 'object' ? c.id : c,
            )

            for (const categoryId of categoryIds) {
              try {
                const category = await req.payload.findByID({
                  collection: 'categories',
                  id: categoryId,
                  req,
                })

                if (category) {
                  const currentCount = category.projectCount || 0
                  const newCount = Math.max(0, currentCount - 1)

                  const updatedProjects = (category.relatedProjects || [])
                    .map((p: any) => (typeof p === 'object' ? p.id : p))
                    .filter((projectId: string) => projectId !== id)

                  await req.payload.update({
                    collection: 'categories',
                    id: categoryId,
                    data: {
                      projectCount: newCount,
                      relatedProjects: updatedProjects,
                    },
                    req,
                  })
                }
              } catch (error) {
                console.error(`Error updating category ${categoryId} when deleting project:`, error)
              }
            }
          }
        } catch (error) {
          console.error(`Error in beforeDelete hook for project ${id}:`, error)
        }
      },
    ],
    afterChange: [
      async ({ doc }) => {
        revalidatePath('/categories')
        return doc
      },
    ],
  },

  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'releaseDate',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'content',
      type: 'array',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'contentDescription',
          type: 'array',
          required: true,
          fields: [
            {
              name: 'text',
              type: 'text',
              required: true,
            },
          ],
        },
        {
          name: 'images',
          type: 'upload',
          relationTo: 'media',
          hasMany: true,
        },
      ],
    },
    {
      name: 'relatedCategories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
  ],
}
