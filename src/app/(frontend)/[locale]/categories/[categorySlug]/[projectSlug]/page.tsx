import { permanentRedirect } from 'next/navigation'
import type { Metadata } from 'next'

// This route exists only to catch old /categories/:cat/:project URLs.
// The next.config redirect handles most cases; this is a safety net.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ categorySlug: string; projectSlug: string }>
}): Promise<Metadata> {
  const { projectSlug } = await params
  return { alternates: { canonical: `/projects/${projectSlug}` } }
}

export default async function Page({
  params,
}: {
  params: Promise<{ categorySlug: string; projectSlug: string }>
}) {
  const { projectSlug } = await params
  permanentRedirect(`/projects/${projectSlug}`)
}
