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

app.mount("#app");
