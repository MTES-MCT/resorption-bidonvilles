import FireBody from "./FireBody.vue";
import FireHead from "./FireHeadByTown.vue";

export default {
    icon: "fire-extinguisher",
    title: "Nombre de sites avec prévention incendie",
    headComponent: FireHead,
    bodyComponent: FireBody,
    default: 0,
};
