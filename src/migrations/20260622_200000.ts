import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "categories"
      ADD COLUMN IF NOT EXISTS "meta_title" varchar,
      ADD COLUMN IF NOT EXISTS "meta_description" varchar,
      ADD COLUMN IF NOT EXISTS "meta_image_id" integer;

    DO $$ BEGIN
      ALTER TABLE "categories"
        ADD CONSTRAINT "categories_meta_image_id_media_id_fk"
        FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE INDEX IF NOT EXISTS "categories_meta_meta_image_idx"
      ON "categories" USING btree ("meta_image_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "categories" DROP CONSTRAINT IF EXISTS "categories_meta_image_id_media_id_fk";
    DROP INDEX IF EXISTS "categories_meta_meta_image_idx";
    ALTER TABLE "categories" DROP COLUMN IF EXISTS "meta_title";
    ALTER TABLE "categories" DROP COLUMN IF EXISTS "meta_description";
    ALTER TABLE "categories" DROP COLUMN IF EXISTS "meta_image_id";
  `)
}
