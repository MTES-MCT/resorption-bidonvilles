const routes = require("./js/app/routes");
import "./init/styles";
import "./init/formatDate";
import registerGlobalComponents from "#app/components/ui/registerGlobalComponents";
import guardians from "./js/app/guardians";
import MarianneBold from "./fonts/Marianne-Bold.otf";
import MarianneLight from "./fonts/Marianne-Light.otf";
import MarianneRegular from "./fonts/Marianne-Regular.otf";
import MarianneThin from "./fonts/Marianne-Thin.otf";

// Import vue libs
import initStore from "#app/store";
import VueI18n from "vue-i18n";
import messages from "#app/messages";

// Lazyload non critical modules (Sentry, Matomo, VeeValidate)
const asyncMatomo = import(/* webpackChunkName: matomo */ "./init/matomo").then(
    m => m.default
);
const asyncSentry = import(/* webpackChunkName: sentry */ "./init/sentry").then(
    m => m.default
);
const asyncIcons = import(/* webpackChunkName: icons */ "./init/icons").then(
    m => m.default
);

// WARNING: This file should be as small as possible as it's loaded on EVERY pages
// Please try to lazyload modules instead
export default function(Vue, { appOptions, router, head }) {
    asyncSentry.then(m => m(Vue));
    asyncMatomo.then(m => m(Vue));
    asyncIcons.then(m => m(Vue));

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
    head.link.push({
        rel: "preload",
        href: MarianneThin,
        as: "font",
        crossorigin: true
    });

    // Register lazy loaded components
    registerGlobalComponents(Vue);

    // Init critical stuff
    appOptions.store = initStore(Vue);
    Vue.use(VueI18n);
    appOptions.i18n = new VueI18n({
        locale: "fr",
        messages
    });

    if (process.isClient) {
        router.beforeEach((to, from, next) => {
            // TODO: Check if we can find a way to retrieve beforeEnter with a less hacky way as they are not passed to/from
            const matchedRoute = routes.find(r => {
                if (to.matched.length === 1) {
                    const matchedPath = to.matched[0].path;
                    return (
                        matchedPath === r.path ||
                        (r.path === "/" && matchedPath === "")
                    );
                }

                return to.path.replace(/\/$/, "") === r.path;
            });

            if (!matchedRoute) {
                return next();
            }

            const { beforeEnter } = matchedRoute.context || {};

            if (typeof beforeEnter === "function") {
                beforeEnter(to, from, next);
            } else if (guardians[beforeEnter]) {
                guardians[beforeEnter](to, from, next);
            } else {
                next();
            }
        });
    }
}
