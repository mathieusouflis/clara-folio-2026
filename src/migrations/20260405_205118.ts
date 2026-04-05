import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // DB was already populated before migrations were set up — this is a no-op baseline.
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "projects_content" CASCADE;
  DROP TABLE "projects" CASCADE;
  DROP TABLE "projects_rels" CASCADE;
  DROP TABLE "categories" CASCADE;
  DROP TABLE "categories_rels" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "about_experiences" CASCADE;
  DROP TABLE "about_education" CASCADE;
  DROP TABLE "about_hard_skills_categories_hard_skills" CASCADE;
  DROP TABLE "about_hard_skills_categories" CASCADE;
  DROP TABLE "about_soft_skills" CASCADE;
  DROP TABLE "about_languages" CASCADE;
  DROP TABLE "about" CASCADE;
  DROP TYPE "public"."enum_about_languages_level";`)
}
