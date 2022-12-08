import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import vue from "@vitejs/plugin-vue";
import { version } from "./package.json";
const { icons } = require("./public/img/icons/icons.json");

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        VitePWA({
            registerType: "autoUpdate",
            manifest: {
                name: "Résorption-bidonvilles",
                short_name: "R-B",
                description: "Agir pour résorber les bidonvilles",
                theme_color: "#00006D",
                icons: icons.map((icon) => {
                    icon.src = `./img/icons/${icon.src}`;
                    return icon;
                }),
            },
        }),
    ],
    server: {
        host: "0.0.0.0",
        port: 8093,
        strictPort: true,
        hmr: {
            clientPort: 443,
            port: 18093,
            path: "/socket",
        },
    },
    define: {
        __APP_VERSION__: JSON.stringify(version),
    },
    resolve: {
        dedupe: ["vue"],
        alias: {
            "#src": fileURLToPath(new URL("./src", import.meta.url)),
            "#helpers": fileURLToPath(
                new URL("./src/js/helpers", import.meta.url)
            ),
            "#frontend": fileURLToPath(new URL("..", import.meta.url)),
        },
    },
});
