// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: 'https://dca9420ce9544687cf8a13587d250d4a@o4511225572884480.ingest.de.sentry.io/4511225581404240',

  environment: process.env.NODE_ENV,

  // Sample 100% of transactions in dev, 10% in production
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  sendDefaultPii: true,
})
