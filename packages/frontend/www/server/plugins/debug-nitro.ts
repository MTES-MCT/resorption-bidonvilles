import { getRequestURL } from "h3";

export default defineNitroPlugin((nitroApp) => {
    const config = useRuntimeConfig();
    const debugErrorsEnabled = String(config.debugLogs).toLowerCase() === "true";
    const debugRequestsEnabled = String(config.debugRequestLogs).toLowerCase() === "true";

    if (!debugErrorsEnabled && !debugRequestsEnabled) {
        return;
    }

    nitroApp.hooks.hook("request", (event) => {
        if (!debugRequestsEnabled) {
            return;
        }

        event.context.debugStartAt = Date.now();
        console.info("[nitro][request]", {
            method: event.method,
            path: getRequestURL(event).pathname,
        });
    });

    nitroApp.hooks.hook("afterResponse", (event) => {
        if (!debugRequestsEnabled) {
            return;
        }

        const start = Number(event.context.debugStartAt || Date.now());
        console.info("[nitro][response]", {
            method: event.method,
            path: getRequestURL(event).pathname,
            statusCode: event.node.res.statusCode,
            durationMs: Date.now() - start,
        });
    });

    nitroApp.hooks.hook("error", (error, { event }) => {
        if (!debugErrorsEnabled) {
            return;
        }

        console.error("[nitro][error]", {
            method: event?.method,
            path: event ? getRequestURL(event).pathname : undefined,
            name: error?.name,
            message: error?.message,
            stack: error?.stack,
        });
    });
});
