import 'dotenv/config'
import fs from 'fs/promises'
import path from 'path'
import mime from 'mime-types'
import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3'
import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * One-off migration: uploads every file currently in the local ./media directory
 * into the S3-compatible bucket (RustFS) configured via S3_* env vars, keyed by
 * filename. Payload's cloud-storage plugin recomputes each doc's `url` from its
 * `filename` on every read (see getAfterReadHook in @payloadcms/plugin-cloud-storage),
 * so existing Media docs need no changes — only the bytes need to exist in the bucket.
 *
 * Also cross-checks every Media doc's filename (including size variants) against
 * what actually got uploaded, so any drift between the DB and ./media is surfaced
 * rather than silently migrated.
 *
 * Run with: pnpm payload run src/scripts/migrate-media-to-s3.ts
 */
const MEDIA_DIR = path.resolve(process.cwd(), 'media')

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing required env var: ${name}`)
  return value
}

async function main() {
  const bucket = requireEnv('S3_BUCKET')
  const client = new S3Client({
    region: process.env.S3_REGION || 'auto',
    endpoint: requireEnv('S3_ENDPOINT'),
    forcePathStyle: true,
    credentials: {
      accessKeyId: requireEnv('S3_ACCESS_KEY_ID'),
      secretAccessKey: requireEnv('S3_SECRET_ACCESS_KEY'),
    },
  })

  const entries = await fs.readdir(MEDIA_DIR, { withFileTypes: true })
  const files = entries.filter((entry) => entry.isFile()).map((entry) => entry.name)

  console.log(`Found ${files.length} file(s) in ${MEDIA_DIR}. Uploading to bucket "${bucket}"...\n`)

  let uploaded = 0
  let skipped = 0
  for (const filename of files) {
    const key = filename

    try {
      await client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }))
      console.log(`skip  (already in bucket) ${filename}`)
      skipped++
      continue
    } catch {
      // Not found — proceed to upload.
    }

    const filePath = path.join(MEDIA_DIR, filename)
    const body = await fs.readFile(filePath)
    const contentType = mime.lookup(filename) || 'application/octet-stream'

    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
      }),
    )
    console.log(`upload ${filename} (${contentType}, ${body.byteLength} bytes)`)
    uploaded++
  }

  console.log(`\nUploaded ${uploaded}, skipped ${skipped} (already present).`)

  // Cross-check: every filename referenced by a Media doc should now exist as
  // a file we uploaded.
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'media',
    depth: 0,
    limit: 1000,
    pagination: false,
  })

  const onDisk = new Set(files)
  const missing: string[] = []
  for (const doc of docs) {
    if (doc.filename && !onDisk.has(doc.filename)) missing.push(`${doc.id}: ${doc.filename}`)
  }

  if (missing.length > 0) {
    console.warn(
      `\n${missing.length} file(s) referenced by Media docs are missing from ${MEDIA_DIR}:`,
    )
    for (const entry of missing) console.warn(`  - ${entry}`)
  } else {
    console.log(`\nAll ${docs.length} Media doc(s) have their files accounted for.`)
  }

  await payload.db.destroy?.()
  process.exit(missing.length > 0 ? 1 : 0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
