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
        allowedHosts: ["host.docker.internal", "localhost"],
    },
    preview: {
        host: "0.0.0.0",
        port: 8093,
        strictPort: true,
        allowedHosts: ["host.docker.internal", "localhost"],
    },
    css: {
        lightningcss: {
            errorRecovery: true,
        },
    },
    build: {
        sourcemap: true,
        chunkSizeWarningLimit: 1200,
    },
    rolldownOptions: {
        output: {
            manualChunks(id) {
                if (id.includes("node_modules")) {
                    // Isoles les gros blocs connus du projet
                    if (id.includes("@gouvfr") || id.includes("dsfr")) {
                        return "vendor-dsfr";
                    }
                    if (
                        id.includes("vue") ||
                        id.includes("nuxt") ||
                        id.includes("@vue")
                    ) {
                        return "vendor-framework";
                    }

                    // Pour le reste, découpe par paquet npm
                    const packageName = id
                        .toString()
                        .split("node_modules/")[1]
                        .split("/")[0];
                    return `vendor-${packageName.replace("@", "")}`;
                }
            },
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
            "@stores": fileURLToPath(new URL("./src/stores/", import.meta.url)),
        },
    },
});
