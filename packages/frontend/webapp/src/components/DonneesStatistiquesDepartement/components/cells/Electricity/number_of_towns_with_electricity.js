import setPercentageOf from "../../../utils/setPercentageOf";
import ElectricityBody from "./ElectricityBody.vue";
import ElectricityHead from "./ElectricityHead.vue";

export default {
    icon: "bolt",
    title: "Nombre de sites avec accès à l'électricité",
    headComponent: ElectricityHead,
    bodyComponent: ElectricityBody,
    default: 0,
    primaryMetric(summary, town) {
        summary.number_of_towns_with_electricity += town.access_to_electricity
            ? 1
            : 0;
    },
    secondaryMetric(summary, city) {
        setPercentageOf("number_of_towns_with_electricity", summary, city);
    },
};
