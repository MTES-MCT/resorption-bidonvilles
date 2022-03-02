module.exports = stats => {
    return [
        {
            ...stats.population,
            icon: "male",
            label: "personnes ",
            label_secondary: "sur",
            label_tertiary: "sites",
            figure_secondary: stats.openShantytowns.figures[0],
            color: stats.population.evolution >= 0 ? "red" : "green"
        },
        {
            ...stats.minors,
            icon: "child",
            label: `enfants`,
            label_secondary: "dont",
            label_tertiary: "scolarisés",
            figure_secondary: stats.minorsInSchool.figures[0],
            color: stats.minors.evolution >= 0 ? "red" : "green"
        },
        {
            ...stats.resorbedShantytowns,
            icon: "check",
            label: "sites résorbés",
            color: stats.resorbedShantytowns.evolution >= 0 ? "green" : "red"
        },
        {
            ...stats.closedShantytowns,
            icon: "ban",
            label: "sites fermés (hors résorption)",
            color: stats.closedShantytowns.evolution >= 0 ? "green" : "red"
        },

        {
            ...stats.userStats,
            icon: "user",
            label: "utilisateurs",
            color: stats.userStats.evolution >= 0 ? "green" : "red"
        }
    ];
};
