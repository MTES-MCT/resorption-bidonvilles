import PestAnimalsBody from "./PestAnimalsBody.vue";
import PestAnimalsHead from "./PestAnimalsHeadByInhabitant.vue";

export default {
    icon: "mouse-field",
    title: "Nombre de personnes sans nuisibles",
    headComponent: PestAnimalsHead,
    bodyComponent: PestAnimalsBody,
    default: 0,
};
