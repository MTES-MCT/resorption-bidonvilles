import { object, string, number, array, ref } from "yup";
import labels from "./MiseAjourDeSite.labels";

function emptyStringToNull(value, originalValue) {
    if (typeof originalValue === "string" && originalValue === "") {
        return null;
    }

    return value;
}

export default function (section) {
    let schema;
    if (section === "habitants") {
        schema = {
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
        };
    }

    if (section === "conditions-de-vie") {
        schema = {
            water_access_type: string()
                .label(labels.water_access_type)
                .required(),
            water_access_type_details: string()
                .nullable()
                .when("water_access_type", {
                    is: "autre",
                    then: (schema) => schema.required(),
                })
                .label(labels.water_access_type_details),
            water_access_is_public: number().label(
                labels.water_access_is_public
            ),
            water_access_is_continuous: number().label(
                labels.water_access_is_continuous
            ),
            water_access_is_continuous_details: string()
                .nullable()
                .when("water_access_is_continuous", {
                    is: 0,
                    then: (schema) => schema.required(),
                })
                .label(labels.water_access_is_continuous_details),
            water_access_is_local: number().label(labels.water_access_is_local),
            water_access_is_close: number().label(labels.water_access_is_close),
            water_access_is_unequal: number().label(
                labels.water_access_is_unequal
            ),
            water_access_is_unequal_details: string()
                .nullable()
                .when("water_access_is_unequal", {
                    is: 1,
                    then: (schema) => schema.required(),
                })
                .label(labels.water_access_is_unequal_details),

            water_access_has_stagnant_water: number().label(
                labels.water_access_has_stagnant_water
            ),
            water_access_comments: string()
                .nullable()
                .label(labels.water_access_comments),
            sanitary_working_toilets: number()
                .label(labels.sanitary_working_toilets)
                .required(),
            sanitary_open_air_defecation: number().label(
                labels.sanitary_open_air_defecation
            ),
            sanitary_toilet_types: array()
                .of(string())
                .label(labels.sanitary_toilet_types),
            sanitary_toilets_are_inside: number().label(
                labels.sanitary_toilets_are_inside
            ),
            sanitary_toilets_are_lighted: number().label(
                labels.sanitary_toilets_are_lighted
            ),
            sanitary_hand_washing: number().label(labels.sanitary_hand_washing),
            electricity_access: number()
                .label(labels.electricity_access)
                .required(),
            electricity_access_types: array()
                .of(string())
                .label(labels.electricity_access_types),
            electricity_access_is_unequal: number().label(
                labels.electricity_access_is_unequal
            ),
            trash_is_piling: number().label(labels.trash_is_piling).required(),
            trash_evacuation_is_close: number()
                .label(labels.trash_evacuation_is_close)
                .required(),
            trash_evacuation_is_safe: number().label(
                labels.trash_evacuation_is_safe
            ),
            trash_evacuation_is_regular: number().label(
                labels.trash_evacuation_is_regular
            ),
            trash_bulky_is_piling: number().label(labels.trash_bulky_is_piling),
            pest_animals_presence: number()
                .label(labels.pest_animals_presence)
                .required(),
            pest_animals_details: string()
                .nullable()
                .label(labels.pest_animals_details),
            fire_prevention_diagnostic: number()
                .label(labels.fire_prevention_diagnostic)
                .required(),
        };
    }

    return object(schema);
}
