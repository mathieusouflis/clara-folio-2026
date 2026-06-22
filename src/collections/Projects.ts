import { revalidatePath } from 'next/cache'
import type { CollectionConfig } from 'payload'
import { translateTexts } from '@/lib/deepl/translate'

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
      async ({ doc, req, operation }) => {
        revalidatePath('/categories')

        // Auto-translate to French when saving English content
        if (req.locale === 'en' && process.env.DEEPL_API_KEY) {
          try {
            const textsToTranslate: string[] = []
            textsToTranslate.push(doc.name ?? '')
            textsToTranslate.push(doc.description ?? '')

            const contentTitles = (doc.content ?? []).map((s: any) => s.title ?? '')
            const contentTexts = (doc.content ?? []).flatMap((s: any) =>
              (s.contentDescription ?? []).map((d: any) => d.text ?? ''),
            )
            textsToTranslate.push(...contentTitles, ...contentTexts)

            const translated = await translateTexts(textsToTranslate, 'FR')

            let idx = 0
            const frName = translated[idx++]
            const frDescription = translated[idx++]
            const frContent = (doc.content ?? []).map((section: any) => ({
              ...section,
              title: translated[idx++],
              contentDescription: (section.contentDescription ?? []).map((d: any) => ({
                ...d,
                text: translated[idx++],
              })),
            }))

            await req.payload.update({
              collection: 'projects',
              id: doc.id,
              locale: 'fr',
              data: {
                name: frName,
                description: frDescription,
                content: frContent,
              },
              req,
            })
          } catch (err) {
            console.error('DeepL auto-translation failed:', err)
          }
        }

        return doc
      },
    ],
  },

  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
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
          localized: true,
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
              localized: true,
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
