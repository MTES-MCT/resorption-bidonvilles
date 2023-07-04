import JusticeProcedureBody from "./JusticeProcedureBody.vue";
import JusticeProcedureHead from "./JusticeProcedureHead.vue";

export default {
    icon: "balance-scale",
    title: "Nombre de sites faisant l'objet d'une procédure judiciaire",
    headComponent: JusticeProcedureBody,
    bodyComponent: JusticeProcedureHead,
    default: 0,
};
