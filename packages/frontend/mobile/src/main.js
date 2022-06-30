import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import store from "#src/store/index";
import '@resorptionbidonvilles/ui/src/css/styles.css';

new Vue({
  el: "#app",
  store,
  render: (h) => h(App),
});
