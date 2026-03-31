import * as Sentry from '@sentry/react';

// Sentry configuration for PitchForge
// Error tracking and monitoring

export function initSentry() {
  // Only initialize if DSN is provided
  const dsn = import.meta.env.VITE_SENTRY_DSN;

  if (!dsn) {
    console.warn('Sentry DSN not configured - error tracking disabled');
    return;
  }

  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    debug: import.meta.env.DEV,
    tracesSampleRate: 0.1,
    attachStacktrace: true,
    initialScope: {
      tags: {
        version: import.meta.env.VITE_APP_VERSION || 'unknown',
      },
    },
  });
}

export default Sentry;
