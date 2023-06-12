import PersonsBody from "../components/cells/PersonsBody.vue";
import PersonsHead from "../components/cells/PersonsHead.vue";

export default {
    icon: "person",
    title: "Nombre de personnes",
    headComponent: PersonsHead,
    bodyComponent: PersonsBody,
    default: null,
    primaryMetric(summary, town) {
        if (Number.isFinite(town.number_of_persons)) {
            summary.number_of_persons += town.number_of_persons;
        }
    },
};
