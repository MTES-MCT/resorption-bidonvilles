import {
    ValidationProvider,
    ValidationObserver,
    extend,
    localize
} from "vee-validate";
/*eslint import/namespace: ['error', { allowComputed: true }]*/
import * as rules from "vee-validate/dist/rules";
import fr from "vee-validate/dist/locale/fr.json";
import en from "vee-validate/dist/locale/en.json";
import ro from "vee-validate/dist/locale/ro.json";
import bg from "vee-validate/dist/locale/bg.json";

export default function(vueInstance) {
    vueInstance.component("ValidationProvider", ValidationProvider);
    vueInstance.component("ValidationObserver", ValidationObserver);

    // Vee Validate (Form Validation)
    localize({
        en,
        fr,
        bg,
        ro
    });

    Object.keys(rules).forEach(rule => {
        extend(rule, {
            ...rules[rule] // copies rule configuration
        });
    });

    localize("fr");
}
