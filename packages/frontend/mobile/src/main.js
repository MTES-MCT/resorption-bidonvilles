import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import store from "#src/store/index";

new Vue({
  el: "#app",
  store,
  render: (h) => h(App),
});
