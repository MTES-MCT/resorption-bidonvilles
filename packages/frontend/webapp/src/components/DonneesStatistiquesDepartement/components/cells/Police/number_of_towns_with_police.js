import PoliceBody from "./PoliceBody.vue";
import PoliceHead from "./PoliceHead.vue";

export default {
    icon: "person-military-pointing",
    title: "Nombre de sites faisant l'objet du concours de la force publique",
    headComponent: PoliceBody,
    bodyComponent: PoliceHead,
    default: 0,
};
