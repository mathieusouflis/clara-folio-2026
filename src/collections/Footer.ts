import { revalidatePath } from 'next/cache'
import type { GlobalConfig } from 'payload'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [
      async ({ doc }) => {
        revalidatePath('/', 'layout')
        return doc
      },
    ],
  },
  fields: [
    {
      name: 'socialLinks',
      type: 'array',
      label: 'Social links',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          label: 'URL',
          required: true,
        },
      ],
    },
  ],
}
