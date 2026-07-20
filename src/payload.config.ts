import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Projects } from './collections/Projects'
import { Categories } from './collections/Categories'
import { About } from './collections/About'
import { Footer } from './collections/Footer'
import { Services } from './collections/Services'
import { Redirects } from './collections/Redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { s3Storage } from '@payloadcms/storage-s3'
import { SERVER_URL as serverURL } from './lib/server-url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL,
  cors: [serverURL],
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  localization: {
    locales: ['en', 'fr'],
    defaultLocale: 'en',
    fallback: true,
  },
  globals: [About, Footer, Services],
  collections: [Users, Media, Projects, Categories, Redirects],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [
    seoPlugin({
      collections: ['projects'],
      globals: ['about'],
      uploadsCollection: 'media',
      tabbedUI: true,
      generateTitle: ({ doc }) => `Clara Baptista — ${doc.name}`,
      generateDescription: ({ doc }) => doc.description,
      generateURL: ({ doc, collectionConfig }) => {
        const baseURL = 'https://clarabaptista.com'
        if (collectionConfig?.slug === 'projects')
          return `${baseURL}/projects/${doc.slug ?? doc.id}`
        return baseURL
      },
    }),
    s3Storage({
      collections: {
        media: {
          disablePayloadAccessControl: true,
          generateFileURL: ({ filename }) => `${process.env.S3_PUBLIC_URL}/${filename}`,
        },
      },
      bucket: process.env.S3_BUCKET || '',
      config: {
        region: process.env.S3_REGION || 'auto',
        endpoint: process.env.S3_ENDPOINT,
        forcePathStyle: true,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
      },
    }),
  ],
})
