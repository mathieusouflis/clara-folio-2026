import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE "projects_content_content_description" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "text" varchar NOT NULL
    );

    ALTER TABLE "projects_content_content_description"
      ADD CONSTRAINT "projects_content_content_description_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_content"("id")
      ON DELETE cascade ON UPDATE no action;

    CREATE INDEX "projects_content_content_description_order_idx"
      ON "projects_content_content_description" USING btree ("_order");
    CREATE INDEX "projects_content_content_description_parent_id_idx"
      ON "projects_content_content_description" USING btree ("_parent_id");

    INSERT INTO "projects_content_content_description" ("_order", "_parent_id", "id", "text")
    SELECT 1, "id", gen_random_uuid()::varchar, "content_description"
    FROM "projects_content"
    WHERE "content_description" IS NOT NULL AND "content_description" != '';

    ALTER TABLE "projects_content" DROP COLUMN IF EXISTS "content_description";
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "projects_content" ADD COLUMN "content_description" varchar NOT NULL DEFAULT '';

    DROP TABLE "projects_content_content_description" CASCADE;
  `)
}
