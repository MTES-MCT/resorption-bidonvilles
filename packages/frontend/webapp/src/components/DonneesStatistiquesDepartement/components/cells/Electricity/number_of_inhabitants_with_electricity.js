import ElectricityBody from "./ElectricityBody.vue";
import ElectricityHead from "./ElectricityHeadByInhabitant.vue";

export default {
    icon: "bolt",
    title: "Nombre de personnes avec accès à l'électricité",
    headComponent: ElectricityHead,
    bodyComponent: ElectricityBody,
    default: 0,
};
