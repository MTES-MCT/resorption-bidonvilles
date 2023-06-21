import PestAnimalsBody from "./PestAnimalsBody.vue";
import PestAnimalsHead from "./PestAnimalsHead.vue";

export default {
    icon: "bug-slash",
    title: "Nombre de sites sans nuisibles",
    headComponent: PestAnimalsHead,
    bodyComponent: PestAnimalsBody,
    default: 0,
};
