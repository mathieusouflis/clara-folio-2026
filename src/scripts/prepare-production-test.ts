import { postgresAdapter, sql } from '@payloadcms/db-postgres'
import { getPayload } from 'payload'
import config from '../payload.config.js'
import { migrations } from '../migrations/index.js'

const databaseURL = new URL(process.env.DATABASE_URL || '')
if (
  !['localhost', '127.0.0.1', '[::1]'].includes(databaseURL.hostname) ||
  !databaseURL.pathname.endsWith('_test')
) {
  throw new Error('Production test fixtures require a local database whose name ends in _test.')
}

const payloadConfig = await config
const adapter = postgresAdapter({
  pool: { connectionString: databaseURL.toString() },
  push: false,
  prodMigrations: [],
})
const payload = await getPayload({
  config: {
    ...payloadConfig,
    db: {
      ...adapter,
      name: adapter.name ?? 'postgres',
      allowIDOnCreate: adapter.allowIDOnCreate ?? false,
    },
  },
})

try {
  const { drizzle: db } = payload.db
  // SQL fixtures avoid upload network calls and Next cache/translation hooks.
  // A showcased project makes the homepage populate a real media relationship.
  await db.execute(sql`
    WITH image AS (
      INSERT INTO media (alt, filename, mime_type, width, height, url)
      VALUES ('Homepage smoke image', 'homepage-smoke.webp', 'image/webp', 100, 100,
        'http://localhost:3000/homepage-smoke.webp')
      RETURNING id
    ), project AS (
      INSERT INTO projects (slug, image_id)
      SELECT 'homepage-smoke-project', id FROM image
      RETURNING id
    ), project_locale AS (
      INSERT INTO projects_locales (name, _locale, _parent_id)
      SELECT 'Homepage smoke project', 'en', id FROM project
    ), category AS (
      INSERT INTO categories (slug, priority, project_count)
      VALUES ('homepage-smoke-category', 0, 1)
      RETURNING id
    ), category_locale AS (
      INSERT INTO categories_locales (category_name, _locale, _parent_id)
      SELECT 'Homepage smoke category', 'en', id FROM category
    )
    INSERT INTO categories_rels ("order", parent_id, path, projects_id)
    SELECT 1, category.id, 'showcasedProjects', project.id FROM category, project;
  `)

  // Recreate the already-deployed schema, rather than allowing development
  // schema push to repair it and conceal a broken production migration.
  await db.execute(sql`
    ALTER TABLE media ADD COLUMN IF NOT EXISTS "_object_key" varchar;
    ALTER TABLE media DROP COLUMN IF EXISTS "_objectkey";
    DELETE FROM payload_migrations WHERE batch = -1;
  `)
  for (const migration of migrations) {
    if (migration.name === '20261120_fix_media_object_key') continue
    await db.execute(sql`
      INSERT INTO payload_migrations (name, batch)
      SELECT ${migration.name}, 1
      WHERE NOT EXISTS (SELECT 1 FROM payload_migrations WHERE name = ${migration.name});
    `)
  }
  await db.execute(sql`
    DELETE FROM payload_migrations WHERE name = '20261120_fix_media_object_key';
  `)
} finally {
  await payload.db.destroy?.()
}
