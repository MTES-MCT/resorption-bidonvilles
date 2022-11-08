import { object, array, date, string } from "yup";
import labels from "./FicheSiteModaleFermeture.labels";
import closingReasons from "@/utils/closing_reasons";

export default object({
    date: date()
        .typeError(`${labels.date} est obligatoire`)
        .required()
        .max(new Date())
        .label(labels.date),
    closing_reasons: string()
        .required()
        .oneOf(closingReasons.map(({ value }) => value))
        .label(labels.closing_reasons),
    closing_context: string().required().label(labels.closing_context),
    closing_solutions: array()
        // .of(string().oneOf(requestTypes.map(({ value }) => value)))
        .required()
        .label(labels.closing_solutions),
});
