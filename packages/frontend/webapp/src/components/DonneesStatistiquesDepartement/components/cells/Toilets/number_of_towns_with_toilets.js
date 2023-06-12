import setPercentageOf from "../../../utils/setPercentageOf";
import ToiletsBody from "./ToiletsBody.vue";
import ToiletsHead from "./ToiletsHead.vue";

export default {
    icon: "toilet",
    title: "Nombre de sites avec accès aux toilettes",
    headComponent: ToiletsHead,
    bodyComponent: ToiletsBody,
    default: 0,
    primaryMetric(summary, town) {
        summary.number_of_towns_with_toilets += town.toilets ? 1 : 0;
    },
    secondaryMetric(summary, city) {
        setPercentageOf("number_of_towns_with_toilets", summary, city);
    },
};
