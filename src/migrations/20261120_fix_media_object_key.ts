import { type MigrateDownArgs, type MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Payload maps _objectKey to _objectkey. The preceding migration used
  // _object_key; keep that column and preserve any storage metadata it holds.
  await db.execute(sql`
    ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "_objectkey" varchar;
    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1 FROM pg_attribute
        WHERE attrelid = 'media'::regclass
          AND attname = '_object_key'
          AND NOT attisdropped
      ) THEN
        UPDATE "media"
        SET "_objectkey" = "_object_key"
        WHERE "_objectkey" IS NULL AND "_object_key" IS NOT NULL;
      END IF;
    END $$;
  `)
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // Retain the additive column on rollback so stored object keys cannot be lost.
}
