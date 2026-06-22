import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Remove direct columns added by the previous migration (wrong approach)
  await db.execute(sql`
    ALTER TABLE "categories" DROP CONSTRAINT IF EXISTS "categories_meta_image_id_media_id_fk";
    DROP INDEX IF EXISTS "categories_meta_meta_image_idx";
    ALTER TABLE "categories" DROP COLUMN IF EXISTS "meta_title";
    ALTER TABLE "categories" DROP COLUMN IF EXISTS "meta_description";
    ALTER TABLE "categories" DROP COLUMN IF EXISTS "meta_image_id";
  `)

  // Create categories_locales table (meta fields are localized because global
  // localization is enabled — Payload stores them in a separate locales table)
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "categories_locales" (
      "meta_title" varchar,
      "meta_description" varchar,
      "meta_image_id" integer,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" integer NOT NULL
    );
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "categories_locales"
        ADD CONSTRAINT "categories_locales_meta_image_id_media_id_fk"
        FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "categories_locales"
        ADD CONSTRAINT "categories_locales_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."categories"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "categories_meta_meta_image_idx"
      ON "categories_locales" USING btree ("meta_image_id", "_locale");
    CREATE UNIQUE INDEX IF NOT EXISTS "categories_locales_locale_parent_id_unique"
      ON "categories_locales" USING btree ("_locale", "_parent_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "categories_locales" CASCADE;
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
