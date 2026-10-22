import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./helpers/router";
import "./helpers/font-awesome";
import Datepicker from "./helpers/datepicker";
import { useMatomo } from "./helpers/matomo";
import { useSentry } from "./helpers/sentry";
import { useDsfr } from "./helpers/dsfr";
import { useI18n } from "./helpers/i18n";
import "@common/helpers/yup";
import { useAuthStore } from "@/stores/auth.store";

import "./assets/main.css";

const app = createApp(App);
useDsfr(app);
useSentry(app);
useI18n(app);

app.use(createPinia());
app.use(router);
useMatomo(app, router);
app.component("DatePicker", Datepicker);

// On n'initialise Keycloak au boot que si la route initiale est protégée.
// Pour les routes publiques (signedOut/none), le guard du router appellera
// ensureReady() uniquement quand nécessaire, évitant tout redirect Keycloak.
const initialRoute = router.resolve(
    window.location.pathname + window.location.search + window.location.hash
);
const initialRequirements = initialRoute?.meta?.requirements;
const initialAuth = initialRequirements?.auth;
const isPublicRoute = initialAuth === "signedOut" || initialAuth === "none";

if (!isPublicRoute) {
    const authStore = useAuthStore();
    authStore.initKeycloak().catch(() => {
        // Échec silencieux au boot : géré au niveau des composants/guards si besoin
    });
}

app.mount("#app");
