import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TYPE "public"."enum_about_languages_level" ADD VALUE 'Native';
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE TABLE IF NOT EXISTS "projects_content_content_description" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "text" varchar NOT NULL
    );

    ALTER TABLE "projects"
      ADD COLUMN IF NOT EXISTS "meta_title" varchar,
      ADD COLUMN IF NOT EXISTS "meta_description" varchar,
      ADD COLUMN IF NOT EXISTS "meta_image_id" integer;

    ALTER TABLE "about"
      ADD COLUMN IF NOT EXISTS "meta_title" varchar,
      ADD COLUMN IF NOT EXISTS "meta_description" varchar,
      ADD COLUMN IF NOT EXISTS "meta_image_id" integer;

    DO $$ BEGIN
      ALTER TABLE "projects_content_content_description"
        ADD CONSTRAINT "projects_content_content_description_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_content"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE INDEX IF NOT EXISTS "projects_content_content_description_order_idx"
      ON "projects_content_content_description" USING btree ("_order");

    CREATE INDEX IF NOT EXISTS "projects_content_content_description_parent_id_idx"
      ON "projects_content_content_description" USING btree ("_parent_id");

    DO $$ BEGIN
      ALTER TABLE "projects"
        ADD CONSTRAINT "projects_meta_image_id_media_id_fk"
        FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "about"
        ADD CONSTRAINT "about_meta_image_id_media_id_fk"
        FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE INDEX IF NOT EXISTS "projects_meta_meta_image_idx"
      ON "projects" USING btree ("meta_image_id");

    CREATE INDEX IF NOT EXISTS "about_meta_meta_image_idx"
      ON "about" USING btree ("meta_image_id");

    ALTER TABLE "projects_content" DROP COLUMN IF EXISTS "content_description";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "projects_content_content_description" CASCADE;
    ALTER TABLE "projects" DROP CONSTRAINT IF EXISTS "projects_meta_image_id_media_id_fk";
    ALTER TABLE "about" DROP CONSTRAINT IF EXISTS "about_meta_image_id_media_id_fk";
    ALTER TABLE "about_languages" ALTER COLUMN "level" SET DATA TYPE text;
    DROP TYPE IF EXISTS "public"."enum_about_languages_level";
    CREATE TYPE "public"."enum_about_languages_level" AS ENUM('A1', 'A2', 'B1', 'B2', 'C1', 'C2');
    ALTER TABLE "about_languages" ALTER COLUMN "level"
      SET DATA TYPE "public"."enum_about_languages_level"
      USING "level"::"public"."enum_about_languages_level";
    DROP INDEX IF EXISTS "projects_meta_meta_image_idx";
    DROP INDEX IF EXISTS "about_meta_meta_image_idx";
    ALTER TABLE "projects" DROP COLUMN IF EXISTS "meta_title";
    ALTER TABLE "projects" DROP COLUMN IF EXISTS "meta_description";
    ALTER TABLE "projects" DROP COLUMN IF EXISTS "meta_image_id";
    ALTER TABLE "about" DROP COLUMN IF EXISTS "meta_title";
    ALTER TABLE "about" DROP COLUMN IF EXISTS "meta_description";
    ALTER TABLE "about" DROP COLUMN IF EXISTS "meta_image_id";
  `)
}
