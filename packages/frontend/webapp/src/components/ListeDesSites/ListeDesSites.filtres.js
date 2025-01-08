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
            },
            {
                value: "1",
                label: "Français",
            },
            {
                value: "2",
                label: "Union européenne",
            },
            {
                value: "3",
                label: "Hors Union européenne",
            },
            {
                value: "unknown",
                label: "Inconnu",
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
                value: "accessToWater",
                label: "eau",
            },
            {
                value: "accessToSanitary",
                label: "toilettes",
            },
            {
                value: "accessToElectricity",
                label: "électricité",
            },
            {
                value: "accessToTrash",
                label: "évac. des déchets",
            },

            {
                value: "vermin",
                label: "pres. de nuisibles",
            },
            {
                value: "firePreventionMeasures",
                label: "prev. incendie",
            },
        ],
    },
    solvedOrClosed: {
        label: "Résorbé / fermé",
        id: "solvedOrClosed",
        options: [
            {
                value: "closed",
                label: "Fermé",
            },
            {
                value: "solved",
                label: "Résorbé",
            },
        ],
    },
    closingReason: {
        label: "Cause de la fermeture",
        id: "closingReason",
        options: [
            {
                value: "closed_by_justice",
                label: "Exécution d'une décision de justice",
            },
            {
                value: "closed_by_admin",
                label: "Exécution d'une décision administrative",
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
};
