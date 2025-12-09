import { object, date, ref, array, string, number, addMethod, lazy } from "yup";
import labels from "./FormDeclarationAction.labels";
import locationTypes from "@/utils/action_location_types";
import { useConfigStore } from "@/stores/config.store";

function emptyStringToNull(value, originalValue) {
    if (typeof originalValue === "string" && originalValue === "") {
        return null;
    }

    return value;
}

// Helper pour créer un validateur numérique de base
function createNumberValidator(key, label) {
    return number()
        .typeError(`${key} - ${label} doit être un nombre`)
        .nullable()
        .transform(emptyStringToNull);
}

// Helper pour calculer la somme des niveaux scolaires
function calculateSchoolLevelsSum(parent) {
    return [
        parent.scolaire_nombre_maternelle,
        parent.scolaire_nombre_elementaire,
        parent.scolaire_nombre_college,
        parent.scolaire_nombre_lycee,
        parent.scolaire_nombre_autre,
    ].reduce((sum, val) => sum + (Number.isInteger(val) ? val : 0), 0);
}

// Helper pour la validation max-mineurs (pour les mineurs de moins/plus de 3 ans)
function addMaxMineursValidation(schema) {
    return schema.test(
        "max-mineurs",
        "Ne peut pas dépasser le nombre de mineurs",
        function (value) {
            if (value === null) {
                return true;
            }
            const { nombre_mineurs, nombre_personnes } = this.parent;
            const max = Number.isInteger(nombre_mineurs)
                ? nombre_mineurs
                : Number.isInteger(nombre_personnes)
                ? nombre_personnes
                : Infinity;
            return value <= max;
        }
    );
}

// Helper pour la validation de la somme des niveaux scolaires
function addSchoolLevelsSumValidation(schema) {
    return schema.test(
        "max-scolarises",
        "La somme des niveaux ne peut pas dépasser le nombre total de scolarisés",
        function () {
            const totalScolarises =
                this.parent.scolaire_mineur_scolarise_dans_annee;
            if (!Number.isInteger(totalScolarises)) {
                return true;
            }
            const sum = calculateSchoolLevelsSum(this.parent);
            return sum <= totalScolarises;
        }
    );
}

addMethod(object, "usersIsNotEmpty", function () {
    return this.test(
        "usersIsNotEmpty",
        ({ label }) => `${label} est obligatoire`,
        async function (value) {
            if (value?.users === undefined || value?.users === null) {
                return true;
            }

            try {
                await array()
                    .min(1, ({ label }) => `${label} est obligatoire`)
                    .validate(value.users);
                return true;
            } catch (error) {
                return false;
            }
        }
    );
});

