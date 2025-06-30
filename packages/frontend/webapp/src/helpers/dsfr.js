import {
    DsfrCard,
    DsfrTile,
    DsfrSearchBar,
    DsfrInput,
    DsfrCheckbox,
    DsfrButton,
    DsfrButtonGroup,
} from "@gouvminint/vue-dsfr";

import "@gouvfr/dsfr/dist/dsfr.min.css";
import "@gouvminint/vue-dsfr/styles";
import "@gouvfr/dsfr/dist/utility/utility.main.min.css";
import "@gouvfr/dsfr/dist/component/component.main.min.css";

export function useDsfr(app) {
    app.component("DsfrCard", DsfrCard);
    app.component("DsfrTile", DsfrTile);
    app.component("DsfrSearchBar", DsfrSearchBar);
    app.component("DsfrInput", DsfrInput);
    app.component("DsfrCheckbox", DsfrCheckbox);
    app.component("DsfrButton", DsfrButton);
    app.component("DsfrButtonGroup", DsfrButtonGroup);
}
