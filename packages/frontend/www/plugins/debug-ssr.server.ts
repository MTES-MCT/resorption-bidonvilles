export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig();
    const debugEnabled = String(config.debugLogs).toLowerCase() === "true";

    if (!debugEnabled) {
        return;
    }

    nuxtApp.hook("app:error", (error) => {
        console.error("[nuxt][app:error]", {
            name: error?.name,
            message: error?.message,
            stack: error?.stack,
        });
    });

    nuxtApp.hook("vue:error", (error, _instance, info) => {
        console.error("[nuxt][vue:error]", {
            info,
            name: error?.name,
            message: error?.message,
            stack: error?.stack,
        });
    });
});
