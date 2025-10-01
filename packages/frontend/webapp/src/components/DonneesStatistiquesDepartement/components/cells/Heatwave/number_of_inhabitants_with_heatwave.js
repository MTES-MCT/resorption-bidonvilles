import HeatwaveBody from "./HeatwaveBody.vue";
import HeatwaveHead from "./HeatwaveHeadByInhabitant.vue";

export default {
    icon: "ri:sun-fill",
    title: "Nombre de personnes sous alerte canicule",
    headComponent: HeatwaveHead,
    bodyComponent: HeatwaveBody,
    default: 0,
};
