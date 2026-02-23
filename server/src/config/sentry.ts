import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import env from './env';

export const initSentry = (): void => {
    if (!env.SENTRY_DSN) return;

    Sentry.init({
        dsn: env.SENTRY_DSN,
        environment: env.NODE_ENV,
        integrations: [nodeProfilingIntegration()],
        // Capture 100% of traces in dev, 10% in production
        tracesSampleRate: env.NODE_ENV === 'production' ? 0.1 : 1.0,
        profilesSampleRate: env.NODE_ENV === 'production' ? 0.1 : 1.0,
    });
};

export { Sentry };
