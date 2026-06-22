import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "categories_locales" CASCADE;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "categories_locales" (
      "meta_title" varchar,
      "meta_description" varchar,
      "meta_image_id" integer,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" integer NOT NULL
    );
    DO $$ BEGIN
      ALTER TABLE "categories_locales"
        ADD CONSTRAINT "categories_locales_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."categories"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    CREATE UNIQUE INDEX IF NOT EXISTS "categories_locales_locale_parent_id_unique"
      ON "categories_locales" USING btree ("_locale", "_parent_id");
  `)
}
