import { object, array, date, bool, string } from "yup";
import labels from "./FormFermetureDeSite.labels";
import closingReasons from "@/utils/closing_reasons";

export default (variant) => {
    const schema = {
        closed_with_solutions: bool()
            .required()
            .label(labels.closed_with_solutions),
    };

    const formatDateFR = (d) =>
        new Intl.DateTimeFormat("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        }).format(d);

    if (variant === "declare") {
        const maxClosedAt = new Date();
        maxClosedAt.setDate(maxClosedAt.getDate() + 1);
        maxClosedAt.setHours(0, 0, 0, 0);
        const displayMaxClosedAt = new Date(maxClosedAt);
        displayMaxClosedAt.setDate(displayMaxClosedAt.getDate() - 1);

        schema.closed_at = date()
            .typeError(`${labels.closed_at} est obligatoire`)
            .required()
            .max(
                maxClosedAt,
                ({ label }) =>
                    `${label} ne peut pas être postérieure au ${formatDateFR(
                        displayMaxClosedAt
                    )}`
            )
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
