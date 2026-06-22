import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Create _locales enum if not exists
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."_locales" AS ENUM('en', 'fr');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `)

  // Create locale tables
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "projects_content_content_description_locales" (
      "text" varchar NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" varchar NOT NULL
    );
  `)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "projects_content_locales" (
      "title" varchar NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" varchar NOT NULL
    );
  `)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "projects_locales" (
      "name" varchar NOT NULL,
      "description" varchar,
      "meta_title" varchar,
      "meta_description" varchar,
      "meta_image_id" integer,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" integer NOT NULL
    );
  `)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "about_locales" (
      "description" varchar,
      "meta_title" varchar,
      "meta_description" varchar,
      "meta_image_id" integer,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" integer NOT NULL
    );
  `)

  // Drop old FK constraints (may or may not exist)
  await db.execute(sql`
    ALTER TABLE "projects" DROP CONSTRAINT IF EXISTS "projects_meta_image_id_media_id_fk";
    ALTER TABLE "about" DROP CONSTRAINT IF EXISTS "about_meta_image_id_media_id_fk";
  `)

  await db.execute(sql`
    DROP INDEX IF EXISTS "projects_meta_meta_image_idx";
    DROP INDEX IF EXISTS "about_meta_meta_image_idx";
  `)

  // Add FK constraints on locale tables
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "projects_content_content_description_locales"
        ADD CONSTRAINT "projects_content_content_description_locales_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_content_content_description"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "projects_content_locales"
        ADD CONSTRAINT "projects_content_locales_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_content"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "projects_locales"
        ADD CONSTRAINT "projects_locales_meta_image_id_media_id_fk"
        FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "projects_locales"
        ADD CONSTRAINT "projects_locales_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "about_locales"
        ADD CONSTRAINT "about_locales_meta_image_id_media_id_fk"
        FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "about_locales"
        ADD CONSTRAINT "about_locales_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `)

  await db.execute(sql`
    CREATE UNIQUE INDEX IF NOT EXISTS "projects_content_content_description_locales_locale_parent_i"
      ON "projects_content_content_description_locales" USING btree ("_locale","_parent_id");
    CREATE UNIQUE INDEX IF NOT EXISTS "projects_content_locales_locale_parent_id_unique"
      ON "projects_content_locales" USING btree ("_locale","_parent_id");
    CREATE INDEX IF NOT EXISTS "projects_meta_meta_image_idx"
      ON "projects_locales" USING btree ("meta_image_id","_locale");
    CREATE UNIQUE INDEX IF NOT EXISTS "projects_locales_locale_parent_id_unique"
      ON "projects_locales" USING btree ("_locale","_parent_id");
    CREATE INDEX IF NOT EXISTS "about_meta_meta_image_idx"
      ON "about_locales" USING btree ("meta_image_id","_locale");
    CREATE UNIQUE INDEX IF NOT EXISTS "about_locales_locale_parent_id_unique"
      ON "about_locales" USING btree ("_locale","_parent_id");
  `)

  // Migrate existing English data into locale tables before dropping old columns.
  // Each block checks that the source column still exists (safe for re-runs where
  // dev-mode already dropped them).
  await db.execute(sql`
    DO $$ BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'projects' AND column_name = 'name'
      ) THEN
        INSERT INTO "projects_locales" ("name", "description", "meta_title", "meta_description", "meta_image_id", "_locale", "_parent_id")
        SELECT
          COALESCE("name", ''),
          "description",
          "meta_title",
          "meta_description",
          "meta_image_id",
          'en',
          "id"
        FROM "projects"
        ON CONFLICT ("_locale", "_parent_id") DO NOTHING;
      END IF;
    END $$;

    DO $$ BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'projects_content' AND column_name = 'title'
      ) THEN
        INSERT INTO "projects_content_locales" ("title", "_locale", "_parent_id")
        SELECT COALESCE("title", ''), 'en', "id"
        FROM "projects_content"
        ON CONFLICT ("_locale", "_parent_id") DO NOTHING;
      END IF;
    END $$;

    DO $$ BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'projects_content_content_description' AND column_name = 'text'
      ) THEN
        INSERT INTO "projects_content_content_description_locales" ("text", "_locale", "_parent_id")
        SELECT COALESCE("text", ''), 'en', "id"
        FROM "projects_content_content_description"
        ON CONFLICT ("_locale", "_parent_id") DO NOTHING;
      END IF;
    END $$;

    DO $$ BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'about' AND column_name = 'description'
      ) THEN
        INSERT INTO "about_locales" ("description", "meta_title", "meta_description", "meta_image_id", "_locale", "_parent_id")
        SELECT "description", "meta_title", "meta_description", "meta_image_id", 'en', "id"
        FROM "about"
        ON CONFLICT ("_locale", "_parent_id") DO NOTHING;
      END IF;
    END $$;
  `)

  // Drop old non-locale columns (IF EXISTS handles dev-mode pre-push)
  await db.execute(sql`
    ALTER TABLE "projects_content_content_description" DROP COLUMN IF EXISTS "text";
    ALTER TABLE "projects_content" DROP COLUMN IF EXISTS "title";
    ALTER TABLE "projects" DROP COLUMN IF EXISTS "name";
    ALTER TABLE "projects" DROP COLUMN IF EXISTS "description";
    ALTER TABLE "projects" DROP COLUMN IF EXISTS "meta_title";
    ALTER TABLE "projects" DROP COLUMN IF EXISTS "meta_description";
    ALTER TABLE "projects" DROP COLUMN IF EXISTS "meta_image_id";
    ALTER TABLE "about" DROP COLUMN IF EXISTS "description";
    ALTER TABLE "about" DROP COLUMN IF EXISTS "meta_title";
    ALTER TABLE "about" DROP COLUMN IF EXISTS "meta_description";
    ALTER TABLE "about" DROP COLUMN IF EXISTS "meta_image_id";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "projects_content_content_description_locales" CASCADE;
    DROP TABLE IF EXISTS "projects_content_locales" CASCADE;
    DROP TABLE IF EXISTS "projects_locales" CASCADE;
    DROP TABLE IF EXISTS "about_locales" CASCADE;
    ALTER TABLE "projects_content_content_description" ADD COLUMN IF NOT EXISTS "text" varchar NOT NULL DEFAULT '';
    ALTER TABLE "projects_content" ADD COLUMN IF NOT EXISTS "title" varchar NOT NULL DEFAULT '';
    ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "name" varchar NOT NULL DEFAULT '';
    ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "description" varchar;
    ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "meta_title" varchar;
    ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "meta_description" varchar;
    ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "meta_image_id" integer;
    ALTER TABLE "about" ADD COLUMN IF NOT EXISTS "description" varchar;
    ALTER TABLE "about" ADD COLUMN IF NOT EXISTS "meta_title" varchar;
    ALTER TABLE "about" ADD COLUMN IF NOT EXISTS "meta_description" varchar;
    ALTER TABLE "about" ADD COLUMN IF NOT EXISTS "meta_image_id" integer;
    DO $$ BEGIN
      ALTER TABLE "projects" ADD CONSTRAINT "projects_meta_image_id_media_id_fk"
        FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    DO $$ BEGIN
      ALTER TABLE "about" ADD CONSTRAINT "about_meta_image_id_media_id_fk"
        FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    CREATE INDEX IF NOT EXISTS "projects_meta_meta_image_idx" ON "projects" USING btree ("meta_image_id");
    CREATE INDEX IF NOT EXISTS "about_meta_meta_image_idx" ON "about" USING btree ("meta_image_id");
    DROP TYPE IF EXISTS "public"."_locales";
  `)
}
