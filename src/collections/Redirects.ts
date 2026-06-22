import type { CollectionConfig } from 'payload'

export const Redirects: CollectionConfig = {
  slug: 'redirects',
  admin: {
    useAsTitle: 'from',
    group: 'SEO',
    defaultColumns: ['from', 'to', 'collectionType'],
  },
  access: { read: () => true },
  fields: [
    {
      name: 'from',
      type: 'text',
      required: true,
      index: true,
      admin: { description: 'Old slug that should redirect.' },
    },
    {
      name: 'to',
      type: 'text',
      required: true,
      admin: { description: 'Current slug to redirect to.' },
    },
    {
      name: 'collectionType',
      type: 'select',
      required: true,
      options: [
        { label: 'Project', value: 'project' },
        { label: 'Category', value: 'category' },
      ],
    },
  ],
}
