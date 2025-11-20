import { object, string, date, number, array, ref, lazy } from "yup";
import { computed } from "vue";
import labels from "@/components/Common/FormEtFicheSite.labels";

function emptyStringToNull(value, originalValue) {
    if (originalValue !== null && originalValue !== "") {
        const parsedValue = parseInt(originalValue, 10);
        if (isNaN(parsedValue)) {
            // Ajout d'une vérification pour les valeurs de type String non autorisées
            if (typeof originalValue === "string") {
                return value;
            }
            return null;
        }
        return parsedValue;
    }
    return null;
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
                .matches(
                    /^[^<>{}]*$/,
                    `Le contenu du champ "${labels.name}" n'est pas valide`
                ),
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
            owners: hasOwnerPermission.value
                ? // On utilise yup.lazy pour rendre la validation de "owners" conditionnelle
                  lazy((value) => {
                      if (
                          Array.isArray(value) &&
                          value.length === 1 &&
                          !value[0].name
                      ) {
                          return array().nullable();
                      }

                      return array()
                          .of(
                              object({
                                  name: string()
                                      .nullable()
                                      .matches(
                                          /^[^<>{}]*$/,
                                          "Le nom du propriétaire contient des caractères non valides"
                                      ),
                                  type: number().required(
                                      "Le type du propriétaire est obligatoire"
                                  ),
                              })
                              // Note: La validation des propriétaires vides (nom vide + type "Inconnu")
                              // est gérée par le filtrage dans buildOwners() et les validations backend.
                              // On ne valide pas ici pour éviter les erreurs pendant la saisie.
                          )
                          .nullable()
                          .label(labels.owners);
                  })
                : undefined,
            population_total: number()
                .nullable()
                .min(1)
                .transform(emptyStringToNull)
                .label(labels.population_total),
            population_total_females: number()
                .nullable()
                .min(0)
                .transform(emptyStringToNull)
                .when("population_total", {
                    is: (value) => value !== null && value !== undefined,
                    then: (schema) => schema.max(ref("population_total")),
                })
                .label(labels.population_total_females),
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
            population_minors_girls: number()
                .nullable()
                .min(0)
                .transform(emptyStringToNull)
                .when("population_total", {
                    is: (value) => value !== null && value !== undefined,
                    then: (schema) => schema.max(ref("population_total")),
                })
                .when("population_minors", {
                    is: (value) => value !== null && value !== undefined,
                    then: (schema) => schema.max(ref("population_minors")),
                })
                .label(labels.population_minors_girls),
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
                                `Le contenu du champ "${labels.census_conducted_at}" n'est pas valide`
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
                .oneOf(
                    [-1, 0, 1],
                    `Le contenu du champ "${labels.is_reinstallation}" n'est pas valide`
                )
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
                                  schema
                                      .required()
                                      .typeError(
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
                              `Le contenu du champ ${labels.justice_rendered_by} n'est pas valide`
                          ),
                      justice_challenged: number()
                          .when("justice_rendered", {
                              is: 1,
                              then: (schema) => schema.required(),
                          })
                          .label(labels.justice_challenged),
                      evacuation_under_time_limit: number()
                          .required()
                          .label(labels.evacuation_under_time_limit),
                      administrative_order_decision_at: date()
                          .nullable()
                          .label(labels.administrative_order_decision_at),
                      administrative_order_decision_rendered_by: string()
                          .label(
                              labels.administrative_order_decision_rendered_by
                          )
                          .matches(
                              /^[^<>{}]*$/,
                              `Le contenu du champ ${labels.administrative_order_decision_rendered_by} n'est pas valide`
                          ),
                      administrative_order_evacuation_at: string()
                          .nullable()
                          .label(labels.administrative_order_evacuation_at),
                      insalubrity_order: number()
                          .required()
                          .label(labels.insalubrity_order),
                      insalubrity_order_displayed: number()
                          .nullable()
                          .label(labels.insalubrity_order_displayed),
                      insalubrity_order_type: string()
                          .nullable()
                          .label(labels.insalubrity_order_type)
                          .matches(
                              /^[^<>{}]*$/,
                              `Le contenu du champ "${labels.insalubrity_order_type}" n'est pas valide`
                          ),
                      insalubrity_order_by: string()
                          .nullable()
                          .label(labels.insalubrity_order_by)
                          .matches(
                              /^[^<>{}]*$/,
                              `Le contenu du champ "${labels.insalubrity_order_by}" n'est pas valide`
                          ),
                      insalubrity_parcels: string()
                          .nullable()
                          .label(labels.insalubrity_parcels)
                          .matches(
                              /^[^<>{}]*$/,
                              `Le contenu du champ "${labels.insalubrity_parcels}" n'est pas valide`
                          ),
                      police_status: string().label(labels.police_status),
                      police_requested_at: string()
                          .when("police_status", {
                              is: (value) =>
                                  ["requested", "granted", "refused"].includes(
                                      value
                                  ),
                              then: (schema) => schema.required(),
                          })
                          .label(labels.police_requested_at),
                      police_granted_at: string()
                          .when("police_status", {
                              is: "granted",
                              then: (schema) => schema.required(),
                          })
                          .label(labels.police_granted_at),
                      bailiff: string()
                          .label(labels.bailiff)
                          .matches(
                              /^[^<>{}]*$/,
                              `Le contenu du champ "${labels.bailiff}" n'est pas valide`
                          ),
                      existing_litigation: number()
                          .nullable()
                          .when("police_status", {
                              is: "granted",
                              then: (schema) =>
                                  schema
                                      .oneOf(
                                          [0, 1],
                                          `"${labels.existing_litigation}" ne peut être "Inconnu" si le concours de la force publique a été obtenu`
                                      )
                                      .required(
                                          `${labels.existing_litigation} est obligatoire`
                                      ),
                              otherwise: (schema) => schema.optional(),
                          })
                          .when("police_status", {
                              is: "null",
                              then: (schema) =>
                                  schema.oneOf(
                                      [-1],
                                      `Un contentieux ne peut être différent de "Inconnu" que si le concours de la force publique a été obtenu`
                                  ),
                          })
                          .label(labels.existing_litigation),
                  }
                : {}),
        };

        if (mode === "edit") {
            schema.update_to_date = number()
                .when("updated_without_any_change", {
                    is: false,
                    then: (schema) => schema.required(),
                    otherwise: (schema) => schema.nullable(),
                })
                .oneOf([0, 1, null], "La valeur est invalide")
                .label(labels.update_to_date);
            schema.updated_at = date()
                .when("updated_without_any_change", {
                    is: false,
                    then: (schema) => schema.required(),
                    otherwise: (schema) => schema.nullable(),
                })
                .typeError(`${labels.updated_at} est obligatoire`)
                .label(labels.updated_at);
            schema.updated_without_any_change = number().nullable();
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
