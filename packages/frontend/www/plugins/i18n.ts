import { createI18n } from 'vue-i18n';
import messages from "../assets/i18n/index.js";

export default defineNuxtPlugin(({ vueApp }) => {
    const i18n = createI18n({
        fallbackLocale: "fr",
        messages
    });

    vueApp.use(i18n)
});