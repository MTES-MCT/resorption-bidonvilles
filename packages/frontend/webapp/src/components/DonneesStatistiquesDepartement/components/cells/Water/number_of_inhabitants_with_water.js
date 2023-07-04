import WaterBody from "./WaterBody.vue";
import WaterHead from "./WaterHeadByInhabitant.vue";

export default {
    icon: "faucet-drip",
    title: "Nombre de personnes avec accès à l'eau",
    headComponent: WaterHead,
    bodyComponent: WaterBody,
    default: null,
};
