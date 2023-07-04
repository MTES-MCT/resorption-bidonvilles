import ComplaintsBody from "./ComplaintsBody.vue";
import ComplaintsHead from "./ComplaintsHead.vue";

export default {
    icon: "scroll",
    title: "Nombre de sites faisant l'objet d'une plainte du propriétaire",
    headComponent: ComplaintsBody,
    bodyComponent: ComplaintsHead,
    default: 0,
};
