import { object, date, ref, array, string, number, addMethod } from "yup";
import labels from "./FormDeclarationAction.labels";
import locationTypes from "@/utils/action_location_types";
import { useConfigStore } from "@/stores/config.store";

function emptyStringToNull(value, originalValue) {
    if (typeof originalValue === "string" && originalValue === "") {
        return null;
    }

    return value;
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
        nombre_personnes: number()
            .typeError(`Nombre de personnes doit être un nombre`)
            .nullable()
            .transform(emptyStringToNull)
            .label("Nombre de personnes"),
        nombre_menages: number()
            .typeError(`Nombre de ménages doit être un nombre`)
            .nullable()
            .transform(emptyStringToNull),
        nombre_femmes: number()
            .typeError(`Nombre de femmes doit être un nombre`)
            .nullable()
            .transform(emptyStringToNull),
        nombre_mineurs: number()
            .typeError(`Nombre de mineurs doit être un nombre`)
            .nullable()
            .transform(emptyStringToNull),
        sante_nombre_personnes: number()
            .typeError(
                `Nombre de personnes ayant bénéficié d'un accompagnement vers la santé doit être un nombre`
            )
            .nullable()
            .transform(emptyStringToNull),
        travail_nombre_personnes: number()
            .typeError(
                `Nombre de personnes ayant eu au moins 1 contrat de travail doit être un nombre`
            )
            .nullable()
            .transform(emptyStringToNull),
        travail_nombre_femmes: number()
            .typeError(
                `Nombre de femmes ayant eu au moins 1 contrat de travail doit être un nombre`
            )
            .nullable()
            .transform(emptyStringToNull),
        hebergement_nombre_personnes: number()
            .typeError(
                `Nombre de personnes ayant eu accès à un hébergement doit être un nombre`
            )
            .nullable()
            .transform(emptyStringToNull),
        hebergement_nombre_menages: number()
            .typeError(
                `Nombre de ménages ayant eu accès à un hébergement doit être un nombre`
            )
            .nullable()
            .transform(emptyStringToNull),
        logement_nombre_personnes: number()
            .typeError(
                `Nombre de personnes ayant eu accès à un logement doit être un nombre`
            )
            .nullable()
            .transform(emptyStringToNull),
        logement_nombre_menages: number()
            .typeError(
                `Nombre de ménages ayant eu accès à un logement doit être un nombre`
            )
            .nullable()
            .transform(emptyStringToNull),
        scolaire_mineurs_scolarisables: number()
            .typeError(
                `Nombre de mineurs en âge d'être scolarisés doit être un nombre`
            )
            .nullable()
            .transform(emptyStringToNull),
        scolaire_mineurs_en_mediation: number()
            .typeError(
                `Nombre de mineurs bénéficiant d'une action de médiation doit être un nombre`
            )
            .nullable()
            .transform(emptyStringToNull),
        scolaire_nombre_maternelle: number()
            .typeError(
                `Nombre de mineurs scolarisés en maternelle doit être un nombre`
            )
            .nullable()
            .transform(emptyStringToNull),
        scolaire_nombre_elementaire: number()
            .typeError(
                `Nombre de mineurs scolarisés en élémentaire doit être un nombre`
            )
            .nullable()
            .transform(emptyStringToNull),
        scolaire_nombre_college: number()
            .typeError(
                `Nombre de mineurs scolarisés au collège doit être un nombre`
            )
            .nullable()
            .transform(emptyStringToNull),
        scolaire_nombre_lycee: number()
            .typeError(
                `Nombre de mineurs scolarisés au lycée doit être un nombre`
            )
            .nullable()
            .transform(emptyStringToNull),
        scolaire_nombre_autre: number()
            .typeError(
                `Nombre de mineurs scolarisés "autre" doit être un nombre`
            )
            .nullable()
            .transform(emptyStringToNull),
    };

    return object(schema);
}
