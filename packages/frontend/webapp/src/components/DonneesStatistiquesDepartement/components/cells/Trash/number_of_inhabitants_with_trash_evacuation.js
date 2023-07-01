import TrashBody from "./TrashBody.vue";
import TrashHead from "./TrashHeadByInhabitant.vue";

export default {
    icon: "trash-alt",
    title: "Nombre de personnes avec évacuation des déchets",
    headComponent: TrashHead,
    bodyComponent: TrashBody,
    default: 0,
};
