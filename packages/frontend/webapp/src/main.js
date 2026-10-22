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

import "./assets/main.css";

const app = createApp(App);
useDsfr(app);
useSentry(app);
useI18n(app);

app.use(createPinia());
app.use(router);
useMatomo(app, router);
app.component("DatePicker", Datepicker);

// Keycloak n'est PAS initialisé ici au boot.
// Le guard du router (router.js) appelle ensureReady() uniquement pour les routes
// protégées (auth: "signedIn"), ce qui déclenche l'init Keycloak si nécessaire.
// Cela évite tout redirect Keycloak pour les routes publiques (signedOut/none),
// quelle que soit l'environnement (localhost, preprod, prod).

app.mount("#app");
