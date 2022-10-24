import { createApp } from "vue";
import router from "./js/router";
import App from "./App.vue";
// import "./registerServiceWorker";
import store from "#src/store/index.js";
import "@resorptionbidonvilles/ui/src/css/styles.css";
import FontAwesomeIcon from "./init/icons";

const app = createApp(App);
app.use(router);
app.use(store);
app.component("font-awesome-icon", FontAwesomeIcon);

app.mount("#app");
