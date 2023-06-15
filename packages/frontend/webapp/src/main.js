import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./helpers/router";
import FontAwesomeIcon, { useFontAwesome } from "./helpers/font-awesome";
import Datepicker from "./helpers/datepicker";
import { useMatomo } from "./helpers/matomo";
import { useSentry } from "./helpers/sentry";
import "@common/helpers/yup";
import "./helpers/flag-icons";

import "./assets/main.css";

const app = createApp(App);
useSentry(app);
useFontAwesome();

app.use(createPinia());
app.use(router);
useMatomo(app, router);
app.component("font-awesome-icon", FontAwesomeIcon);
app.component("DatePicker", Datepicker);

app.mount("#app");
