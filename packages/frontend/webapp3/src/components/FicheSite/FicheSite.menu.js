export default [
    {
        id: "caracteristiques",
        label: "Caractéristiques du site",
        route: "#caracteristiques",
    },
    {
        id: "fermeture",
        label: "Fermeture du site",
        route: "#fermeture",
        condition(town) {
            return town.closedAt !== null;
        },
    },
    {
        id: "actions",
        label: "Actions",
        route: "#actions",
        condition(town) {
            return town.plans.length > 0;
        },
    },
    {
        id: "habitants",
        label: "Habitants",
        route: "#habitants",
    },
    {
        id: "conditions_de_vie",
        label: "Conditions de vie et environnement",
        route: "#conditions_de_vie",
    },
    {
        id: "procedure_judiciaire",
        label: "Procédure judiciaire",
        route: "#procedure_judiciaire",
        condition(town, hasJusticePermission) {
            return hasJusticePermission === true;
        },
    },
    {
        id: "intervenants",
        label: "Intervenants",
        route: "#intervenants",
    },
    {
        id: "journal_du_site",
        label: "Journal du site",
        route: "#journal_du_site",
        icon: "comment",
        variant: "secondary",
    },
    {
        id: "historique",
        label: "Voir l'historique des modifications",
        route: "",
        icon: "history",
        variant: "primary",
    },
];
