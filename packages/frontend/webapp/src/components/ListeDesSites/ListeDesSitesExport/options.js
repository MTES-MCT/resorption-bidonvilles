export default [
    {
        id: "address_details",
        label: "Informations d'accès au site et coordonnées GPS",
        closedTowns: false,
    },
    {
        id: "owner",
        label: "Propriétaire",
        permission: {
            entity: "shantytown_owner",
            feature: "access",
        },
    },
    {
        id: "living_conditions",
        label: "Conditions de vie",
    },
    {
        id: "demographics",
        label: "Diagnostic",
    },
    {
        id: "justice",
        label: "Procédure judiciaire ou administrative",
        permission: {
            entity: "shantytown_justice",
            feature: "access",
        },
    },
    {
        id: "actors",
        label: "Intervenants",
    },
    {
        id: "comments",
        label: "Commentaires",
        description: ": les 5 derniers",
        permission: {
            entity: "shantytown_comment",
            feature: "list",
        },
    },
];
