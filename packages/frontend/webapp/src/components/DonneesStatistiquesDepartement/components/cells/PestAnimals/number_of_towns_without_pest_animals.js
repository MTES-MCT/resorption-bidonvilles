import setPercentageOf from "../../../utils/setPercentageOf";
import PestAnimalsBody from "./PestAnimalsBody.vue";
import PestAnimalsHead from "./PestAnimalsHead.vue";

export default {
    icon: "paw",
    title: "Nombre de sites sans nuisibles",
    headComponent: PestAnimalsHead,
    bodyComponent: PestAnimalsBody,
    default: 0,
    primaryMetric(summary, town) {
        summary.number_of_towns_without_pest_animals +=
            town.absence_of_pest_animals ? 1 : 0;
    },
    secondaryMetric(summary, city) {
        setPercentageOf("number_of_towns_without_pest_animals", summary, city);
    },
};
