export function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .normalize('NFD')
      // eslint-disable-next-line no-misleading-character-class
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  )
}

export async function uniqueSlug(
  payload: any,
  collection: string,
  baseSlug: string,
  excludeId?: number,
): Promise<string> {
  let slug = baseSlug
  let counter = 1
  while (true) {
    const where: any = excludeId
      ? { and: [{ slug: { equals: slug } }, { id: { not_equals: excludeId } }] }
      : { slug: { equals: slug } }
    const existing = await payload.find({ collection, where, limit: 1, depth: 0 })
    if (existing.totalDocs === 0) return slug
    counter++
    slug = `${baseSlug}-${counter}`
  }
}
