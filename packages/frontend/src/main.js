import './init/styles'
import registerIcons from './init/icons'
import registerGlobalComponents from "#app/components/ui/registerGlobalComponents";

// Import vue libs
import VueI18n from "vue-i18n";
import messages from "#app/messages";

// WARNING: This file should be as small as possible as it's loaded on EVERY pages
// Please try to lazyload modules instead
export default function(Vue, { appOptions }) {
    // Register lazy loaded components
    registerIcons(Vue);
    registerGlobalComponents(Vue);
    Vue.use(VueI18n);
    appOptions.i18n = new VueI18n({
        locale: "fr",
        messages
    });
}
