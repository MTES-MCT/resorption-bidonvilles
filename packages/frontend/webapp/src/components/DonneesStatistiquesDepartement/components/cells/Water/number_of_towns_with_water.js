import setPercentageOf from "../../../utils/setPercentageOf";
import WaterBody from "./WaterBody.vue";
import WaterHead from "./WaterHead.vue";

export default {
    icon: "faucet-drip",
    title: "Nombre de sites avec accès à l'eau",
    headComponent: WaterHead,
    bodyComponent: WaterBody,
    default: null,
    primaryMetric(summary, town) {
        summary.number_of_towns_with_water +=
            town.access_to_water === "good" ? 1 : 0;
    },
    secondaryMetric(summary, city) {
        setPercentageOf("number_of_towns_with_water", summary, city);
    },
};
