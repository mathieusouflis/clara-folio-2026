import { createNavigation } from 'next-intl/navigation'
import { routing } from './routing'

// Locale-aware navigation: Link / useRouter / usePathname automatically keep
// the active locale prefix (no prefix = en, /fr = fr) so navigation never
// silently falls back to the default locale.
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing)
