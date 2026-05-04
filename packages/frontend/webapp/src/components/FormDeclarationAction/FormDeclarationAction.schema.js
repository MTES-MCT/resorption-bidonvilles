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
            } catch {
                return false;
            }
        }
    );
});

function normalizeAddressForComparison(address) {
    return String(address)
        .normalize("NFD")
        .replaceAll(/[\u0300-\u036f]/g, "")
        .replaceAll(/[\u2018\u2019\u0027]/g, "'")
        .toLowerCase()
        .trim();
}

function createAddressKey(addr) {
    if (!addr?.data) {
        return null;
    }
    const normalizedAddress = normalizeAddressForComparison(addr.data.label);
    return `${normalizedAddress}|${
        addr.data.citycode
    }|${addr.data.coordinates?.join(",")}`;
}

addMethod(object, "noDuplicateAddress", function () {
    return this.test(
        "noDuplicateAddress",
        "Cette adresse est déjà présente dans la liste",
        function (value) {
            // value est l'objet address actuel
            const addressKey = createAddressKey(value);

            if (!addressKey) {
                return true;
            }

            // Récupérer le contexte complet du formulaire
            const { from, path } = this;

            // Extraire l'index de ce champ depuis le path (ex: "location_eti_addresses[0].address")
            const match = new RegExp(/\[(\d+)\]\.address$/).exec(path);
            if (!match) {
                return true;
            }
            const currentIndex = Number.parseInt(match[1], 10);

            // Récupérer toutes les adresses ETI depuis le formulaire parent
            const allAddresses = from[0]?.value?.location_eti_addresses;

            if (!allAddresses || allAddresses.length <= 1) {
                return true;
            }

            // Vérifier si cette adresse existe déjà ailleurs
            for (let i = 0; i < allAddresses.length; i++) {
                if (i === currentIndex) {
                    continue; // Ignorer l'adresse courante
                }

                const otherAddressKey = createAddressKey(
                    allAddresses[i].address
                );
                if (otherAddressKey && otherAddressKey === addressKey) {
                    return false; // Doublon détecté
                }
            }

            return true;
        }
    );
});

// Helper pour créer un champ nombre standardisé
// Utilise un format spécial pour encoder le fieldName dans le message
// Format: "FIELD:fieldName|MESSAGE:message"
// Le composant InputIndicateurs extrait le fieldName et affiche uniquement le message
const createNumberField = (fieldName, label) =>
    number()
        .typeError(`FIELD:${fieldName}|MESSAGE:${label} doit être un nombre`)
        .nullable()
        .transform(emptyStringToNull);

// Helper pour créer les champs indicateurs à partir d'un format compact
// Format: [name, label, hasLabel?]
const createFields = (baseFields) =>
    baseFields.map(([name, label, hasLabel]) => ({
        name,
        label,
        ...(hasLabel && { hasLabel }),
    }));

// Définition des champs d'indicateurs avec leurs labels
const indicateursFields = [
    // Démographie
    ...createFields([
        ["nombre_personnes", "Nombre de personnes", true],
        ["nombre_menages", "Nombre de ménages"],
        ["nombre_femmes", "Nombre de femmes"],
        ["nombre_mineurs", "Nombre de mineurs"],
    ]),

    // Santé
    ...createFields([
        [
            "sante_nombre_personnes",
            "Nombre de personnes ayant bénéficié d'un accompagnement vers la santé",
        ],
    ]),

    // Travail
    ...createFields([
        [
            "travail_nombre_personnes",
            "Nombre de personnes ayant eu au moins 1 contrat de travail",
        ],
        [
            "travail_nombre_femmes",
            "Nombre de femmes ayant eu au moins 1 contrat de travail",
        ],
    ]),

    // Hébergement
    ...createFields([
        [
            "hebergement_nombre_personnes",
            "Nombre de personnes ayant eu accès à un hébergement",
        ],
        [
            "hebergement_nombre_menages",
            "Nombre de ménages ayant eu accès à un hébergement",
        ],
    ]),

    // Logement
    ...createFields([
        [
            "logement_nombre_personnes",
            "Nombre de personnes ayant eu accès à un logement",
        ],
        [
            "logement_nombre_menages",
            "Nombre de ménages ayant eu accès à un logement",
        ],
    ]),

    // Scolaire
    ...createFields([
        [
            "scolaire_mineurs_scolarisables",
            "Nombre de mineurs en âge d'être scolarisés",
        ],
        [
            "scolaire_mineurs_en_mediation",
            "Nombre de mineurs bénéficiant d'une action de médiation",
        ],
        [
            "scolaire_nombre_maternelle",
            "Nombre de mineurs scolarisés en maternelle",
        ],
        [
            "scolaire_nombre_elementaire",
            "Nombre de mineurs scolarisés en élémentaire",
        ],
        ["scolaire_nombre_college", "Nombre de mineurs scolarisés au collège"],
        ["scolaire_nombre_lycee", "Nombre de mineurs scolarisés au lycée"],
        ["scolaire_nombre_autre", 'Nombre de mineurs scolarisés "autre"'],
    ]),
];

// Helper pour créer les champs d'indicateurs par catégorie
const createIndicateurFields = () => {
    // Créer tous les champs de base
    const fields = {};

    indicateursFields.forEach(({ name, label, hasLabel }) => {
        let field = createNumberField(name, label);

        // Ajouter le label explicite pour certains champs
        if (hasLabel) {
            field = field.label(label);
        }

        fields[name] = field;
    });

    // Appliquer les particularités (même approche que FormDeclarationDeSite)
    fields.nombre_femmes = fields.nombre_femmes.when("nombre_personnes", {
        is: (value) => value !== null && value !== undefined,
        then: (schema) =>
            schema.max(
                ref("nombre_personnes"),
                "FIELD:nombre_femmes|MESSAGE:Le nombre de femmes ne peut être supérieur au nombre de personnes"
            ),
    });

    return fields;
};

export default function formDeclarationAction() {
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
                is: (value) => value instanceof Date && !Number.isNaN(value),
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
        location_eti_addresses: array()
            .of(
                object().shape({
                    address: object()
                        .nullable()
                        .when("$location_type", {
                            is: "eti",
                            then: (schema) =>
                                schema.required(
                                    "L'adresse est obligatoire pour un Espace Temporaire d'Accompagnement"
                                ),
                        })
                        .noDuplicateAddress(),
                    coordinates: array().of(number()).nullable(),
                })
            )
            .when("location_type", {
                is: "eti",
                then: (schema) =>
                    schema
                        .required()
                        .min(
                            1,
                            "Au moins une adresse est requise pour un Espace Temporaire d'Accompagnement"
                        ),
            })
            .label("Adresses des Espaces Temporaires d'Accompagnement"),
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
                            .shape(createIndicateurFields())
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
