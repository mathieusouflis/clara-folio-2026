import { withSentryConfig } from '@sentry/nextjs'
import { withPayload } from '@payloadcms/next/withPayload'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

// Media is served straight from the S3-compatible bucket (RustFS), not proxied
// through Payload, so Next/Image needs that host allow-listed too.
const s3PublicUrl = process.env.S3_PUBLIC_URL ? new URL(process.env.S3_PUBLIC_URL) : null

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      ...(s3PublicUrl
        ? [
            {
              protocol: s3PublicUrl.protocol.replace(':', ''),
              hostname: s3PublicUrl.hostname,
              port: s3PublicUrl.port || undefined,
              pathname: '/**',
            },
          ]
        : []),
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
