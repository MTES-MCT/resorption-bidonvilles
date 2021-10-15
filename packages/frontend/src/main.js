import "./init/styles";
import "./init/formatDate";
import registerGlobalComponents from "#app/components/ui/registerGlobalComponents";
import registerIcons from "./init/icons";
import MarianneBold from "./fonts/Marianne-Bold.otf";
import MarianneLight from "./fonts/Marianne-Light.otf";
import MarianneRegular from "./fonts/Marianne-Regular.otf";

// Import vue libs
import VueI18n from "vue-i18n";
import messages from "#app/messages";
import initStore from "#app/store";
import Guard from "./js/app/components/Guard";

// Lazyload non critical modules (Sentry, Matomo, VeeValidate)
const asyncMatomo = import("./init/matomo").then(m => m.default);
const asyncSentry = import("./init/sentry").then(m => m.default);

// WARNING: This file should be as small as possible as it's loaded on EVERY pages
// Please try to lazyload modules instead
export default function(Vue, { appOptions, head }) {
    asyncSentry.then(m => m(Vue));
    asyncMatomo.then(m => m(Vue));

    // Preload fonts for performances
    head.link.push({
        rel: "preload",
        href: MarianneBold,
        as: "font",
        crossorigin: true
    });
    head.link.push({
        rel: "preload",
        href: MarianneLight,
        as: "font",
        crossorigin: true
    });
    head.link.push({
        rel: "preload",
        href: MarianneRegular,
        as: "font",
        crossorigin: true
    });

    // Register lazy loaded components
    registerIcons(Vue);
    registerGlobalComponents(Vue);
    Vue.component("Guard", Guard);

    // Init critical stuff
    Vue.use(VueI18n);
    appOptions.store = initStore(Vue);
    appOptions.i18n = new VueI18n({
        locale: "fr",
        messages
    });
}
