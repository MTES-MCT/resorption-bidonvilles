module.exports = stats => {
    return [
        {
            ...stats.population,
            id: "population",
            icon: "male",
            label:
                stats.population.data.slice(-1)[0].figure > 1
                    ? "personnes"
                    : "personne",
            label_secondary: "sur",
            label_tertiary:
                stats.openShantytowns.data.slice(-1)[0].figure > 1
                    ? "sites"
                    : "site",
            figure_secondary: stats.openShantytowns.data.slice(-1)[0].figure,
            color: stats.population.evolution >= 0 ? "red" : "green"
        },
        {
            ...stats.minors,
            id: "children",
            icon: "child",
            label:
                stats.minors.data.slice(-1)[0].figure > 1
                    ? "enfants"
                    : "enfant",
            label_secondary: "dont",
            label_tertiary:
                stats.minorsInSchool.data.slice(-1)[0].figure > 1
                    ? "scolarisés"
                    : "scolarisé",
            figure_secondary: stats.minorsInSchool.data.slice(-1)[0].figure,
            color: stats.minors.evolution >= 0 ? "red" : "green"
        },
        {
            ...stats.resorbedShantytowns,
            id: "resorbed",
            icon: "check",
            label:
                stats.resorbedShantytowns.data.slice(-1)[0].figure > 1
                    ? "résorptions déclarées"
                    : "résorption déclarée",
            color: stats.resorbedShantytowns.evolution >= 0 ? "green" : "red"
        },
        {
            ...stats.closedShantytowns,
            id: "closed",
            icon: "ban",
            label:
                stats.closedShantytowns.data.slice(-1)[0].figure > 1
                    ? "fermetures"
                    : "fermeture",
            color: stats.closedShantytowns.evolution >= 0 ? "green" : "red"
        },
        {
            ...stats.connectedUserStats,
            id: "connectedUsers",
            icon: "user",
            label:
                stats.connectedUserStats.data.slice(-1)[0].figure > 1
                    ? "utilisateurs connectés ces 7 derniers jours"
                    : "utilisateur connecté ces 7 derniers jours",
            color: stats.connectedUserStats.evolution >= 0 ? "green" : "red"
        }
    ];
};
