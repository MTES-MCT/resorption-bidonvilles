import setPercentageOf from "./utils/setPercentageOf";
import JusticeProcedureBody from "../components/cells/JusticeProcedureBody.vue";
import JusticeProcedureHead from "../components/cells/JusticeProcedureHead.vue";

export default {
    icon: "balance-scale",
    title: "Nombre de sites faisant l'objet d'une procédure judiciaire",
    headComponent: JusticeProcedureBody,
    bodyComponent: JusticeProcedureHead,
    default: 0,
    primaryMetric(summary, town) {
        summary.number_of_justice_procedure += town.justice_procedure ? 1 : 0;
    },
    secondaryMetric(summary, city) {
        setPercentageOf("number_of_justice_procedure", summary, city);
    },
};
