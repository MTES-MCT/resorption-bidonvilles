import { object, string, array } from "yup";
import labels from "./FormCreerStructure.labels";

export default object({
    name: string().required().label(labels.name),
    abbreviation: string().nullable().label(labels.abbreviation),
    type: string().required().label(labels.type),
    new_type_category: string()
        .nullable()
        .when("type", {
            is: "new",
            then: (schema) => schema.required(),
        })
        .label(labels.new_type_category),
    new_type_name: string()
        .when("type", {
            is: "new",
            then: (schema) => schema.required(),
        })
        .label(labels.new_type_name),
    new_type_abbreviation: string()
        .nullable()
        .label(labels.new_type_abbreviation),
    new_type_default_role: string()
        .when("type", {
            is: "new",
            then: (schema) => schema.required(),
        })
        .label(labels.new_type_default_role),
    intervention_areas: array()
        .required(`Le champ ${labels.intervention_areas} est obligatoire`)
        .min(1, `Le champ ${labels.intervention_areas} est obligatoire`)
        .label(labels.intervention_areas),
});
