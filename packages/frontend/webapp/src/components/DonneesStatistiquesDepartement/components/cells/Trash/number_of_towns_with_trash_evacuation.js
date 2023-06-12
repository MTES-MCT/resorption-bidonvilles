import setPercentageOf from "../../../utils/setPercentageOf";
import TrashBody from "./TrashBody.vue";
import TrashHead from "./TrashHead.vue";

export default {
    icon: "trash-alt",
    title: "Nombre de sites avec évacuation des déchets",
    headComponent: TrashHead,
    bodyComponent: TrashBody,
    default: 0,
    primaryMetric(summary, town) {
        summary.number_of_towns_with_trash_evacuation += town.trash_evacuation
            ? 1
            : 0;
    },
    secondaryMetric(summary, city) {
        setPercentageOf("number_of_towns_with_trash_evacuation", summary, city);
    },
};
