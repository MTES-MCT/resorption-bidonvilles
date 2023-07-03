import * as Sentry from '@sentry/node';
import loaders from '#server/loaders';
import config from '#server/config';

const {
    port, sendActivitySummary, sendActionAlerts, checkInactiveUsers,
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
        const app = loaders.express();

        sentryContextHandlers(app);

        loaders.rateLimiter(app);
        loaders.routes(app);

        sentryErrorHandlers(app);

        app.listen(port, () => {
            // eslint-disable-next-line no-console
            console.log(`Server is now running on port ${port}! :)`);
        });

        // s3 (initialisation de tous les buckets, si nécessaire)
        try {
            const response = await loaders.s3();
            let message: string = '================================\n';
            message += 'Connexion au bucket S3 réussie !\n';

            if (response.Buckets?.length > 0) {
                message += response.Buckets?.length > 1
                    ? 'Liste des buckets disponibles:\n'
                    : 'Bucket disponible:\n';
                response.Buckets.forEach((bucket) => {
                    // eslint-disable-next-line no-console
                    message += `- ${bucket.Name}\n`;
                });
            } else {
                message += 'Aucun bucket n\'est accessible !';
            }
            message += '===============================';

            // eslint-disable-next-line no-console
            console.log(message);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.log('Initialisation S3 échouée :(', error);
        }

        // agenda
        const agenda = loaders.agenda();
        loaders.agendaJobs(agenda);

        try {
            await agenda.start();

            if (sendActivitySummary) {
                await agenda.every('0 0 7 * * 1', 'send_activity_summary'); // every monday at 7AM
            }

            if (checkInactiveUsers) {
                await agenda.every('0 0 6 * * *', 'inactive_users_check'); // every day at 6AM
            }

            if (sendActionAlerts) {
                await agenda.every('0 0 5 15 12 *', 'send_action_alert_preshot'); // tous les 15 décembre at 5AM
                await agenda.every('0 0 5 20 1 *', 'send_action_alert_postshot'); // tous les 20 janvier at 5AM
            }

            // eslint-disable-next-line no-console
            console.log('Set scheduled jobs up');
        } catch (error) {
            // eslint-disable-next-line no-console
            console.log('Failed settings up scheduled jobs');
        }

        return app;
    },
};
