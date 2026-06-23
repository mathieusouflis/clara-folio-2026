import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Services global (localized fields + localized `services` array). Written to
// match exactly what dev `push` created, so prod ends up identical. All guarded
// so it's safe to run even if push already created the tables in a given DB.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  // _locales enum already exists from earlier migrations; guard anyway.
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."_locales" AS ENUM('en', 'fr');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `)

  // Base global table (non-localized fields).
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "services" (
      "id" serial PRIMARY KEY NOT NULL,
      "email" varchar,
      "updated_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone
    );
  `)

  // Localized scalar fields.
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "services_locales" (
      "hero_heading" varchar,
      "hero_subheading" varchar,
      "intro" varchar,
      "cta_heading" varchar,
      "meta_title" varchar,
      "meta_description" varchar,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" integer NOT NULL
    );
  `)

  // Localized `services` array rows.
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "services_services" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_locale" "_locales" NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "title" varchar NOT NULL,
      "description" varchar
    );
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "services_locales"
        ADD CONSTRAINT "services_locales_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "services_services"
        ADD CONSTRAINT "services_services_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `)

  await db.execute(sql`
    CREATE UNIQUE INDEX IF NOT EXISTS "services_locales_locale_parent_id_unique"
      ON "services_locales" USING btree ("_locale", "_parent_id");
  `)
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "services_services_order_idx"
      ON "services_services" USING btree ("_order");
  `)
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "services_services_parent_id_idx"
      ON "services_services" USING btree ("_parent_id");
  `)
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "services_services_locale_idx"
      ON "services_services" USING btree ("_locale");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP TABLE IF EXISTS "services_services" CASCADE;`)
  await db.execute(sql`DROP TABLE IF EXISTS "services_locales" CASCADE;`)
  await db.execute(sql`DROP TABLE IF EXISTS "services" CASCADE;`)
}
