import { revalidatePath } from 'next/cache'
import type { CollectionConfig } from 'payload'
import { translateTexts } from '@/lib/deepl/translate'
import { slugify, uniqueSlug } from '@/lib/slug'
import { syncSlugRedirects } from '@/lib/syncSlugRedirects'

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
    beforeValidate: [
      async ({ data, req, operation, originalDoc }) => {
        if (!data) return data
        if ((req.locale ?? 'en') !== 'en') return data
        if (!data.slug && data.name) {
          const base = slugify(data.name)
          data.slug = await uniqueSlug(
            req.payload,
            'projects',
            base,
            operation === 'update' ? originalDoc?.id : undefined,
          )
        } else if (data.slug) {
          data.slug = slugify(data.slug)
        }
        return data
      },
    ],
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
      async ({ doc, req, operation, previousDoc }) => {
        if (
          operation === 'update' &&
          previousDoc?.slug &&
          doc.slug &&
          previousDoc.slug !== doc.slug
        ) {
          try {
            await syncSlugRedirects(req.payload, 'project', previousDoc.slug, doc.slug)
          } catch (err) {
            console.error('Failed to sync slug redirects:', err)
          }
        }
      },
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
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        components: {
          Field: '@/components/admin/SlugField',
        },
      },
    },
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
