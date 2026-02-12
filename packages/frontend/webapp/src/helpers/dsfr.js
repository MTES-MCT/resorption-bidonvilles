import {
    DsfrAccordion,
    DsfrAlert,
    DsfrBadge,
    DsfrButton,
    DsfrButtonGroup,
    DsfrCallout,
    DsfrCard,
    DsfrCheckbox,
    DsfrCheckboxSet,
    DsfrInput,
    DsfrInputGroup,
    DsfrNotice,
    DsfrPagination,
    DsfrRadioButtonSet,
    DsfrSearchBar,
    DsfrSegmented,
    DsfrSegmentedSet,
    DsfrTable,
    DsfrTag,
    DsfrTile,
    DsfrTiles,
    DsfrTooltip,
    VIcon,
} from "@gouvminint/vue-dsfr";

import "@gouvfr/dsfr/dist/dsfr.min.css";
import "@gouvminint/vue-dsfr/styles";
import "@gouvfr/dsfr/dist/utility/utility.main.min.css";
import "@gouvfr/dsfr/dist/utility/utility.min.css";
import "@gouvfr/dsfr/dist/component/component.main.min.css";
import collections from "../utils/icon-collections.js";
import { addCollection } from "@iconify/vue";

for (const collection of collections) {
    addCollection(collection);
}

export function useDsfr(app) {
    app.component("DsfrAccordion", DsfrAccordion);
    app.component("DsfrAlert", DsfrAlert);
    app.component("DsfrBadge", DsfrBadge);
    app.component("DsfrButton", DsfrButton);
    app.component("DsfrButtonGroup", DsfrButtonGroup);
    app.component("DsfrCallout", DsfrCallout);
    app.component("DsfrCard", DsfrCard);
    app.component("DsfrCheckbox", DsfrCheckbox);
    app.component("DsfrCheckboxSet", DsfrCheckboxSet);
    app.component("DsfrInput", DsfrInput);
    app.component("DsfrInputGroup", DsfrInputGroup);
    app.component("DsfrNotice", DsfrNotice);
    app.component("DsfrPagination", DsfrPagination);
    app.component("DsfrRadioButtonSet", DsfrRadioButtonSet);
    app.component("DsfrSearchBar", DsfrSearchBar);
    app.component("DsfrSegmented", DsfrSegmented);
    app.component("DsfrSegmentedSet", DsfrSegmentedSet);
    app.component("DsfrTable", DsfrTable);
    app.component("DsfrTag", DsfrTag);
    app.component("DsfrTile", DsfrTile);
    app.component("DsfrTiles", DsfrTiles);
    app.component("DsfrTooltip", DsfrTooltip);
    app.component("VIcon", VIcon);
}
