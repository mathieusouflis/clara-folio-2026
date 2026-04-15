import { withSentryConfig } from '@sentry/nextjs'
import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your Next.js config here
  output: 'standalone',
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

export default withSentryConfig(withPayload(nextConfig, { devBundleServerPackages: false }), {
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
