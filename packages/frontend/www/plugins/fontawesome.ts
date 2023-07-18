import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { config, library } from "@fortawesome/fontawesome-svg-core";
import {
    faFacebook,
    faGithub,
    faLinkedin,
    faTwitter
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
    faUserShield,
    faArrowUpRightFromSquare
} from "@fortawesome/free-solid-svg-icons";

export default defineNuxtPlugin((nuxtApp) => {
    // the UI library uses an icon name "external-link-alt" that exists in v5 (used in webapp) but
    // not in v6 (used here)
    faArrowUpRightFromSquare.iconName = "external-link-alt";

    config.autoAddCss = false;
    library.add(
        faAddressBook,
        faBook,
        faChartLine,
        faChevronDown,
        faComment,
        faComments,
        faEnvelope,
        faFacebook,
        faFileDownload,
        faFileSignature,
        faFlag,
        faGithub,
        faHandHoldingMedical,
        faLinkedin,
        faMapMarkedAlt,
        faMapMarkerAlt,
        faSchool,
        faSpinner,
        faSync,
        faTwitter,
        faUserPlus,
        faUsers,
        faUserShield,
        faArrowUpRightFromSquare
    );
    nuxtApp.vueApp.component('font-awesome-icon', FontAwesomeIcon);
});
