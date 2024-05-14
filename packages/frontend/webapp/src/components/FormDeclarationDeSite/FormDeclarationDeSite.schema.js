import { object, string, date, number, array, ref } from "yup";
import { computed } from "vue";
import labels from "./FormDeclarationDeSite.labels.js";

function emptyStringToNull(value, originalValue) {
    if (typeof originalValue === "string" && originalValue === "") {
        return null;
    }

    return value;
}

function makeNullableIfEdit(s, mode) {
    if (mode === "edit") {
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

    return s.required();
}

export default function (
    hasJusticePermission,
    hasOwnerPermission,
    mode = "create"
) {
    return computed(() => {
        const schema = {
            address: object().required().label(labels.address),
            name: string()
                .nullable()
                .label(labels.name)
                .matches(/^[^<>{}]*$/, "Le nom renseigné n'est pas valide"),
            built_at: date()
                .nullable()
                .typeError(`${labels.built_at} est invalide`)
                .when("declared_at", {
                    is: (value) => value instanceof Date && !isNaN(value),
                    then: (schema) => schema.max(ref("declared_at")),
                })
                .label(labels.built_at),
            declared_at: date()
                .typeError(`${labels.declared_at} est obligatoire`)
                .label(labels.declared_at),
            field_type: string().required().label(labels.field_type),
            detailed_address: string()
                .nullable()
                .label(labels.detailed_address),
            owner_type: number().required().label(labels.owner_type),
            owner: hasOwnerPermission.value
                ? string().nullable().label(labels.owner)
                : undefined,
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
            census_status: string().required().label(labels.census_status),
            census_conducted_at: date()
                .when("census_status", {
                    is: (value) => ["scheduled", "done"].includes(value),
                    then: (schema) =>
                        schema.typeError(
                            `${labels.census_conducted_at} est obligatoire`
                        ),
                    otherwise: (schema) =>
                        schema
                            .nullable()
                            .typeError(
                                `${labels.census_conducted_at} est invalide`
                            ),
                })
                .label(labels.census_conducted_at),
            census_conducted_by: string()
                .nullable()
                .when("census_status", {
                    is: (value) => ["scheduled", "done"].includes(value),
                    then: (schema) => schema.required(),
                })
                .label(labels.census_conducted_by),
            is_reinstallation: number()
                .oneOf([-1, 0, 1], "La valeur est invalide")
                .required()
                .label(labels.is_reinstallation),
            reinstallation_comments: string().label(
                labels.reinstallation_comments
            ),
            reinstallation_incoming_towns: array()
                .of(number())
                .label(labels.reinstallation_incoming_towns),
            ...(hasJusticePermission.value
                ? {
                      owner_complaint: number()
                          .required()
                          .label(labels.owner_complaint),
                      justice_procedure: number()
                          .required()
                          .label(labels.justice_procedure),
                      justice_rendered: number()
                          .when("justice_procedure", {
                              is: 1,
                              then: (schema) => schema.required(),
                          })
                          .label(labels.justice_rendered),
                      justice_rendered_at: date()
                          .when("justice_rendered", {
                              is: 1,
                              then: (schema) =>
                                  schema.typeError(
                                      `${labels.justice_rendered_at} est obligatoire`
                                  ),
                              otherwise: (schema) => schema.nullable(),
                          })
                          .label(labels.justice_rendered_at),
                      justice_rendered_by: string()
                          .when("justice_rendered", {
                              is: 1,
                              then: (schema) => schema.required(),
                          })
                          .label(labels.justice_rendered_by)
                          .matches(
                              /^[^<>{}]*$/,
                              'Le contenu du champ "Origine de la décision" n\'est pas valide'
                          ),
                      justice_challenged: number()
                          .when("justice_rendered", {
                              is: 1,
                              then: (schema) => schema.required(),
                          })
                          .label(labels.justice_challenged),
                      police_status: string()
                          .when("justice_procedure", {
                              is: 1,
                              then: (schema) => schema.required(),
                          })
                          .label(labels.police_status),
                      police_requested_at: string()
                          .when("police_status", {
                              is: (value) =>
                                  ["requested", "granted"].includes(value),
                              then: (schema) => schema.required(),
                          })
                          .label(labels.police_requested_at),
                      police_granted_at: string()
                          .when("police_status", {
                              is: "granted",
                              then: (schema) => schema.required(),
                          })
                          .label(labels.police_granted_at),
                      bailiff: string().label(labels.bailiff),
                      existing_litigation: number()
                          .when("evacuation_police_status", {
                              is: "granted",
                              then: (schema) => schema.required(),
                          })
                          .label(labels.evacuation_under_time_limit),
                      evacuation_under_time_limit: number()
                          .required()
                          .label(labels.evacuation_under_time_limit),
                      administrative_order_decision_at: date().label(
                          labels.administrative_order_decision_at
                      ),
                      administrative_order_decision_rendered_by: string()
                          .label(
                              labels.administrative_order_decision_rendered_by
                          )
                          .matches(
                              /^[^<>{}]*$/,
                              "Le contenu du champ \"Qui a pris l'arrêté\" n'est pas valide"
                          ),
                      administrative_order_evacuation_at: string().label(
                          labels.administrative_order_evacuation_at
                      ),
                      evacuation_police_status: string()
                          .when("evacuation_under_time_limit", {
                              is: 1,
                              then: (schema) => schema.required(),
                          })
                          .label(labels.police_status),
                      evacuation_police_requested_at: string()
                          .when("evacuation_police_status", {
                              is: (value) =>
                                  ["requested", "granted"].includes(value),
                              then: (schema) => schema.required(),
                          })
                          .label(labels.police_requested_at),
                      evacuation_police_granted_at: string()
                          .when("evacuation_police_status", {
                              is: "granted",
                              then: (schema) => schema.required(),
                          })
                          .label(labels.police_granted_at),
                      evacuation_bailiff: string().label(labels.bailiff),
                      insalubrity_order: number()
                          .required()
                          .label(labels.insalubrity_order),
                      insalubrity_order_displayed: number()
                          .when("insalubrity_order", {
                              is: 1,
                              then: (schema) => schema.required(),
                          })
                          .label(labels.insalubrity_order_displayed),
                      insalubrity_parcels: string().label(
                          labels.insalubrity_parcels
                      ),
                      insalubrity_police_status: string()
                          .when("insalubrity_order", {
                              is: 1,
                              then: (schema) => schema.required(),
                          })
                          .label(labels.police_status),
                      insalubrity_police_requested_at: string()
                          .when("insalubrity_police_status", {
                              is: (value) =>
                                  ["requested", "granted"].includes(value),
                              then: (schema) => schema.required(),
                          })
                          .label(labels.police_requested_at),
                      insalubrity_police_granted_at: string()
                          .when("insalubrity_police_status", {
                              is: "granted",
                              then: (schema) => schema.required(),
                          })
                          .label(labels.police_granted_at),
                      insalubrity_bailiff: string().label(labels.bailiff),
                  }
                : {}),
        };

        if (mode === "edit") {
            schema.update_to_date = number()
                .required()
                .oneOf([0, 1], "La valeur est invalide")
                .label(labels.update_to_date);
            schema.updated_at = date()
                .typeError(`${labels.updated_at} est obligatoire`)
                .label(labels.updated_at);
        }

        schema.water_access_type = makeNullableIfEdit(
            string().label(labels.water_access_type),
            mode
        );
        schema.water_access_type_details = string()
            .nullable()
            .when("water_access_type", {
                is: "autre",
                then: (schema) => schema.required(),
            })
            .label(labels.water_access_type_details);
        schema.water_access_is_public = number().label(
            labels.water_access_is_public
        );
        schema.water_access_is_continuous = number().label(
            labels.water_access_is_continuous
        );
        schema.water_access_is_continuous_details = string()
            .nullable()
            .when("water_access_is_continuous", {
                is: 0,
                then: (schema) => schema.required(),
            })
            .label(labels.water_access_is_continuous_details);
        schema.water_access_is_local = number().label(
            labels.water_access_is_local
        );
        schema.water_access_is_close = number().label(
            labels.water_access_is_close
        );
        schema.water_access_is_unequal = number().label(
            labels.water_access_is_unequal
        );
        schema.water_access_is_unequal_details = string()
            .nullable()
            .when("water_access_is_unequal", {
                is: 1,
                then: (schema) => schema.required(),
            })
            .label(labels.water_access_is_unequal_details);
        schema.water_access_has_stagnant_water = number().label(
            labels.water_access_has_stagnant_water
        );
        schema.water_access_comments = string()
            .nullable()
            .label(labels.water_access_comments);
        schema.sanitary_working_toilets = makeNullableIfEdit(
            number().label(labels.sanitary_working_toilets),
            mode
        );
        schema.sanitary_open_air_defecation = number().label(
            labels.sanitary_open_air_defecation
        );
        schema.sanitary_toilet_types = array()
            .of(string())
            .label(labels.sanitary_toilet_types);
        schema.sanitary_toilets_are_inside = number().label(
            labels.sanitary_toilets_are_inside
        );
        schema.sanitary_toilets_are_lighted = number().label(
            labels.sanitary_toilets_are_lighted
        );
        schema.sanitary_hand_washing = number().label(
            labels.sanitary_hand_washing
        );
        schema.electricity_access = makeNullableIfEdit(
            number().label(labels.electricity_access),
            mode
        );
        schema.electricity_access_types = array()
            .of(string())
            .label(labels.electricity_access_types);
        schema.electricity_access_is_unequal = number().label(
            labels.electricity_access_is_unequal
        );
        schema.trash_is_piling = makeNullableIfEdit(
            number().label(labels.trash_is_piling),
            mode
        );
        schema.trash_evacuation_is_close = makeNullableIfEdit(
            number().label(labels.trash_evacuation_is_close),
            mode
        );
        schema.trash_evacuation_is_safe = number().label(
            labels.trash_evacuation_is_safe
        );
        schema.trash_evacuation_is_regular = number().label(
            labels.trash_evacuation_is_regular
        );
        schema.trash_bulky_is_piling = number().label(
            labels.trash_bulky_is_piling
        );
        schema.pest_animals_presence = makeNullableIfEdit(
            number().label(labels.pest_animals_presence),
            mode
        );
        schema.pest_animals_details = string()
            .nullable()
            .label(labels.pest_animals_details);
        schema.fire_prevention_diagnostic = makeNullableIfEdit(
            number().label(labels.fire_prevention_diagnostic),
            mode
        );

        return object(schema);
    });
}
