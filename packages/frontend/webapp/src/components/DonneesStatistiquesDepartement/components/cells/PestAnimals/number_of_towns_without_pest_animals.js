import PestAnimalsBody from "./PestAnimalsBody.vue";
import PestAnimalsHead from "./PestAnimalsHeadByTown.vue";

export default {
    icon: "mouse-field",
    title: "Nombre de sites sans nuisibles",
    headComponent: PestAnimalsHead,
    bodyComponent: PestAnimalsBody,
    default: 0,
};
