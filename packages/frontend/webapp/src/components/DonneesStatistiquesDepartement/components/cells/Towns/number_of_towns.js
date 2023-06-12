import TownsBody from "./TownsBody.vue";
import TownsHead from "./TownsHead.vue";

export default {
    icon: "map-pin",
    title: "Nombre de sites",
    headComponent: TownsHead,
    bodyComponent: TownsBody,
    default: null,
    primaryMetric(summary, town, city) {
        summary.number_of_towns = city.towns.length;
    },
};
