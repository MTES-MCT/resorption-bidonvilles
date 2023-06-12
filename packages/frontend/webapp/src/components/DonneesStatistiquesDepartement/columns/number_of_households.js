import HouseholdsBody from "../components/cells/HouseholdsBody.vue";
import HouseholdsHead from "../components/cells/HouseholdsHead.vue";

export default {
    icon: "people-group",
    title: "Nombre de ménages",
    headComponent: HouseholdsHead,
    bodyComponent: HouseholdsBody,
    default: null,
    primaryMetric(summary, town) {
        if (Number.isFinite(town.number_of_households)) {
            summary.number_of_households += town.number_of_households;
        }
    },
};
