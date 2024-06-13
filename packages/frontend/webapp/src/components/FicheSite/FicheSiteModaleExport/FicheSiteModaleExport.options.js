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
        label: "Procédures judiciaires et administratives",
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
];
