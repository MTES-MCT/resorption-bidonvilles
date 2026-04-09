import {
    DsfrButton,
    DsfrCard,
    DsfrFooter,
    DsfrHeader,
    DsfrNavigation,
} from "@gouvminint/vue-dsfr";

import "@gouvfr/dsfr/dist/dsfr.min.css";
import "@gouvminint/vue-dsfr/styles";
import "@gouvfr/dsfr/dist/utility/utility.main.min.css";
import "@gouvfr/dsfr/dist/utility/utility.min.css";
import "@gouvfr/dsfr/dist/component/component.main.min.css";

export function useDsfr(app) {
    app.component("DsfrButton", DsfrButton);
    app.component("DsfrCard", DsfrCard);
    app.component("DsfrFooter", DsfrFooter);
    app.component("DsfrHeader", DsfrHeader);
    app.component("DsfrNavigation", DsfrNavigation);
}
