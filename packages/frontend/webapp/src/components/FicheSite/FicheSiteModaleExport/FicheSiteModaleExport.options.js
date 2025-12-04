export default [
    {
        id: "actions",
        label: "Actions sur le site",
    },
    {
        id: "actors",
        label: "Intervenants",
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
        id: "comments",
        label: "Commentaires",
        permission: {
            entity: "shantytown_comment",
            feature: "list",
        },
    },
    {
        id: "history",
        label: "Historique des modifications",
    },
    {
        id: "resorption_phases",
        label: "Phases préparatoires à la résorption",
        permission: {
            entity: "shantytown_resorption",
            feature: "export",
        },
    },
];
