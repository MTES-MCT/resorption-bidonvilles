import setPercentageOf from "../../../utils/setPercentageOf";
import FireBody from "./FireBody.vue";
import FireHead from "./FireHead.vue";

export default {
    icon: "fire-extinguisher",
    title: "Nombre de sites avec prévention incendie",
    headComponent: FireHead,
    bodyComponent: FireBody,
    default: 0,
    primaryMetric(summary, town) {
        summary.number_of_towns_with_fire_prevention +=
            town.fire_prevention === "good" ? 1 : 0;
    },
    secondaryMetric(summary, city) {
        setPercentageOf("number_of_towns_with_fire_prevention", summary, city);
    },
};
