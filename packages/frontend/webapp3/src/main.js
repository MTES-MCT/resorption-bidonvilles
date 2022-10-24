import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./helpers/router";
import FontAwesomeIcon from "./helpers/font-awesome";
import { useMatomo } from "./helpers/matomo.js";
import { useSentry } from "./helpers/sentry.js";
import "./helpers/yup";

import "./assets/main.css";

const app = createApp(App);
useSentry(app);

app.use(createPinia());
app.use(router);
useMatomo(app, router);
app.component("font-awesome-icon", FontAwesomeIcon);

app.mount("#app");
