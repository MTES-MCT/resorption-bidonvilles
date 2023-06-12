import MinorsBody from "./MinorsBody.vue";
import MinorsHead from "./MinorsHead.vue";

export default {
    icon: "child",
    title: "Nombre de mineurs",
    headComponent: MinorsHead,
    bodyComponent: MinorsBody,
    default: null,
    primaryMetric(summary, town) {
        if (Number.isFinite(town.number_of_minors)) {
            summary.number_of_minors += town.number_of_minors;
        }
    },
};
