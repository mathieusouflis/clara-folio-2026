# Self-hosted Postgres and blob storage on Dokploy

We were on Neon's free-tier Postgres and storing uploaded media on local disk (in production, uploads live inside the app container and are one redeploy away from being lost; historically, media was also committed to git). We're moving both off free/ad-hoc infrastructure onto Dokploy, which we already run for backups (RustFS, an S3-compatible object store).

## Decisions

- **Topology**: Postgres and blob storage are provisioned as independent Dokploy resources (a managed "Database" and an S3 bucket), not bundled into the app's docker-compose. The app keeps deploying via its own Dockerfile. This means an app redeploy can never restart or affect the database/storage containers. `docker-compose.yml` in this repo is local-dev-only — it mirrors the production services (Postgres + RustFS) so development happens against the real thing, but is not what Dokploy deploys.
- **Blob storage backend**: RustFS, since we already run it on Dokploy for backups. Media gets its **own dedicated bucket**, separate from the backups bucket — different lifecycle (backups get pruned, media shouldn't) and different access policy (media needs public read; backups must stay private). Files are served via **direct public bucket URLs**, not proxied through the Payload/Next.js server, since the `media` collection is already world-readable (`read: () => true`) and proxying would add a needless hop.
- **Postgres provisioning**: Dokploy's managed "Databases → Postgres" resource, not a hand-rolled container. It gives us the container, volume, and connection string, and lets us schedule automatic backups straight to the RustFS bucket we already operate — closing the backup gap immediately rather than as a follow-up.
- **Git-tracked media**: stopped. The bucket is now the single source of truth for uploads; the repo's `media/` directory is untracked going forward (history is left intact, no rewrite).
- **Cutover**: `pg_dump`/`pg_restore` with a short off-peak maintenance window (not logical replication — not worth the operational complexity for a low-traffic site). Neon is kept dormant for 1–2 weeks post-cutover as a rollback safety net before deletion.

## Considered and rejected

- **Cloudflare R2** instead of RustFS — would have meant running two storage backends (RustFS for backups, R2 for media) instead of reusing infrastructure we already operate.
- **One combined docker-compose stack** (app + Postgres + storage) deployed as a single Dokploy Compose project — rejected because a redeploy of the app would risk restarting/recreating the data services alongside it.
- **Proxying media through Payload** instead of direct bucket URLs — rejected as unnecessary overhead given media has no access control to enforce.
