// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';
if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

    // Add optional integrations for additional features
    integrations: [Sentry.replayIntegration(), Sentry.browserTracingIntegration()],

    // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
    tracesSampleRate: 1,

    // Enable logs to be sent to Sentry
    enableLogs: true,

    // Define how likely Replay events are sampled.
    // This sets the sample rate to be 10%. You may want this to be 100% while
    // in development and sample at a lower rate in production
    replaysSessionSampleRate: 0.1,

    // Define how likely Replay events are sampled when an error occurs.
    replaysOnErrorSampleRate: 1.0,

    // Capture errors from unhandled promise rejections
    attachStacktrace: true,

    // Setting this option to true will print useful information to the console while you're setting up Sentry.
    debug: true, // Temporarily enable debug to see what's happening
  });

  // Add global error handlers
  window.addEventListener('error', event => {
    Sentry.captureException(event.error);
  });

  window.addEventListener('unhandledrejection', event => {
    Sentry.captureException(event.reason);
  });

  // Capture console errors
  const originalConsoleError = console.error;
  console.error = (...args) => {
    Sentry.captureMessage(args.join(' '), 'error');
    originalConsoleError.apply(console, args);
  };
}
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
