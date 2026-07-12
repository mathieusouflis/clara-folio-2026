import { getPayload } from 'payload'
import config from '../payload.config.js'

/**
 * Creates the database schema by booting Payload outside production, where the
 * postgres adapter pushes the schema on init.
 *
 * CI needs this because the migration chain cannot build a database from
 * scratch: the 20260405_205118 baseline is a no-op (the DB it was generated
 * against already existed), so `payload migrate` on an empty database fails.
 */
const payload = await getPayload({ config })

await payload.db.destroy?.()
process.exit(0)
