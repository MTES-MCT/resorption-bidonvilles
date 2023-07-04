import TrashBody from "./TrashBody.vue";
import TrashHead from "./TrashHeadByTown.vue";

export default {
    icon: "trash-alt",
    title: "Nombre de sites avec évacuation des déchets",
    headComponent: TrashHead,
    bodyComponent: TrashBody,
    default: 0,
};
