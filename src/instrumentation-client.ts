// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: 'https://dca9420ce9544687cf8a13587d250d4a@o4511225572884480.ingest.de.sentry.io/4511225581404240',

  environment: process.env.NODE_ENV,

  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  integrations: [Sentry.replayIntegration()],

  enableLogs: true,

  // Session Replay: 10% of sessions in production, 100% in dev
  replaysSessionSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Always capture replays on errors
  replaysOnErrorSampleRate: 1.0,

  sendDefaultPii: true,
})

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
