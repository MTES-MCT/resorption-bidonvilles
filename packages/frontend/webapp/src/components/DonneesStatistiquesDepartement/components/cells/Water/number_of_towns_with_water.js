import WaterBody from "./WaterBody.vue";
import WaterHead from "./WaterHeadByTown.vue";

export default {
    icon: "faucet-drip",
    title: "Nombre de sites avec accès à l'eau",
    headComponent: WaterHead,
    bodyComponent: WaterBody,
    default: null,
};
