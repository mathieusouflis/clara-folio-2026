import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'caption',
      type: 'text',
      admin: {
        description:
          'Optional descriptive caption shown near the image and used in image SEO (schema.org ImageObject).',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        const ext = /\.(png|jpe?g|gif|tiff?|bmp)$/i
        if (data.filename && typeof data.filename === 'string') {
          data.filename = data.filename.replace(ext, '.webp')
        }
        if (data.url && typeof data.url === 'string') {
          data.url = data.url.replace(ext, '.webp')
        }
        if (data.mimeType) {
          data.mimeType = 'image/webp'
        }
        return data
      },
    ],
  },
  upload: {
    resizeOptions: {
      width: 2000,
      height: 2000,
      fit: 'inside',
      withoutEnlargement: true,
    },
    formatOptions: {
      format: 'webp',
      options: {
        quality: 82,
      },
    },
  },
}
