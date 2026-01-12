export default {
    population: {
        label: "Nombre de personnes",
        id: "population",
        options: [
            { value: "unknown", label: "Inconnu" },
            { value: "-9", label: "Moins de 10 personnes" },
            {
                value: "10-99",
                label: "Entre 10 et 99 personnes",
            },
            {
                value: "100-",
                label: "Plus de 100 personnes",
            },
        ],
    },
    fieldType: {
        label: "Type de sites",
        id: "fieldType",
        options: [
            { value: "3", label: "Terrain" },
            { value: "2", label: "Immeuble bâti" },
            { value: "1", label: "Autre" },
        ],
    },
    origin: {
        label: "Origines",
        id: "origin",
        options: [
            {
                value: "0",
                label: "Exclusivement UE",
                displayBottomBorder: true,
            },
            {
                type: "label",
                label: "Incluant...",
            },
            {
                value: "1",
                label: "Français",
                lineOffset: true,
            },
            {
                value: "2",
                label: "Union européenne",
                lineOffset: true,
            },
            {
                value: "3",
                label: "Hors Union européenne",
                lineOffset: true,
            },
            {
                value: "unknown",
                label: "Inconnu",
                lineOffset: true,
            },
        ],
    },
    target: {
        label: "Objectif résorption",
        id: "target",
        options: [
            { value: "yes", label: "Oui" },
            { value: "no", label: "Non" },
        ],
    },
    actors: {
        label: "Intervenants",
        id: "actors",
        options: [
            { value: "yes", label: "Oui" },
            { value: "no", label: "Non" },
        ],
    },
    justice: {
        label: "Procédure judiciaire",
        id: "justice",
        options: [
            { value: "unknown", label: "Inconnu" },
            { value: "none", label: "Aucune" },
            {
                value: "ownerComplaint",
                label: "Plainte déposée",
            },
            {
                value: "justiceProcedure",
                label: "Procédure en cours",
            },
            {
                value: "justiceRendered",
                label: "Décision rendue",
            },
        ],
    },
    heatwave: {
        label: "Risque Canicule",
        id: "heatwave",
        options: [
            { value: "yes", label: "Oui" },
            { value: "no", label: "Non" },
        ],
    },
    conditions: {
        label: "Conditions de vie",
        id: "conditions",
        options: [
            {
                type: "label",
                label: "Valeur(s) à améliorer",
            },
            {
                value: "accessToWater",
                label: "Eau",
            },
            {
                value: "accessToSanitary",
                label: "Toilettes",
            },
            {
                value: "accessToElectricity",
                label: "Électricité",
            },
            {
                value: "accessToTrash",
                label: "Évac. des déchets",
            },

            {
                value: "vermin",
                label: "Prés. de nuisibles",
            },
            {
                value: "firePreventionMeasures",
                label: "Prév. incendie",
            },
        ],
    },
    resorbedOrClosed: {
        label: "Résorbé / fermé",
        id: "resorbedOrClosed",
        options: [
            {
                value: "closed",
                label: "Fermé",
            },
            {
                value: "resorbed",
                label: "Résorbé",
            },
        ],
    },
    closingReason: {
        label: "Cause de la fermeture",
        id: "closingReason",
        options: [
            { value: "resorbed", label: "Résorption progressive du site" },
            {
                value: "closed_by_justice",
                label: "Décision de justice suite à une plainte du proriétaire",
            },
            {
                value: "closed_by_pref_admin",
                label: "Décision administrative de la préfecture",
            },
            {
                value: "closed_by_city_admin",
                label: "Décision administrative de la commune.",
            },
            { value: "other", label: "Autre" },
            { value: "unknown", label: "Raison inconnue" },
        ],
    },
    administrativeOrder: {
        label: "Procédure administrative",
        id: "administrativeOrder",
        options: [
            { value: "unknown", label: "Inconnu" },
            { value: "none", label: "Aucune" },
            {
                value: "evacuationUnderTimeLimit",
                label: "Procédure en cours",
            },
        ],
    },
    rhi: {
        label: "Opération RHI",
        id: "rhi",
        options: [
            { value: "unknown", label: "Inconnu" },
            { value: "none", label: "Aucune" },
            {
                value: "insalubrityOrder",
                label: "Procédure en cours",
            },
        ],
    },
    closureYear: {
        label: "Année de fermeture",
        id: "closureYear",
        options: [],
        singleSelection: true,
    },
};
