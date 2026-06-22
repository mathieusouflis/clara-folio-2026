import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  matcher: [
    // Enable locale routing for all frontend paths, skip payload/api/static assets
    '/((?!admin|api|_next|_vercel|.*\\..*).*)',
  ],
}
