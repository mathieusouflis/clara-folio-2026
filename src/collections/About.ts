import { revalidatePath } from 'next/cache'
import type { GlobalConfig } from 'payload'

export const About: GlobalConfig = {
  slug: 'about',
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [
      async ({ doc }) => {
        revalidatePath('/about')
        return doc
      },
    ],
  },

  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      defaultValue: 'Clara Baptista',
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'experiences',
      type: 'array',
      fields: [
        {
          name: 'enterpriseName',
          type: 'text',
          required: true,
        },
        {
          name: 'jobPost',
          type: 'text',
          required: true,
        },
        {
          name: 'jobType',
          type: 'text',
          required: true,
        },
        {
          name: 'startYear',
          type: 'number',
          required: true,
        },
        {
          name: 'endYear',
          type: 'number',
        },
      ],
    },
    {
      name: 'education',
      type: 'array',
      fields: [
        {
          name: 'schoolName',
          type: 'text',
          required: true,
        },
        {
          name: 'schoolType',
          type: 'text',
          required: true,
        },
        {
          name: 'startYear',
          type: 'number',
          required: true,
        },
        {
          name: 'endYear',
          type: 'number',
        },
      ],
    },
    {
      name: 'hardSkillsCategories',
      type: 'array',
      fields: [
        {
          name: 'categoryName',
          type: 'text',
          required: true,
        },
        {
          name: 'hardSkills',
          type: 'array',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: 'softSkills',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'text',
        },
      ],
    },
    {
      name: 'languages',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'level',
          type: 'select',
          options: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'Native'],
          required: true,
        },
      ],
    },
  ],
}
