import { withSentryConfig } from '@sentry/nextjs'
import { withPayload } from '@payloadcms/next/withPayload'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'clarabaptista.com',
        pathname: '/api/media/file/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/categories/:categorySlug/:projectSlug',
        destination: '/projects/:projectSlug',
        permanent: true,
      },
    ]
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
}

export default withSentryConfig(withNextIntl(withPayload(nextConfig, { devBundleServerPackages: false })), {
  org: 'clara-baptista',
  project: 'javascript-nextjs',

  // Only upload source maps in production builds
  enabled: process.env.NODE_ENV === 'production',

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  sourcemaps: {
    deleteSourcemapsAfterUpload: true,
  },

  // Automatically instrument Vercel Cron Monitors (top-level option)
  automaticVercelMonitors: true,

  // Remove Sentry debug logging from production bundle
  disableLogger: true,
})
