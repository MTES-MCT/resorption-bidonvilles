import FireBody from "./FireBody.vue";
import FireHead from "./FireHeadByInhabitant.vue";

export default {
    icon: "fire-extinguisher",
    title: "Nombre de personnes avec prévention incendie",
    headComponent: FireHead,
    bodyComponent: FireBody,
    default: 0,
};
