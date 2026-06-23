import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // _locales enum already exists (created by 20260622_172215), guard anyway.
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."_locales" AS ENUM('en', 'fr');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `)

  // Locale table for the now-localized categories.category_name
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "categories_locales" (
      "category_name" varchar NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" integer NOT NULL
    );
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
    CREATE UNIQUE INDEX IF NOT EXISTS "categories_locales_locale_parent_id_unique"
      ON "categories_locales" USING btree ("_locale","_parent_id");
  `)

  // Copy existing category names into the English locale before dropping the
  // old column. Guarded so it's safe if dev-mode push already moved the column.
  await db.execute(sql`
    DO $$ BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'categories' AND column_name = 'category_name'
      ) THEN
        INSERT INTO "categories_locales" ("category_name", "_locale", "_parent_id")
        SELECT COALESCE("category_name", ''), 'en', "id"
        FROM "categories"
        ON CONFLICT ("_locale", "_parent_id") DO NOTHING;
      END IF;
    END $$;
  `)

  await db.execute(sql`
    ALTER TABLE "categories" DROP COLUMN IF EXISTS "category_name";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Restore the non-localized column, backfilling from the English locale.
  await db.execute(sql`
    ALTER TABLE "categories" ADD COLUMN IF NOT EXISTS "category_name" varchar NOT NULL DEFAULT '';
  `)

  await db.execute(sql`
    DO $$ BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_name = 'categories_locales'
      ) THEN
        UPDATE "categories" c
        SET "category_name" = COALESCE(cl."category_name", '')
        FROM "categories_locales" cl
        WHERE cl."_parent_id" = c."id" AND cl."_locale" = 'en';
      END IF;
    END $$;
  `)

  await db.execute(sql`
    DROP TABLE IF EXISTS "categories_locales" CASCADE;
  `)
}
