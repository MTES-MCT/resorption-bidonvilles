import { createApp } from "vue";
import router from "./js/router";
import App from "./App.vue";
// import "./registerServiceWorker";
import "@resorptionbidonvilles/ui/src/css/styles.css";
import "./init/icons";

const app = createApp(App);
app.use(router);

app.mount("#app");
