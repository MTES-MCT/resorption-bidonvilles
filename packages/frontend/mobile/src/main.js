import Vue from "vue";
import VueRouter from "vue-router";
import App from "./App.vue";
import "./registerServiceWorker";
import store from "#src/store/index";
import "@resorptionbidonvilles/ui/src/css/styles.css";
import router from "#src/js/router.js";
import registerIcons from "./init/icons";

import { ValidationProvider, ValidationObserver } from "vee-validate";

Vue.use(VueRouter);
Vue.component("ValidationProvider", ValidationProvider);
Vue.component("ValidationObserver", ValidationObserver);
registerIcons(Vue);

new Vue({
  el: "#app",
  store,
  router,
  render: (h) => h(App),
});
