import HeatwaveBody from "./HeatwaveBody.vue";
import HeatwaveHead from "./HeatwaveHeadByTown.vue";

export default {
    icon: "ri:sun-fill",
    title: "Nombre de sites sous alerte canicule",
    headComponent: HeatwaveHead,
    bodyComponent: HeatwaveBody,
    default: 0,
};