export default function () {
    const configStore = useConfigStore();

    const schema = {
        name: string().required().label(labels.name),
        started_at: date()
            .typeError(`${labels.started_at} est obligatoire`)
            .label(labels.started_at),
        ended_at: date()
            .nullable()
            .typeError(`${labels.ended_at} est invalide`)
            .when("started_at", {
                is: (value) => value instanceof Date && !isNaN(value),
                then: (schema) => schema.min(ref("started_at")),
            })
            .label(labels.ended_at),
        topics: array()
            .of(string().oneOf(configStore.config.topics.map(({ uid }) => uid)))
            .required()
            .min(1, ({ label }) => `${label} est un champ obligatoire`)
            .label(labels.topics),
        goals: string().required().label(labels.goals),
        location_departement: string()
            .required()
            .label(labels.location_departement),
        location_type: string()
            .oneOf(locationTypes.map(({ uid }) => uid))
            .required()
            .label(labels.location_type),
        location_eti: object()
            .when("location_type", {
                is: "eti",
                then: (schema) => schema.required(),
            })
            .label(labels.location_eti),
        location_shantytowns: array()
            .of(number())
            .when("location_type", {
                is: "sur_site",
                then: (schema) =>
                    schema
                        .required()
                        .min(
                            1,
                            ({ label }) => `${label} est un champ obligatoire`
                        ),
            })
            .label(labels.location_shantytowns),
        location_autre: string()
            .when("location_type", {
                is: "autre",
                then: (schema) => schema.required(),
            })
            .label(labels.location_autre),
        managers: object().required().usersIsNotEmpty().label(labels.managers),
        operators: object()
            .required()
            .usersIsNotEmpty()
            .label(labels.operators),
        finances: object(),
        indicateurs: lazy((value) => {
            return object()
                .shape(
                    Object.keys(value || {}).reduce((acc, key) => {
                        acc[key] = object()
                            .required()
                            .shape({
                                nombre_personnes: number()
                                    .typeError(
                                        `${key} - Nombre de personnes doit être un nombre`
                                    )
                                    .nullable()
                                    .transform(emptyStringToNull)
                                    .label("Nombre de personnes"),
                                nombre_menages: number()
                                    .typeError(
                                        `${key} - Nombre de ménages doit être un nombre`
                                    )
                                    .nullable()
                                    .transform(emptyStringToNull),
                                nombre_femmes: createNumberValidator(
                                    key,
                                    "Nombre de femmes"
                                ),
                                nombre_mineurs: createNumberValidator(
                                    key,
                                    "Nombre de mineurs"
                                ),
                                sante_nombre_personnes: number()
                                    .typeError(
                                        `${key} - Nombre de personnes ayant bénéficié d'un accompagnement vers la santé doit être un nombre`
                                    )
                                    .nullable()
                                    .transform(emptyStringToNull),
                                travail_nombre_personnes: number()
                                    .typeError(
                                        `${key} - Nombre de personnes ayant eu au moins 1 contrat de travail doit être un nombre`
                                    )
                                    .nullable()
                                    .transform(emptyStringToNull),
                                travail_nombre_femmes: createNumberValidator(
                                    key,
                                    "Nombre de femmes ayant eu au moins 1 contrat de travail"
                                ),
                                hebergement_nombre_personnes: number()
                                    .typeError(
                                        `${key} - Nombre de personnes ayant eu accès à un hébergement doit être un nombre`
                                    )
                                    .nullable()
                                    .transform(emptyStringToNull),
                                hebergement_nombre_menages: number()
                                    .typeError(
                                        `${key} - Nombre de ménages ayant eu accès à un hébergement doit être un nombre`
                                    )
                                    .nullable()
                                    .transform(emptyStringToNull),
                                logement_nombre_personnes: number()
                                    .typeError(
                                        `${key} - Nombre de personnes ayant eu accès à un logement doit être un nombre`
                                    )
                                    .nullable()
                                    .transform(emptyStringToNull),
                                logement_nombre_menages: number()
                                    .typeError(
                                        `${key} - Nombre de ménages ayant eu accès à un logement doit être un nombre`
                                    )
                                    .nullable()
                                    .transform(emptyStringToNull),
                                scolaire_mineurs_moins_de_trois_ans:
                                    createNumberValidator(
                                        key,
                                        "Nombre de mineurs de moins de 3 ans identifiés sur site"
                                    ).when("$topics", (topics, schema) => {
                                        if (topics?.includes("school")) {
                                            return addMaxMineursValidation(
                                                schema
                                            );
                                        }
                                        return schema;
                                    }),
                                scolaire_mineurs_trois_ans_et_plus:
                                    createNumberValidator(
                                        key,
                                        "Nombre de mineurs de 3 ans et plus identifiés sur site"
                                    ).when("$topics", (topics, schema) => {
                                        if (topics?.includes("school")) {
                                            return addMaxMineursValidation(
                                                schema
                                            );
                                        }
                                        return schema;
                                    }),
                                scolaire_mediation_moins_de_trois_ans: number()
                                    .typeError(
                                        `${key} - Nombre de mineurs de moins de 3 ans bénéficiant d'une médiation doit être un nombre`
                                    )
                                    .nullable()
                                    .transform(emptyStringToNull),
                                scolaire_mediation_trois_ans_et_plus: number()
                                    .typeError(
                                        `${key} - Nombre de mineurs de 3 ans et plus bénéficiant d'une médiation doit être un nombre`
                                    )
                                    .nullable()
                                    .transform(emptyStringToNull),
                                scolaire_nombre_maternelle:
                                    createNumberValidator(
                                        key,
                                        "Nombre de mineurs scolarisés en maternelle"
                                    ).when("$topics", (topics, schema) => {
                                        if (topics?.includes("school")) {
                                            return addSchoolLevelsSumValidation(
                                                schema
                                            );
                                        }
                                        return schema;
                                    }),
                                scolaire_nombre_elementaire:
                                    createNumberValidator(
                                        key,
                                        "Nombre de mineurs scolarisés en élémentaire"
                                    ).when("$topics", (topics, schema) => {
                                        if (topics?.includes("school")) {
                                            return addSchoolLevelsSumValidation(
                                                schema
                                            );
                                        }
                                        return schema;
                                    }),
                                scolaire_nombre_college: createNumberValidator(
                                    key,
                                    "Nombre de mineurs scolarisés au collège"
                                ).when("$topics", (topics, schema) => {
                                    if (topics?.includes("school")) {
                                        return addSchoolLevelsSumValidation(
                                            schema
                                        );
                                    }
                                    return schema;
                                }),
                                scolaire_nombre_lycee: createNumberValidator(
                                    key,
                                    "Nombre de mineurs scolarisés au lycée"
                                ).when("$topics", (topics, schema) => {
                                    if (topics?.includes("school")) {
                                        return addSchoolLevelsSumValidation(
                                            schema
                                        );
                                    }
                                    return schema;
                                }),
                                scolaire_nombre_autre: createNumberValidator(
                                    key,
                                    'Nombre de mineurs scolarisés "autre"'
                                ).when("$topics", (topics, schema) => {
                                    if (topics?.includes("school")) {
                                        return addSchoolLevelsSumValidation(
                                            schema
                                        );
                                    }
                                    return schema;
                                }),
                                scolaire_mineur_scolarise_dans_annee:
                                    createNumberValidator(
                                        key,
                                        "Nombre de mineurs scolarisés dans l'année"
                                    ).when("$topics", (topics, schema) => {
                                        if (topics?.includes("school")) {
                                            return schema
                                                .test(
                                                    "max-mineurs",
                                                    "Ne peut pas dépasser le nombre de mineurs de 3 ans et plus",
                                                    function (value) {
                                                        if (value === null) {
                                                            return true;
                                                        }
                                                        const {
                                                            scolaire_mineurs_trois_ans_et_plus,
                                                        } = this.parent;
                                                        return (
                                                            !Number.isInteger(
                                                                scolaire_mineurs_trois_ans_et_plus
                                                            ) ||
                                                            value <=
                                                                scolaire_mineurs_trois_ans_et_plus
                                                        );
                                                    }
                                                )
                                                .test(
                                                    "min-somme-niveaux",
                                                    "Ne peut pas être inférieur à la somme des mineurs par niveau",
                                                    function (value) {
                                                        if (value === null) {
                                                            return true;
                                                        }
                                                        const sum =
                                                            calculateSchoolLevelsSum(
                                                                this.parent
                                                            );
                                                        return value >= sum;
                                                    }
                                                );
                                        }
                                        return schema;
                                    }),
                            })
                            .label("Indicateurs " + key);
                        return acc;
                    }, {})
                )
                .required()
                .label("Indicateurs");
        }),
    };

    return object(schema);
}
