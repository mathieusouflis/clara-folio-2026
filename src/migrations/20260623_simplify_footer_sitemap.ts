import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "footer_sitemap_links"
      DROP COLUMN IF EXISTS "link_type",
      DROP COLUMN IF EXISTS "internal_page";
  `)

  await db.execute(sql`
    DROP TYPE IF EXISTS "public"."footer_sitemap_links_link_type";
    DROP TYPE IF EXISTS "public"."footer_sitemap_links_internal_page";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."footer_sitemap_links_link_type" AS ENUM('external', 'internal');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."footer_sitemap_links_internal_page" AS ENUM('/', '/categories', '/about');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `)

  await db.execute(sql`
    ALTER TABLE "footer_sitemap_links"
      ADD COLUMN IF NOT EXISTS "link_type" "public"."footer_sitemap_links_link_type" NOT NULL DEFAULT 'external',
      ADD COLUMN IF NOT EXISTS "internal_page" "public"."footer_sitemap_links_internal_page";
  `)
}
