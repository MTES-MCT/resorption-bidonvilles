import setPercentageOf from "./utils/setPercentageOf";
import ComplaintsBody from "../components/cells/ComplaintsBody.vue";
import ComplaintsHead from "../components/cells/ComplaintsHead.vue";

export default {
    icon: "scroll",
    title: "Nombre de sites faisant l'objet d'une plainte du propriétaire",
    headComponent: ComplaintsBody,
    bodyComponent: ComplaintsHead,
    default: 0,
    primaryMetric(summary, town) {
        summary.number_of_complaints += town.owner_complaint ? 1 : 0;
    },
    secondaryMetric(summary, city) {
        setPercentageOf("number_of_complaints", summary, city);
    },
};
