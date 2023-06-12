import setPercentageOf from "../../../utils/setPercentageOf";
import PoliceBody from "./PoliceBody.vue";
import PoliceHead from "./PoliceHead.vue";

export default {
    icon: "person-military-pointing",
    title: "Nombre de sites faisant l'objet du concours de la force publique",
    headComponent: PoliceBody,
    bodyComponent: PoliceHead,
    default: 0,
    primaryMetric(summary, town) {
        summary.number_of_police += town.police ? 1 : 0;
    },
    secondaryMetric(summary, city) {
        setPercentageOf("number_of_police", summary, city);
    },
};
