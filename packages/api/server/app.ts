import * as Sentry from '@sentry/node';
import loaders from '#server/loaders';
import config from '#server/config';
import PrometheusMetricsHandler from '#server/middlewares/prometheusMiddleware';

const {
    port, sendActivitySummary, sendActionAlerts, checkInactiveUsers, cleanAttachmentsArchives, anonymizeOwners, anonymizeInactiveUsers, logInProd,
} = config;

const sentryContextHandlers = (app) => {
    app.use(Sentry.Handlers.requestHandler());
    app.use(Sentry.Handlers.tracingHandler());
};


const sentryErrorHandlers = (app) => {
    // Report handled errors with next(error)
    app.use(async (
        err,
        req,
        res,
        next,
    ) => {
        Sentry.captureException(err);

        next();
    });

    // Report unhandled errors
    // The error handler must be before any other error middleware
    app.use(
        Sentry.Handlers.errorHandler(),
    );
};


export default {
    async start() {
        // app
        const app = loaders.customRouteMethods(loaders.express());

        sentryContextHandlers(app);

        app.use(PrometheusMetricsHandler);

        loaders.rateLimiter(app);
        await loaders.routes(app);

        sentryErrorHandlers(app);

        app.listen(port, () => {
            // eslint-disable-next-line no-console
            console.log(`Server is now running on port ${port}! :)`);
        });

        // s3 (initialisation de tous les buckets, si nécessaire)
        try {
            await loaders.s3();
        } catch (error) {
            if (error.Code !== 'BucketAlreadyOwnedByYou') {
                // eslint-disable-next-line no-console
                console.error('Initialisation S3 échouée :', error);
            }
        }

        // agenda
        const agenda = loaders.agenda();
        loaders.agendaJobs(agenda);

        try {
            await agenda.start();

            if (sendActivitySummary) {
                // eslint-disable-next-line no-console
                console.log('Activity summary job is enabled');
                await agenda.every('0 0 8 * * 2', 'send_activity_summary'); // every monday at 7AM
            }

            if (checkInactiveUsers) {
                // eslint-disable-next-line no-console
                console.log('Inactive users check job is enabled');
                await agenda.every('0 0 6 * * *', 'inactive_users_check'); // every day at 6AM
            }

            if (sendActionAlerts) {
                // eslint-disable-next-line no-console
                console.log('Action alerts job is enabled');
                await agenda.every('0 0 5 15 12 *', 'send_action_alert_preshot'); // tous les 15 décembre at 5AM
                await agenda.every('0 0 5 20 1 *', 'send_action_alert_postshot'); // tous les 20 janvier at 5AM
            }

            if (cleanAttachmentsArchives) {
                // eslint-disable-next-line no-console
                console.log('Clean attachments archives job is enabled');
                await agenda.every('0 0 4 * * *', 'clean_attachments_archives');
            }

            if (anonymizeOwners) {
                // eslint-disable-next-line no-console
                console.log('Anonymize owners job is enabled');
                await agenda.every('0 0 1 * * 1', 'anonymize_owners'); // tous les lundi à 1:00
            }

            if (anonymizeInactiveUsers) {
                // eslint-disable-next-line no-console
                console.log('Anonymize inactive users job is enabled');
                await agenda.every('0 0 2 * * *', 'anonymize_inactive_users');
            }

            // eslint-disable-next-line no-console
            console.log('Scheduled jobs set up');
            if (logInProd) {
                const jobs = await agenda.jobs();
                let compteur = 0;
                jobs.map(job => job.attrs).forEach((attrs) => {
                    if (attrs.name === 'send_activity_summary') {
                        // eslint-disable-next-line no-console
                        console.log('Agenda Jobs:', attrs);
                    } else {
                        compteur += 1;
                    }
                });
                // eslint-disable-next-line no-console
                console.log(`Il y a ${compteur} autres jobs planifiés.`);
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Failed settings up scheduled jobs', error);
        }

        return app;
    },
};
