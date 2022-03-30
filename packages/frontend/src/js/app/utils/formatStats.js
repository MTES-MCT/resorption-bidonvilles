module.exports = stats => {
    return [
        {
            ...stats.population,
            id: "population",
            icon: "male",
            label:
                stats.population.figures.slice(-1)[0] > 1
                    ? "personnes "
                    : "personne",
            label_secondary: "sur",
            label_tertiary:
                stats.openShantytowns.figures.slice(-1)[0] > 1
                    ? "sites"
                    : "site",
            figure_secondary: stats.openShantytowns.figures.slice(-1)[0],
            color: stats.population.evolution >= 0 ? "red" : "green"
        },
        {
            ...stats.minors,
            id: "children",
            icon: "child",
            label: stats.minors.figures.slice(-1)[0] > 1 ? "enfants" : "enfant",
            label_secondary: "dont",
            label_tertiary:
                stats.minorsInSchool.figures.slice(-1)[0] > 1
                    ? "scolarisés"
                    : "scolarisé",
            figure_secondary: stats.minorsInSchool.figures.slice(-1)[0],
            color: stats.minors.evolution >= 0 ? "red" : "green"
        },
        {
            ...stats.resorbedShantytowns,
            id: "resorbed",
            icon: "check",
            label:
                stats.resorbedShantytowns.figures.slice(-1)[0] > 1
                    ? "résorptions déclarées"
                    : "résorption déclarée",
            color: stats.resorbedShantytowns.evolution >= 0 ? "green" : "red"
        },
        {
            ...stats.closedShantytowns,
            id: "closed",
            icon: "ban",
            label:
                stats.closedShantytowns.figures.slice(-1)[0] > 1
                    ? "fermetures"
                    : "fermeture",
            color: stats.closedShantytowns.evolution >= 0 ? "green" : "red"
        },

        {
            ...stats.userStats,
            id: "users",
            icon: "user",
            label:
                stats.userStats.figures.slice(-1)[0] > 1
                    ? "utilisateurs"
                    : "utilisateur",
            color: stats.userStats.evolution >= 0 ? "green" : "red"
        }
    ];
};
