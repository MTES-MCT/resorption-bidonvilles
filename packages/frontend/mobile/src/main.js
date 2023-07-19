import { createApp } from "vue";
import router from "./js/router";
import App from "./App.vue";
// import "./registerServiceWorker";
import store from "#src/store/index.js";
import "@resorptionbidonvilles/ui/src/css/styles.css";
import "./init/icons";
import { useMatomo } from "#src/js/helpers/matomo";

const app = createApp(App);
app.use(router);
app.use(store);
useMatomo(app, router);

app.mount("#app");
