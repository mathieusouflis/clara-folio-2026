# Clara Baptista — Portfolio

A Payload CMS + Next.js site backed by self-hosted Postgres and S3-compatible (RustFS) object storage — see [docs/adr/0001-self-hosted-postgres-and-blob-storage.md](./docs/adr/0001-self-hosted-postgres-and-blob-storage.md) for why.

## Local setup

1. `cp .env.example .env` and fill in `PAYLOAD_SECRET` (the rest of the defaults already match the services below).
2. `docker-compose up -d` to start local Postgres + RustFS (mirrors production; it is **not** what gets deployed — see the ADR).
3. Open `http://localhost:9001` (RustFS console, login with the `S3_ACCESS_KEY_ID`/`S3_SECRET_ACCESS_KEY` from `.env.example`) and create a bucket named `media` with public read access.
4. `pnpm install && pnpm dev`, then open `http://localhost:3000`.

Follow the on-screen instructions to create your first admin user.

## How it works

### Collections

See the [Collections](https://payloadcms.com/docs/configuration/collections) docs for details on how to extend this functionality.

- #### Users (Authentication)

  Users are auth-enabled collections that have access to the admin panel.

  For additional help, see the official [Auth Example](https://github.com/payloadcms/payload/tree/main/examples/auth) or the [Authentication](https://payloadcms.com/docs/authentication/overview#authentication-overview) docs.

- #### Media

  This is the uploads enabled collection. It features pre-configured sizes, focal point and manual resizing to help you manage your pictures. Files live in the `media` bucket (RustFS in prod, via `@payloadcms/storage-s3`); nothing is stored on the app's own filesystem.

## Production

Deployed on Dokploy: the app as its own Dockerfile-based application, Postgres and RustFS as separate managed Dokploy resources. See [docs/migrations/neon-to-dokploy-postgres.md](./docs/migrations/neon-to-dokploy-postgres.md) for the Neon → Dokploy Postgres cutover runbook.

## Questions

If you have any issues or questions, reach out to us on [Discord](https://discord.com/invite/payload) or start a [GitHub discussion](https://github.com/payloadcms/payload/discussions).
