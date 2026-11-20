import { randomUUID } from 'node:crypto'
import { postgresAdapter, type PostgresAdapter, sql } from '@payloadcms/db-postgres'
import { getTableColumns } from '@payloadcms/db-postgres/drizzle'
import type { PgTable } from '@payloadcms/db-postgres/drizzle/pg-core'
import { createLocalReq, getPayload, type Payload } from 'payload'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'

import config from '@/payload.config'
import { down, up } from '@/migrations/20261120_fix_media_object_key'

const schemaName = `media_migration_${randomUUID().replaceAll('-', '')}`
let payload: Payload
let db: Pick<PostgresAdapter, 'drizzle' | 'tables'>

describe('media object-key production migration', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    const adapter = postgresAdapter({
      pool: {
        connectionString: process.env.DATABASE_URL,
        options: `-c search_path=${schemaName}`,
      },
      schemaName,
      // Match production: initialization must not repair missing columns.
      push: false,
      prodMigrations: [],
    })
    payload = await getPayload({
      key: schemaName,
      config: {
        ...payloadConfig,
        db: {
          ...adapter,
          name: adapter.name ?? 'postgres',
          allowIDOnCreate: adapter.allowIDOnCreate ?? false,
        },
      },
    })
    db = payload.db
    await db.drizzle.execute(sql`CREATE SCHEMA ${sql.identifier(schemaName)}`)
  })

  beforeEach(async () => {
    // Derive the other columns from Payload's real schema, leaving only the
    // incorrect column supplied by the previously deployed migration.
    const columns = getTableColumns(db.tables.media as PgTable)
    expect(columns._objectKey.name).toBe('_objectkey')
    const definitions = Object.values(columns)
      .filter((column) => column.name !== '_objectkey')
      .map((column) => sql`${sql.identifier(column.name)} ${sql.raw(column.getSQLType())}`)

    await db.drizzle.execute(sql`DROP TABLE IF EXISTS "media"`)
    await db.drizzle.execute(sql`
      CREATE TABLE "media" (${sql.join(definitions, sql`, `)}, "_object_key" varchar)
    `)
    await db.drizzle.execute(sql`
      INSERT INTO "media" ("id", "alt", "filename", "_object_key", "created_at", "updated_at")
      VALUES (1, 'Preserved media', 'preserved.webp', 'legacy-storage-key', now(), now())
    `)
  })

  afterAll(async () => {
    if (db) {
      await db.drizzle.execute(sql`DROP SCHEMA IF EXISTS ${sql.identifier(schemaName)} CASCADE`)
    }
    await payload?.destroy()
  })

  const migrate = async () => {
    const req = await createLocalReq({}, payload)
    await up({ db: db.drizzle, payload, req })
  }

  const findMedia = () =>
    payload.find({ collection: 'media', depth: 0, pagination: false, sort: 'id' })

  it('repairs an actual Payload media query without schema push and preserves the storage key', async () => {
    await expect(findMedia()).rejects.toMatchObject({ cause: { code: '42703' } })

    await migrate()
    await migrate()

    const media = await findMedia()
    expect(media.docs).toHaveLength(1)
    expect(media.docs[0]).toMatchObject({
      id: 1,
      alt: 'Preserved media',
      filename: 'preserved.webp',
      _objectKey: 'legacy-storage-key',
    })
  })

  it('keeps an existing canonical key and retains both columns on rollback', async () => {
    await migrate()
    await db.drizzle.execute(sql`
      UPDATE "media" SET "_objectkey" = 'canonical-storage-key'
    `)
    await migrate()
    await down({ db: db.drizzle, payload, req: await createLocalReq({}, payload) })

    const media = await findMedia()
    expect(media.docs[0]._objectKey).toBe('canonical-storage-key')
    const stored = await db.drizzle.execute(sql`
      SELECT "_objectkey", "_object_key" FROM "media" WHERE "id" = 1
    `)
    expect(stored.rows).toEqual([
      { _objectkey: 'canonical-storage-key', _object_key: 'legacy-storage-key' },
    ])
  })

  it('accepts a development-pushed schema that has only the canonical column', async () => {
    await db.drizzle.execute(sql`
      ALTER TABLE "media" RENAME COLUMN "_object_key" TO "_objectkey"
    `)
    await migrate()

    const media = await findMedia()
    expect(media.docs[0]._objectKey).toBe('legacy-storage-key')
  })

  it('adds the canonical column when neither column exists', async () => {
    await db.drizzle.execute(sql`ALTER TABLE "media" DROP COLUMN "_object_key"`)
    await migrate()

    const media = await findMedia()
    expect(media.docs[0]).toMatchObject({ id: 1, filename: 'preserved.webp', _objectKey: null })
  })
})
