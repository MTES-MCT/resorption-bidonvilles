import ToiletsBody from "./ToiletsBody.vue";
import ToiletsHead from "./ToiletsHeadByInhabitant.vue";

export default {
    icon: "toilet",
    title: "Nombre de personnes avec accès aux toilettes",
    headComponent: ToiletsHead,
    bodyComponent: ToiletsBody,
    default: 0,
};
