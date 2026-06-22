import type { BasePayload } from 'payload'

type CollectionType = 'project' | 'category'

/**
 * Called after a slug rename. Maintains a redirect table so old URLs keep
 * working. Handles the tricky case where the new slug was previously a
 * redirect source (it must be removed to avoid looping).
 *
 * Rules applied:
 *  1. Delete any redirect where from=newSlug (URL is now canonical again)
 *  2. Update any redirect where to=oldSlug → to=newSlug (fix stale chains)
 *  3. Upsert redirect from=oldSlug, to=newSlug
 */
export async function syncSlugRedirects(
  payload: BasePayload,
  collectionType: CollectionType,
  oldSlug: string,
  newSlug: string,
): Promise<void> {
  const typeFilter = { collectionType: { equals: collectionType } }

  // 1. Delete redirects that used newSlug as a source (now it's a live URL)
  const conflicting = await payload.find({
    collection: 'redirects',
    where: { and: [{ from: { equals: newSlug } }, typeFilter] },
    limit: 100,
    depth: 0,
  })
  await Promise.all(conflicting.docs.map((r) => payload.delete({ collection: 'redirects', id: r.id })))

  // 2. Update stale chains: anything pointing to oldSlug should now point to newSlug
  const stale = await payload.find({
    collection: 'redirects',
    where: { and: [{ to: { equals: oldSlug } }, typeFilter] },
    limit: 100,
    depth: 0,
  })
  await Promise.all(
    stale.docs.map((r) => payload.update({ collection: 'redirects', id: r.id, data: { to: newSlug } })),
  )

  // 3. Upsert redirect from=oldSlug → to=newSlug
  const existing = await payload.find({
    collection: 'redirects',
    where: { and: [{ from: { equals: oldSlug } }, typeFilter] },
    limit: 1,
    depth: 0,
  })
  if (existing.docs[0]) {
    await payload.update({ collection: 'redirects', id: existing.docs[0].id, data: { to: newSlug } })
  } else {
    await payload.create({ collection: 'redirects', data: { from: oldSlug, to: newSlug, collectionType } })
  }
}
