import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";

config.autoAddCss = false;

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import "../js/icons";

export default function (vueInstance) {
  vueInstance.component("font-awesome-icon", FontAwesomeIcon);
}
