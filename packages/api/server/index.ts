import '../module_alias';
import * as Sentry from '@sentry/node';
import Tracing from '@sentry/tracing';
import app from '#server/app';
import { version } from '#root/package.json';

import config from './config';

app.start().then((expressApp) => {
    if (config.sentry.dsn) {
        Sentry.init({
            dsn: config.sentry.dsn,
            release: `rb-api@${version}`,
            environment: 'production',
            beforeSend(err) {
                // console.log('sentry send', err);
                return err;
            },
            integrations: [
                // enable HTTP calls tracing
                new Sentry.Integrations.Http({ tracing: true }),
                // enable Postres calls tracing
                new Tracing.Integrations.Postgres(), // Add this integration
                new Tracing.Integrations.Express({
                    // to trace all requests to the default router
                    app: expressApp,
                }),
            ],

            // Set tracesSampleRate to 1.0 to capture 100%
            // of transactions for performance monitoring.
            // We recommend adjusting this value in production
            tracesSampleRate: 1.0,
        });
    }
});
