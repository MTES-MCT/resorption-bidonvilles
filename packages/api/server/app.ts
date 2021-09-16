import * as Sentry from '@sentry/node';
import loaders from '#server/loaders';
import { port } from '#server/config';

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

        loaders.routes(app);

        sentryErrorHandlers(app);

        app.listen(port, () => {
            // eslint-disable-next-line no-console
            console.log(`Server is now running on port ${port}! :)`);
        });

        // agenda
        const agenda = loaders.agenda();
        loaders.agendaJobs(agenda);

        try {
            await agenda.start();
            await agenda.every("00 00 04 * * 1", "send_activity_summary");
            // eslint-disable-next-line no-console
            console.log('Set scheduled jobs up');
        } catch (error) {
            // eslint-disable-next-line no-console
            console.log('Failed settings up scheduled jobs');
        }

        return app;
    },
};
