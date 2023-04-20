import { array, number, object, string } from "yup";
import labels from "./FormMiseAJourDeSiteSectionConditionsDeVie.labels";

function makeNullableIfEdit(s) {
    return s.when("living_conditions_version", {
        is: 2,
        then: (s2) => {
            return s2.required();
        },
        otherwise: (s2) => {
            return s2.nullable();
        },
    });
}

export default object({
    water_access_type: makeNullableIfEdit(
        string().label(labels.water_access_type)
    ),
    water_access_type_details: string()
        .nullable()
        .when("water_access_type", {
            is: "autre",
            then: (schema) => schema.required(),
        })
        .label(labels.water_access_type_details),
    water_access_is_public: number().label(labels.water_access_is_public),
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
    water_access_is_unequal: number().label(labels.water_access_is_unequal),
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
    sanitary_working_toilets: makeNullableIfEdit(
        number().label(labels.sanitary_working_toilets)
    ),
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
    electricity_access: makeNullableIfEdit(
        number().label(labels.electricity_access)
    ),
    electricity_access_types: array()
        .of(string())
        .label(labels.electricity_access_types),
    electricity_access_is_unequal: number().label(
        labels.electricity_access_is_unequal
    ),

    trash_is_piling: makeNullableIfEdit(number().label(labels.trash_is_piling)),
    trash_evacuation_is_close: makeNullableIfEdit(
        number().label(labels.trash_evacuation_is_close)
    ),
    trash_evacuation_is_safe: number().label(labels.trash_evacuation_is_safe),
    trash_evacuation_is_regular: number().label(
        labels.trash_evacuation_is_regular
    ),
    trash_bulky_is_piling: number().label(labels.trash_bulky_is_piling),

    pest_animals_presence: makeNullableIfEdit(
        number().label(labels.pest_animals_presence)
    ),
    pest_animals_details: string()
        .nullable()
        .label(labels.pest_animals_details),

    fire_prevention_diagnostic: makeNullableIfEdit(
        number().label(labels.fire_prevention_diagnostic)
    ),
});
