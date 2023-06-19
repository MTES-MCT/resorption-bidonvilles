import ElectricityBody from "./ElectricityBody.vue";
import ElectricityHead from "./ElectricityHead.vue";

export default {
    icon: "bolt",
    title: "Nombre de sites avec accès à l'électricité",
    headComponent: ElectricityHead,
    bodyComponent: ElectricityBody,
    default: 0,
};
