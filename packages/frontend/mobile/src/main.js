import Vue from "vue";
import VueRouter from "vue-router";
import App from "./App.vue";
import "./registerServiceWorker";
import store from "#src/store/index";
import "@resorptionbidonvilles/ui/src/css/styles.css";
import router from "#src/js/router.js";
import { ValidationProvider } from "vee-validate";

Vue.use(VueRouter);
Vue.component("ValidationProvider", ValidationProvider);

new Vue({
  el: "#app",
  store,
  router,
  render: (h) => h(App),
});
