import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
    plugins: [vue()],
    define: {
        __APP_VERSION__: JSON.stringify("test"),
    },
    test: {
        environment: "jsdom",
        globals: true,
    },
    resolve: {
        alias: {
            "@common": fileURLToPath(new URL("../common", import.meta.url)),
            "@": fileURLToPath(new URL("./src", import.meta.url)),
            "@stores": fileURLToPath(new URL("./src/stores/", import.meta.url)),
        },
    },
});
