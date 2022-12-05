import { object, array, date, bool, string } from "yup";
import labels from "./FormFermetureDeSite.labels";
import closingReasons from "@/utils/closing_reasons";

export default (variant) => {
    const schema = {
        closed_with_solutions: bool()
            .required()
            .label(labels.closed_with_solutions),
    };

    if (variant === "declare") {
        schema.closed_at = date()
            .typeError(`${labels.closed_at} est obligatoire`)
            .required()
            .max(new Date())
            .label(labels.closed_at);
        schema.status = string()
            .required()
            .oneOf(closingReasons.map(({ value }) => value))
            .label(labels.status);
        schema.closing_context = string()
            .required()
            .label(labels.closing_context);
        schema.solutions = array()
            // .of(string().oneOf(requestTypes.map(({ value }) => value)))
            .required()
            .label(labels.solutions);
    }

    return object(schema);
};
