import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Optional, non-localized caption used for image SEO (schema.org ImageObject).
  await db.execute(sql`
    ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "caption" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "media" DROP COLUMN IF EXISTS "caption";
  `)
}
