# Migrating: Neon (free) + local media → Dokploy Postgres + RustFS

Runbook for the cutover described in [docs/adr/0001-self-hosted-postgres-and-blob-storage.md](../adr/0001-self-hosted-postgres-and-blob-storage.md). The site is live, so this is a short, deliberate maintenance window, not a big-bang switch.

## Dry run first (recommended)

Rehearse this entire runbook in an isolated Dokploy project before doing it against production — `pg_dump` is read-only against Neon, so this carries zero risk to the live site, and it surfaces restore/schema/media issues while the stakes are zero.

1. **Create a new, separate Dokploy Project** (e.g. `clara-folio-migration-test`), independent of whatever project holds production. Isolation means teardown is a single "delete project" action afterward.
2. **Provision test infra inside it**: a Postgres database resource, and a new RustFS bucket (e.g. `media-test`, public read) — reuse the same physical RustFS server, no need for a second one.
3. **Create a test Application** in that project pointing at this repo on the `feat/migrate-cloud-db` branch, with its own domain (Dokploy's auto-generated one is fine) and a fresh `PAYLOAD_SECRET` (never reuse the production secret).
4. **Dump/restore**: run steps 3.2–3.3 below against the test Postgres instead of the real one.
5. **Migrate media**: run `src/scripts/migrate-media-to-s3.ts` with `S3_*` pointed at the `media-test` bucket.
6. **Deploy the test app**, log into its admin panel, confirm images render from the test bucket's public URL and a `payload migrate:status` is clean.
7. Once satisfied, delete the test project. Anything that broke here is exactly what to fix before running the real cutover below.

## 0. Pre-checks (do these before touching anything)

- [ ] Confirm in the Dokploy dashboard (App → Advanced → Volumes/Mounts) whether the current app deployment has a persistent volume mounted over the media path. If not, any admin-panel upload made since the last redeploy only exists in that container's writable layer — note down (screenshot) what's currently live in the admin panel's Media list so you can tell if anything's missing after migration.
- [ ] Have the current `DATABASE_URL` (Neon) and admin credentials on hand.
- [ ] Pick an off-peak window (a few minutes of downtime).

## 1. Provision the new infrastructure (no downtime yet)

1. In Dokploy, create a **Postgres** database resource (Databases → Postgres). Note the internal connection string.
2. In RustFS, create a new bucket named `media` (separate from whatever bucket your existing backups use) with a **public read** policy, and expose it on its own public hostname/domain in Dokploy.
3. Generate an access key/secret scoped to that bucket if RustFS supports scoping; otherwise reuse your existing RustFS credentials.
4. Fill in `S3_BUCKET`, `S3_REGION`, `S3_ENDPOINT`, `S3_PUBLIC_URL`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY` for the Dokploy app (don't redeploy yet).

## 2. Migrate media (no downtime, can happen anytime before cutover)

Media migration is independent of the DB cutover — the file bytes don't change based on which Postgres is live.

1. Pull the current production `./media` directory onto the machine you'll run the migration from (rsync/scp from the Dokploy volume, or your local checkout if it's already current — see pre-check above for whether local is actually in sync with prod).
2. With `S3_*` env vars pointed at the new RustFS bucket, run:
   ```
   pnpm payload run src/scripts/migrate-media-to-s3.ts
   ```
3. Confirm the script reports all Media docs accounted for (it cross-checks every `filename` in the `media` collection against what's on disk/uploaded — any gap is printed and the script exits non-zero).
4. Spot-check a few uploaded files load at `S3_PUBLIC_URL/<filename>` in a browser.

## 3. Cut over the database (the actual downtime window)

1. Put the site in maintenance mode / accept a few minutes of downtime.
2. Dump Neon:
   ```
   pg_dump -Fc --no-owner --no-acl "$NEON_DATABASE_URL" -f backup.dump
   ```
3. Restore into the new Dokploy Postgres:
   ```
   pg_restore --clean --if-exists --no-owner --no-acl -d "$DOKPLOY_DATABASE_URL" backup.dump
   ```
4. Update the Dokploy app's env vars: `DATABASE_URL` → the Dokploy Postgres connection string, plus the `S3_*` vars from step 1.
5. Redeploy the app (this also picks up the code in this branch — the S3 storage plugin, updated Dockerfile, etc.).
6. Verify:
   - Admin panel loads and login works.
   - A handful of Project/Media pages render images correctly (served from `S3_PUBLIC_URL`, not `/api/media/file/...`).
   - `payload_migrations` table came across intact (`payload migrate:status` should show nothing pending beyond what was pending before the dump).
7. End maintenance mode.

## 4. Backups

Configure Dokploy's scheduled backup for the new Postgres database to land in your RustFS backups bucket (the one media deliberately does **not** share — see the ADR). Do this in the same session as the cutover, not as a follow-up.

## 5. Rollback plan

If something's wrong post-cutover: revert the app's env vars to the Neon `DATABASE_URL` and previous storage config, and redeploy. This is why Neon is kept dormant (no writes, but not deleted) for 1–2 weeks after cutover — it's a live rollback target, not just a backup file.

## 6. Cleanup (1–2 weeks after cutover, once confident)

- [ ] Delete the Neon project.
- [ ] Confirm the old local `./media` directory (now untracked from git, see `.gitignore`) is no longer needed and can be removed from any server it's still sitting on.
