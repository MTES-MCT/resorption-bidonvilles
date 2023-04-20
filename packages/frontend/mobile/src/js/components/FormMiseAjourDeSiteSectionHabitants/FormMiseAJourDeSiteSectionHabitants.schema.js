import { array, number, object, ref } from "yup";
import labels from "./FormMiseAJourDeSiteSectionHabitants.labels.js";

function emptyStringToNull(value, originalValue) {
    if (typeof originalValue === "string" && originalValue === "") {
        return null;
    }
    return value;
}

export default object({
    population_total: number()
        .nullable()
        .min(1)
        .transform(emptyStringToNull)
        .label(labels.population_total),
    population_couples: number()
        .nullable()
        .min(0)
        .transform(emptyStringToNull)
        .when("population_total", {
            is: (value) => value !== null && value !== undefined,
            then: (schema) => schema.max(ref("population_total")),
        })
        .label(labels.population_couples),
    population_minors: number()
        .nullable()
        .min(0)
        .transform(emptyStringToNull)
        .when("population_total", {
            is: (value) => value !== null && value !== undefined,
            then: (schema) => schema.max(ref("population_total")),
        })
        .label(labels.population_minors),
    population_minors_0_3: number()
        .nullable()
        .min(0)
        .transform(emptyStringToNull)
        .label(labels.population_minors_0_3),
    population_minors_3_6: number()
        .nullable()
        .min(0)
        .transform(emptyStringToNull)
        .label(labels.population_minors_3_6),
    population_minors_6_12: number()
        .nullable()
        .min(0)
        .transform(emptyStringToNull)
        .label(labels.population_minors_6_12),
    population_minors_12_16: number()
        .nullable()
        .min(0)
        .transform(emptyStringToNull)
        .label(labels.population_minors_12_16),
    population_minors_16_18: number()
        .nullable()
        .min(0)
        .transform(emptyStringToNull)
        .label(labels.population_minors_16_18),
    minors_in_school: number()
        .nullable()
        .min(0)
        .transform(emptyStringToNull)
        .label(labels.minors_in_school),
    social_origins: array().of(number()).label(labels.social_origins),
    caravans: number()
        .nullable()
        .min(0)
        .transform(emptyStringToNull)
        .label(labels.caravans),
    huts: number()
        .nullable()
        .min(0)
        .transform(emptyStringToNull)
        .label(labels.huts),
    tents: number()
        .nullable()
        .min(0)
        .transform(emptyStringToNull)
        .label(labels.tents),
    cars: number()
        .nullable()
        .min(0)
        .transform(emptyStringToNull)
        .label(labels.cars),
    mattresses: number()
        .nullable()
        .min(0)
        .transform(emptyStringToNull)
        .label(labels.mattresses),
});
