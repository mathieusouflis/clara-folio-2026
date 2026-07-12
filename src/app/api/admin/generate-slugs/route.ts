import { getPayload } from 'payload'
import config from '@/payload.config'
import { slugify, uniqueSlug } from '@/lib/slug'
import { NextResponse } from 'next/server'
import { timingSafeEqual } from 'crypto'

/** Constant-time comparison that refuses to authorize when the secret is unset. */
function isAuthorized(authHeader: string | null): boolean {
  const secret = process.env.ADMIN_MIGRATE_SECRET
  // Fail closed: without a configured secret the endpoint is never callable
  // (otherwise `Bearer undefined` would authenticate).
  if (!secret) return false
  if (!authHeader) return false
  const expected = Buffer.from(`Bearer ${secret}`)
  const provided = Buffer.from(authHeader)
  if (expected.length !== provided.length) return false
  return timingSafeEqual(expected, provided)
}

// One-time migration: generate slugs for all projects and categories that lack one.
// Hit POST /api/admin/generate-slugs (admin only).
export async function POST(request: Request) {
  if (!isAuthorized(request.headers.get('authorization'))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const results = { projects: 0, categories: 0, errors: [] as string[] }

  // --- Projects ---
  const projects = await payload.find({ collection: 'projects', limit: 1000, depth: 0 })
  for (const project of projects.docs) {
    if (project.slug) continue
    try {
      const base = slugify(project.name ?? String(project.id))
      const slug = await uniqueSlug(payload, 'projects', base, project.id)
      await payload.update({ collection: 'projects', id: project.id, data: { slug } })
      results.projects++
    } catch (err) {
      results.errors.push(`project ${project.id}: ${err}`)
    }
  }

  // --- Categories ---
  const categories = await payload.find({ collection: 'categories', limit: 1000, depth: 0 })
  for (const category of categories.docs) {
    if (category.slug) continue
    try {
      const base = slugify(category.categoryName ?? String(category.id))
      const slug = await uniqueSlug(payload, 'categories', base, category.id)
      await payload.update({ collection: 'categories', id: category.id, data: { slug } })
      results.categories++
    } catch (err) {
      results.errors.push(`category ${category.id}: ${err}`)
    }
  }

  return NextResponse.json(results)
}
