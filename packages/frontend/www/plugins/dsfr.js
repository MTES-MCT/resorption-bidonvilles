import { useDsfr } from "../utils/dsfr.js";

export default defineNuxtPlugin(({ vueApp }) => {
    useDsfr(vueApp);
});
