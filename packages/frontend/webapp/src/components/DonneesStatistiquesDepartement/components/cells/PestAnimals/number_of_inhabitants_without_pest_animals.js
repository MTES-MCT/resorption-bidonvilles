import PestAnimalsBody from "./PestAnimalsBody.vue";
import PestAnimalsHead from "./PestAnimalsHeadByInhabitant.vue";

export default {
    icon: "bug-slash",
    title: "Nombre de personnes sans nuisibles",
    headComponent: PestAnimalsHead,
    bodyComponent: PestAnimalsBody,
    default: 0,
};
