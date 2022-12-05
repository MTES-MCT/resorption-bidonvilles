import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { version } from "./package.json";
const { icons } = require("./public/img/icons/icons.json");

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
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
        alias: {
            "#src": fileURLToPath(new URL("./src", import.meta.url)),
            "#helpers": fileURLToPath(
                new URL("./src/js/helpers", import.meta.url)
            ),
            "#frontend": fileURLToPath(new URL("..", import.meta.url)),
        },
    },
    pwa: {
        name: "Résorption-bidonvilles",
        themeColor: "#00006D",
        msTileColor: "#ffffff",
        manifestOptions: {
            icons: icons.map((icon) => {
                icon.src = `./img/icons/${icon.src}`;
                return icon;
            }),
        },
        appleMobileWebAppCapable: "yes",
    },
});
