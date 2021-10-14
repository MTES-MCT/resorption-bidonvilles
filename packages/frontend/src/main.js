import "./init/styles";
import registerGlobalComponents from "#app/components/ui/registerGlobalComponents";

// Import vue libs
import VueI18n from "vue-i18n";
import messages from "#app/messages";

// Lazyload non critical modules (Sentry, Matomo, VeeValidate)
const asyncMatomo = import("./init/matomo").then(m => m.default);
const asyncSentry = import("./init/sentry").then(m => m.default);
const asyncIcons = import("./init/icons").then(m => m.default);

// WARNING: This file should be as small as possible as it's loaded on EVERY pages
// Please try to lazyload modules instead
export default function(Vue, { appOptions }) {
    asyncSentry.then(m => m(Vue));
    asyncMatomo.then(m => m(Vue));
    asyncIcons.then(m => m(Vue));

    // Register lazy loaded components
    registerGlobalComponents(Vue);

    // Init critical stuff
    Vue.use(VueI18n);
    appOptions.i18n = new VueI18n({
        locale: "fr",
        messages
    });
}
