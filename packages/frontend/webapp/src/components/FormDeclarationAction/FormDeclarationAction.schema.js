import { object, date, ref, array, string, number, addMethod } from "yup";
import labels from "./FormDeclarationAction.labels";
import locationTypes from "@/utils/action_location_types";
import { useConfigStore } from "@/stores/config.store";

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
        nombre_personnes: number(),
        nombre_menages: number(),
        nombre_femmes: number(),
        nombre_mineurs: number(),
        sante_nombre_personnes: number(),
        travail_nombre_personnes: number(),
        travail_nombre_femmes: number(),
        hebergement_nombre_personnes: number(),
        hebergement_nombre_menages: number(),
        logement_nombre_personnes: number(),
        logement_nombre_menages: number(),
        scolaire_mineurs_scolarisables: number(),
        scolaire_mineurs_en_mediation: number(),
        scolaire_nombre_maternelle: number(),
        scolaire_nombre_elementaire: number(),
        scolaire_nombre_college: number(),
        scolaire_nombre_lycee: number(),
        scolaire_nombre_autre: number(),
    };

    return object(schema);
}
