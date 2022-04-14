import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { config, library } from "@fortawesome/fontawesome-svg-core";
import {
    faGithub
} from "@fortawesome/free-brands-svg-icons";
import {
    faAddressBook,
    faBook,
    faChartLine,
    faChevronDown,
    faComment,
    faComments,
    faEnvelope,
    faFileDownload,
    faFileSignature,
    faFlag,
    faHandHoldingMedical,
    faMapMarkedAlt,
    faMapMarkerAlt,
    faSchool,
    faSpinner,
    faSync,
    faUserPlus,
    faUsers,
    faUserShield
} from "@fortawesome/free-solid-svg-icons";

export default defineNuxtPlugin((nuxtApp) => {
    config.autoAddCss = false;
    library.add(
        faAddressBook,
        faBook,
        faChartLine,
        faChevronDown,
        faComment,
        faComments,
        faEnvelope,
        faFileDownload,
        faFileSignature,
        faFlag,
        faGithub,
        faHandHoldingMedical,
        faMapMarkedAlt,
        faMapMarkerAlt,
        faSchool,
        faSpinner,
        faSync,
        faUserPlus,
        faUsers,
        faUserShield
    );
    nuxtApp.vueApp.component('font-awesome-icon', FontAwesomeIcon);
});
