import TownsBody from "../components/cells/TownsBody.vue";
import TownsHead from "../components/cells/TownsHead.vue";

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
