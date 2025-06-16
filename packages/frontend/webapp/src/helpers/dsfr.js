import {
    DsfrAlert,
    DsfrButton,
    DsfrButtonGroup,
    DsfrCard,
    DsfrCheckbox,
    DsfrInput,
    DsfrPagination,
    DsfrRadioButton,
    DsfrSearchBar,
    DsfrSegmented,
    DsfrSegmentedSet,
    DsfrTile,
} from "@gouvminint/vue-dsfr";

import "@gouvfr/dsfr/dist/dsfr.min.css";
import "@gouvminint/vue-dsfr/styles";
import "@gouvfr/dsfr/dist/utility/utility.main.min.css";
import "@gouvfr/dsfr/dist/component/component.main.min.css";

export function useDsfr(app) {
    app.component("DsfrAlert", DsfrAlert);
    app.component("DsfrButton", DsfrButton);
    app.component("DsfrButtonGroup", DsfrButtonGroup);
    app.component("DsfrCard", DsfrCard);
    app.component("DsfrCheckbox", DsfrCheckbox);
    app.component("DsfrInput", DsfrInput);
    app.component("DsfrPagination", DsfrPagination);
    app.component("DsfrRadioButton", DsfrRadioButton)
    app.component("DsfrSearchBar", DsfrSearchBar);
    app.component("DsfrSegmented", DsfrSegmented);
    app.component("DsfrSegmentedSet", DsfrSegmentedSet);
    app.component("DsfrTile", DsfrTile);
}
