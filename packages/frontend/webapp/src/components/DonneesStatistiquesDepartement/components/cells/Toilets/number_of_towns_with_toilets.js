import ToiletsBody from "./ToiletsBody.vue";
import ToiletsHead from "./ToiletsHead.vue";

export default {
    icon: "toilet",
    title: "Nombre de sites avec accès aux toilettes",
    headComponent: ToiletsHead,
    bodyComponent: ToiletsBody,
    default: 0,
};
