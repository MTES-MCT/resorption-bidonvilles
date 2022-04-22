import "./init/styles";
import "./init/formatDate";
import registerGlobalComponents from "#app/components/ui/registerGlobalComponents";
import registerIcons from "./init/icons";
import registerMatomo from "./init/matomo";
import registerSentry from "./init/sentry";

// Import vue libs
import App from "./App.vue";
import VueI18n from "vue-i18n";
import VueRouter from "vue-router";
import messages from "#app/messages";
import { router } from "#app/router";
import store from "#app/store/index";
import Vue from "vue";

Vue.use(VueRouter);
Vue.use(VueI18n);
registerIcons(Vue);
registerGlobalComponents(Vue);
registerIcons(Vue);
registerMatomo(Vue);
registerSentry(Vue);

new Vue({
    el: "#app",
    router,
    store,
    i18n: new VueI18n({
        locale: "fr",
        messages
    }),
    render: h => h(App)
});
