import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Add slug to projects
  await db.execute(sql`
    ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "slug" varchar;
    CREATE UNIQUE INDEX IF NOT EXISTS "projects_slug_idx" ON "projects" USING btree ("slug");
  `)

  // Add slug to categories
  await db.execute(sql`
    ALTER TABLE "categories" ADD COLUMN IF NOT EXISTS "slug" varchar;
    CREATE UNIQUE INDEX IF NOT EXISTS "categories_slug_idx" ON "categories" USING btree ("slug");
  `)

  // Create redirects table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "redirects" (
      "id" serial PRIMARY KEY NOT NULL,
      "from" varchar NOT NULL,
      "to" varchar NOT NULL,
      "collection_type" varchar NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "redirects_from_idx" ON "redirects" USING btree ("from");
    CREATE INDEX IF NOT EXISTS "redirects_created_at_idx" ON "redirects" USING btree ("created_at");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP TABLE IF EXISTS "redirects" CASCADE;`)
  await db.execute(sql`DROP INDEX IF EXISTS "projects_slug_idx";`)
  await db.execute(sql`ALTER TABLE "projects" DROP COLUMN IF EXISTS "slug";`)
  await db.execute(sql`DROP INDEX IF EXISTS "categories_slug_idx";`)
  await db.execute(sql`ALTER TABLE "categories" DROP COLUMN IF EXISTS "slug";`)
}
