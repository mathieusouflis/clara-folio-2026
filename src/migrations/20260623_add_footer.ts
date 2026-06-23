import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Enums for footer sitemap links
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

  // Main footer global table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "footer" (
      "id" serial PRIMARY KEY NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
  `)

  // Sitemap links array
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "footer_sitemap_links" (
      "id" varchar PRIMARY KEY NOT NULL,
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "label" varchar NOT NULL,
      "link_type" "public"."footer_sitemap_links_link_type" NOT NULL DEFAULT 'external',
      "url" varchar,
      "internal_page" "public"."footer_sitemap_links_internal_page"
    );
  `)

  // Social links array
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "footer_social_links" (
      "id" varchar PRIMARY KEY NOT NULL,
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "label" varchar NOT NULL,
      "url" varchar NOT NULL
    );
  `)

  // FK constraints
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "footer_sitemap_links"
        ADD CONSTRAINT "footer_sitemap_links_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "footer_social_links"
        ADD CONSTRAINT "footer_social_links_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `)

  // Indexes
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "footer_sitemap_links_order_idx"
      ON "footer_sitemap_links" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "footer_sitemap_links_parent_id_idx"
      ON "footer_sitemap_links" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "footer_social_links_order_idx"
      ON "footer_social_links" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "footer_social_links_parent_id_idx"
      ON "footer_social_links" USING btree ("_parent_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "footer_sitemap_links" CASCADE;
    DROP TABLE IF EXISTS "footer_social_links" CASCADE;
    DROP TABLE IF EXISTS "footer" CASCADE;
    DROP TYPE IF EXISTS "public"."footer_sitemap_links_link_type";
    DROP TYPE IF EXISTS "public"."footer_sitemap_links_internal_page";
  `)
}
