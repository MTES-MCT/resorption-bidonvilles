import { createI18n } from "vue-i18n";
import messages from "@common/i18n/index";

export function useI18n(app) {
    const i18n = createI18n({
        legacy: false,
        locale: "fr",
        messages,
    });

    app.use(i18n);
}
