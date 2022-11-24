import * as Sentry from "@sentry/vue";
import ENV from "@/helpers/env";

export function useSentry(app) {
    if (!SENTRY) {
        return;
    }

    Sentry.init({
        app,
        release: `rb-front@${__APP_VERSION__}`,
        dsn: ENV.SENTRY.DSN,
    });
}
