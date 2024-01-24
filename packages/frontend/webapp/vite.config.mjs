import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { version } from "./package.json";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    server: {
        host: "0.0.0.0",
        port: 8092,
        strictPort: true,
        hmr: {
            clientPort: 443,
            port: 18092,
            path: "/socket",
        },
    },
    define: {
        __APP_VERSION__: JSON.stringify(version),
    },
    optimizeDeps: {
        include: ["@turf/turf"],
    },
    resolve: {
        alias: {
            "@common": fileURLToPath(new URL("../common", import.meta.url)),
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
});
