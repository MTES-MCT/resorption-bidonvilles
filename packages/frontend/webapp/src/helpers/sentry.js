import * as Sentry from "@sentry/vue";
import ENV from "@/helpers/env";

const { SENTRY } = ENV;
export function useSentry(app) {
    if (!SENTRY) {
        return;
    }

    Sentry.init({
        app,
        release: `rb-front@${__APP_VERSION__}`,
        dsn: SENTRY.DSN,
    });
}
