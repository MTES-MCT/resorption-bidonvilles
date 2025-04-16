import {
    DsfrCard,
    DsfrTile,
    DsfrSearchBar,
    DsfrInput,
} from "@gouvminint/vue-dsfr";

import "@gouvfr/dsfr/dist/dsfr.min.css";
import "@gouvminint/vue-dsfr/styles";

export function useDsfr(app) {
    app.component("DsfrCard", DsfrCard);
    app.component("DsfrTile", DsfrTile);
    app.component("DsfrSearchBar", DsfrSearchBar);
    app.component("DsfrInput", DsfrInput);
}
