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
            } catch (error) {
                return false;
            }
        }
    );
});

function normalizeAddressForComparison(address) {
    return String(address)
        .normalize("NFD")
        .replaceAll(/[\u0300-\u036f]/g, "")
        .replaceAll(/['''\u2019]/g, "'")
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
            const match = path.match(/\[(\d+)\]\.address$/);
            if (!match) {
                return true;
            }
            const currentIndex = parseInt(match[1], 10);

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
const createNumberField = (key, label) =>
    number()
        .typeError(`${key} - ${label} doit être un nombre`)
        .nullable()
        .transform(emptyStringToNull);

// Définition des champs d'indicateurs avec leurs labels
const indicateursFields = [
    // Démographie
    { name: "nombre_personnes", label: "Nombre de personnes", hasLabel: true },
    { name: "nombre_menages", label: "Nombre de ménages" },
    { name: "nombre_femmes", label: "Nombre de femmes" },
    { name: "nombre_mineurs", label: "Nombre de mineurs" },

    // Santé
    {
        name: "sante_nombre_personnes",
        label: "Nombre de personnes ayant bénéficié d'un accompagnement vers la santé",
    },

    // Travail
    {
        name: "travail_nombre_personnes",
        label: "Nombre de personnes ayant eu au moins 1 contrat de travail",
    },
    {
        name: "travail_nombre_femmes",
        label: "Nombre de femmes ayant eu au moins 1 contrat de travail",
    },
    // Hébergement
    {
        name: "hebergement_nombre_personnes",
        label: "Nombre de personnes ayant eu accès à un hébergement",
    },
    {
        name: "hebergement_nombre_menages",
        label: "Nombre de ménages ayant eu accès à un hébergement",
    },
    // Logement
    {
        name: "logement_nombre_personnes",
        label: "Nombre de personnes ayant eu accès à un logement",
    },
    {
        name: "logement_nombre_menages",
        label: "Nombre de ménages ayant eu accès à un logement",
    },

    // Scolaire
    {
        name: "scolaire_mineurs_scolarisables",
        label: "Nombre de mineurs en âge d'être scolarisés",
    },
    {
        name: "scolaire_mineurs_en_mediation",
        label: "Nombre de mineurs bénéficiant d'une action de médiation",
    },
    {
        name: "scolaire_nombre_maternelle",
        label: "Nombre de mineurs scolarisés en maternelle",
    },
    {
        name: "scolaire_nombre_elementaire",
        label: "Nombre de mineurs scolarisés en élémentaire",
    },
    {
        name: "scolaire_nombre_college",
        label: "Nombre de mineurs scolarisés au collège",
    },
    {
        name: "scolaire_nombre_lycee",
        label: "Nombre de mineurs scolarisés au lycée",
    },
    {
        name: "scolaire_nombre_autre",
        label: 'Nombre de mineurs scolarisés "autre"',
    },
];

// Helper pour créer les champs d'indicateurs par catégorie
const createIndicateurFields = (key) => {
    // Créer tous les champs de base
    const fields = {};

    indicateursFields.forEach(({ name, label, hasLabel }) => {
        let field = createNumberField(key, name, label);

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
                "Le nombre de femmes ne peut être supérieur au nombre de personnes"
            ),
    });

    return fields;
};

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
        location_eti_addresses: array()
            .of(
                object().shape({
                    address: object().nullable(),
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
                            .shape(createIndicateurFields(key))
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
