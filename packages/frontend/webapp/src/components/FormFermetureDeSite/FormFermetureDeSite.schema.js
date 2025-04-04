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
        const maxClosedAt = new Date();
        maxClosedAt.setHours(23, 59, 59, 999);

        schema.closed_at = date()
            .typeError(`${labels.closed_at} est obligatoire`)
            .required()
            .max(maxClosedAt)
            .label(labels.closed_at);
        schema.status = string()
            .required()
            .oneOf(
                closingReasons.map(({ value }) => value),
                `${labels.status} est obligatoire`
            )
            .label(labels.status);
        schema.closing_context = string()
            .typeError(`${labels.closing_context} est obligatoire`)
            .required()
            .label(labels.closing_context);
        schema.solutions = array()
            // .of(string().oneOf(requestTypes.map(({ value }) => value)))
            .required()
            .label(labels.solutions);
    }

    return object(schema);
};
